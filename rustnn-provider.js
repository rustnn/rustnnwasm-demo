// Transformers.js inference provider backed by rustnn and the browser's WebNN API.
//
// It follows the pluggable-provider contract of huggingface/transformers.js#1732: Transformers.js
// keeps tokenization, configs, hub access and pooling; `load()` fetches a WebNN graph
// (`model.webnn`, `manifest.json`, `model.weights`) through the host's cache-aware
// `getModelFile()`, rustnn (wasm) builds it with `MLGraphBuilder`, and `forward()` runs it with
// WebNN tensors and `dispatch`.

import { Tensor } from "@huggingface/transformers";
import init, { loadWebnnModel } from "./pkg/rustnn_webnn_browser_demo.js";

const MODEL_FILES = ["model.webnn", "manifest.json", "model.weights"];

let wasmReady;

function artifactOptions(options, revision) {
  const { inferenceBackend: _backend, inferenceProvider: _provider, ...rest } = options;
  return { ...rest, revision, subfolder: null };
}

function toTypedInput(tensor, dataType, length) {
  const source = tensor.data;
  if (dataType === "int32") {
    const out = new Int32Array(length);
    for (let i = 0; i < source.length; i++) out[i] = Number(source[i]);
    return out;
  }
  if (dataType === "int64") {
    const out = new BigInt64Array(length);
    for (let i = 0; i < source.length; i++) out[i] = BigInt(source[i]);
    return out;
  }
  throw new Error(`Unsupported model input type ${dataType}`);
}

export class RustnnInferenceProvider {
  /**
   * @param {object} [options]
   * @param {string} [options.modelId] Hub repository for config and tokenizer.
   * @param {string} [options.artifactModelId] Hub repository holding the WebNN graph files.
   * @param {string} [options.revision] Revision of `artifactModelId`.
   * @param {MLContextOptions} [options.contextOptions] Passed to `navigator.ml.createContext`.
   * @param {(stage: string) => void} [options.onStage] Progress messages for the page.
   */
  constructor({
    modelId = "Xenova/all-MiniLM-L6-v2",
    artifactModelId = "tarekziade/all-MiniLM-L6-v2-webnn",
    revision = "main",
    contextOptions = { accelerated: true },
    onStage = () => {},
  } = {}) {
    this.modelId = modelId;
    this.artifactModelId = artifactModelId;
    this.revision = revision;
    this.contextOptions = contextOptions;
    this.onStage = onStage;
    this.capabilities = {
      devices: ["webnn"],
      dtypes: ["fp32"],
      tasks: ["feature-extraction"],
    };
  }

  listModelArtifacts() {
    return ["config.json", ...MODEL_FILES];
  }

  // The graph files live in `artifactModelId`, not in `modelId`: answer cache and size queries
  // for them there, and leave `config.json` to the host.
  async getModelArtifactMetadata(file, options) {
    if (!MODEL_FILES.includes(file)) return null;
    if (!options.getModelFileMetadata) throw new Error("Transformers.js did not provide `getModelFileMetadata()`.");
    const metadata = await options.getModelFileMetadata(
      this.artifactModelId,
      file,
      artifactOptions(options, this.revision),
    );
    return metadata.exists ? { size: metadata.size, fromCache: metadata.fromCache } : null;
  }

  async deleteModelArtifact(file, options) {
    if (!MODEL_FILES.includes(file)) return false;
    if (!options.deleteModelFile) throw new Error("Transformers.js did not provide `deleteModelFile()`.");
    return options.deleteModelFile(this.artifactModelId, file, artifactOptions(options, this.revision));
  }

  async load(options) {
    if (options.task && options.task !== "feature-extraction") {
      throw new Error(`rustnn provider does not support the "${options.task}" task.`);
    }
    if (!("ml" in navigator)) throw new Error("navigator.ml is unavailable: enable WebNN in this browser.");
    if (!options.getModelFile) throw new Error("Transformers.js did not provide `getModelFile()`.");

    wasmReady ??= init();
    await wasmReady;

    this.onStage("Downloading WebNN graph and weights");
    const fileOptions = artifactOptions(options, this.revision);
    const [graphBytes, manifestBytes, weights] = await Promise.all(
      MODEL_FILES.map((file) => options.getModelFile(this.artifactModelId, file, fileOptions)),
    );
    const decoder = new TextDecoder();

    this.onStage("Creating WebNN context");
    const context = await navigator.ml.createContext(this.contextOptions);
    const narrowInt64 = !context.opSupportLimits().input.dataTypes.includes("int64");

    this.onStage("rustnn is building the graph");
    const t0 = performance.now();
    const { graph, summary } = await loadWebnnModel(
      context,
      decoder.decode(graphBytes),
      decoder.decode(manifestBytes),
      weights,
      narrowInt64,
    );
    const buildMs = performance.now() - t0;

    const [output] = summary.outputs;
    const [, maxLength, hiddenSize] = output.shape;
    const inputTensors = {};
    for (const info of summary.inputs) {
      inputTensors[info.name] = await context.createTensor({
        dataType: info.dataType,
        shape: info.shape,
        writable: true,
      });
    }
    const outputTensor = await context.createTensor({
      dataType: output.dataType,
      shape: output.shape,
      readable: true,
    });

    let queue = Promise.resolve();
    const runRow = async (inputs, row, sequenceLength) => {
      for (const info of summary.inputs) {
        const source = inputs[info.name];
        if (!source) throw new Error(`Missing model input "${info.name}"`);
        const rowTensor = source.slice([row, row + 1]);
        context.writeTensor(inputTensors[info.name], toTypedInput(rowTensor, info.dataType, maxLength));
      }
      context.dispatch(graph, inputTensors, { [output.name]: outputTensor });
      const buffer = await context.readTensor(outputTensor);
      return new Float32Array(buffer, 0, sequenceLength * hiddenSize);
    };

    const forward = (inputs) => {
      const run = queue.then(async () => {
        const [batch, sequenceLength] = inputs.input_ids.dims;
        if (sequenceLength > maxLength) {
          throw new Error(`This WebNN graph takes at most ${maxLength} tokens; got ${sequenceLength}.`);
        }
        const data = new Float32Array(batch * sequenceLength * hiddenSize);
        for (let row = 0; row < batch; row++) {
          data.set(await runRow(inputs, row, sequenceLength), row * sequenceLength * hiddenSize);
        }
        return { [output.name]: new Tensor("float32", data, [batch, sequenceLength, hiddenSize]) };
      });
      queue = run.catch(() => {});
      return run;
    };

    return {
      forward,
      capabilities: { forward: { version: 1 } },
      info: { buildMs, narrowInt64, operations: summary.operations.length, maxLength, hiddenSize },
      async dispose() {
        await queue;
        for (const tensor of [...Object.values(inputTensors), outputTensor]) tensor.destroy();
        graph.destroy();
        context.destroy?.();
      },
    };
  }
}
