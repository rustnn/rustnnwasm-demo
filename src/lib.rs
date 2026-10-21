//! WebAssembly entry points for the browser WebNN demos.
//!
//! `build_graph` and `load_webnn_model` parse `.webnn` text with rustnn, then replay the graph
//! through the page's `MLGraphBuilder` (`rustnn::converters::webnn::convert_async`). Tensors and
//! dispatch stay in JavaScript, because rustnn does not wire them for the browser backend yet.

use rustnn::backends::webnn::api_generated::{MlContext, MlGraph};
use rustnn::operator_enums::MLOperandDataType;
use rustnn::{DataType, GraphInfo, OperandKind, Operation};
use serde::Serialize;
use wasm_bindgen::prelude::*;
use webnn_graph::ast::{ConstInit, GraphJson};
use webnn_graph::weights::WeightsManifest;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct TensorInfo {
    name: String,
    data_type: serde_json::Value,
    shape: Vec<u32>,
}

#[derive(Serialize)]
struct GraphSummary {
    operations: Vec<String>,
    inputs: Vec<TensorInfo>,
    outputs: Vec<TensorInfo>,
}

fn parse_json(text: &str) -> Result<GraphJson, JsError> {
    let sanitized = rustnn::loader::sanitize_webnn_identifiers(text);
    webnn_graph::parser::parse_wg_text(&sanitized)
        .map_err(|e| JsError::new(&format!("parse error: {e}")))
}

fn parse(text: &str) -> Result<GraphInfo, JsError> {
    Ok(rustnn::webnn_json::from_graph_json_owned(parse_json(text)?)?)
}

/// Inlines every `@weights("key")` constant from an in-memory weights file, the way
/// `rustnn::loader` does from disk.
fn resolve_weights(graph: &mut GraphJson, manifest: &str, weights: &[u8]) -> Result<(), JsError> {
    let manifest: WeightsManifest = serde_json::from_str(manifest)
        .map_err(|e| JsError::new(&format!("manifest.json: {e}")))?;
    for (name, decl) in graph.consts.iter_mut() {
        let ConstInit::Weights { r#ref } = &decl.init else {
            continue;
        };
        let entry = manifest
            .tensors
            .get(r#ref)
            .ok_or_else(|| JsError::new(&format!("constant {name}: no manifest entry {ref:?}")))?;
        let start = entry.byte_offset as usize;
        let bytes = weights
            .get(start..start + entry.byte_length as usize)
            .ok_or_else(|| JsError::new(&format!("constant {name}: out of the weights file")))?;
        decl.init = ConstInit::InlineBytes {
            bytes: bytes.to_vec(),
        };
    }
    Ok(())
}

fn narrow_data_type(data_type: &mut MLOperandDataType) {
    if *data_type == MLOperandDataType::Int64 {
        *data_type = MLOperandDataType::Int32;
    }
}

/// Rewrites int64 operands, constants and casts to int32, for browsers whose WebNN backend has
/// no int64 (Chrome on macOS). Constant values are saturated to the int32 range, so the
/// `i64::MAX` ends ONNX exporters put in slices stay "until the end".
fn narrow_int64(graph: &mut GraphInfo) {
    for (id, operand) in graph.operands.iter_mut().enumerate() {
        if operand.descriptor.data_type != DataType::Int64 {
            continue;
        }
        operand.descriptor.data_type = DataType::Int32;
        if let Some(constant) = graph.constant_operand_ids_to_handles.get_mut(&(id as u32)) {
            constant.data = constant
                .data
                .chunks_exact(8)
                .flat_map(|chunk| {
                    let value = i64::from_le_bytes(chunk.try_into().unwrap());
                    (value.clamp(i32::MIN as i64, i32::MAX as i64) as i32).to_le_bytes()
                })
                .collect();
        }
    }
    for operation in graph.operations.iter_mut() {
        match operation {
            Operation::Cast { data_type, .. } => narrow_data_type(data_type),
            Operation::ArgMin { options, .. } | Operation::ArgMax { options, .. } => {
                if let Some(options) = options {
                    narrow_data_type(&mut options.output_data_type);
                }
            }
            _ => {}
        }
    }
}

fn tensors(graph: &GraphInfo, kind: OperandKind) -> Vec<TensorInfo> {
    let ids = match kind {
        OperandKind::Input => &graph.input_operands,
        _ => &graph.output_operands,
    };
    ids.iter()
        .map(|&id| {
            let operand = &graph.operands[id as usize];
            TensorInfo {
                // Same fallback as the converters use for unnamed operands.
                name: operand.name.clone().unwrap_or_else(|| format!("operand_{id}")),
                data_type: serde_json::to_value(operand.descriptor.data_type).unwrap(),
                shape: operand.descriptor.static_or_max_shape(),
            }
        })
        .collect()
}

fn summarize(graph: &GraphInfo) -> GraphSummary {
    GraphSummary {
        operations: graph
            .operations
            .iter()
            .map(|op| op.op_type().to_string())
            .collect(),
        inputs: tensors(graph, OperandKind::Input),
        outputs: tensors(graph, OperandKind::Output),
    }
}

/// `{ graph, summary }`, as returned to JavaScript.
fn built(graph: MlGraph, graph_info: &GraphInfo) -> Result<JsValue, JsError> {
    let result = js_sys::Object::new();
    js_sys::Reflect::set(&result, &"graph".into(), &graph).unwrap();
    js_sys::Reflect::set(
        &result,
        &"summary".into(),
        &serde_wasm_bindgen::to_value(&summarize(graph_info))?,
    )
    .unwrap();
    Ok(result.into())
}

/// Parses `.webnn` text and returns its operations, inputs and outputs.
#[wasm_bindgen(js_name = inspectGraph)]
pub fn inspect_graph(text: &str) -> Result<JsValue, JsError> {
    Ok(serde_wasm_bindgen::to_value(&summarize(&parse(text)?))?)
}

/// Parses `.webnn` text and builds it on `context`; resolves to `{ graph, summary }`.
#[wasm_bindgen(js_name = buildGraph)]
pub async fn build_graph(context: MlContext, text: String) -> Result<JsValue, JsError> {
    let graph_info = parse(&text)?;
    let graph = rustnn::converters::webnn::convert_async(&context, &graph_info).await?;
    built(graph, &graph_info)
}

/// Builds a model published as `model.webnn`, `manifest.json` and `model.weights` on `context`;
/// resolves to `{ graph, summary }`. With `narrow_int64`, int64 inputs, outputs and constants
/// become int32 and `summary` reports the narrowed types.
#[wasm_bindgen(js_name = loadWebnnModel)]
pub async fn load_webnn_model(
    context: MlContext,
    text: String,
    manifest: String,
    weights: Vec<u8>,
    narrow_int64_types: bool,
) -> Result<JsValue, JsError> {
    let mut graph_json = parse_json(&text)?;
    resolve_weights(&mut graph_json, &manifest, &weights)?;
    drop(weights);
    let mut graph_info = rustnn::webnn_json::from_graph_json_owned(graph_json)?;
    if narrow_int64_types {
        narrow_int64(&mut graph_info);
    }
    let graph = rustnn::converters::webnn::convert_async(&context, &graph_info).await?;
    built(graph, &graph_info)
}

/// `pest` (the `.webnn` text parser) pulls in `stacker`, whose `psm` dependency implements this
/// symbol in assembly that Apple's clang cannot compile for wasm32. On wasm32 `stacker` never
/// learns the stack limit, so it never switches stacks and only asks for the current stack
/// pointer; the address of a local in the shadow stack is that value.
#[unsafe(no_mangle)]
pub extern "C" fn rust_psm_stack_pointer() -> *mut u8 {
    let marker = 0u8;
    std::hint::black_box(&marker as *const u8 as *mut u8)
}
