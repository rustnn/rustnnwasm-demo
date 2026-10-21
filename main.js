import init, { inspectGraph, buildGraph } from "./pkg/rustnn_webnn_browser_demo.js";

const EXAMPLES = {
  "Add": `webnn_graph "add" v1 {
  inputs {
    lhs: f32[2, 2];
  }

  consts {
    rhs: f32[2, 2] @scalar(1.0);
  }

  nodes {
    sum = add(lhs, rhs);
  }

  outputs { sum; }
}`,

  "Activations": `webnn_graph "activations" v1 {
  inputs {
    x: f32[1, 16];
  }

  nodes {
    relu_out = relu(x);
    sigmoid_out = sigmoid(x);
    tanh_out = tanh(x);
  }

  outputs { relu_out; sigmoid_out; tanh_out; }
}`,

  "Tiny MLP + softmax": `webnn_graph "tiny_mlp" v1 {
  inputs {
    x: f32[1, 4];
  }

  consts {
    w1: f32[4, 8] @scalar(0.25);
    b1: f32[1, 8] @scalar(0.2);
    w2: f32[8, 3] @scalar(0.5);
    # Per-class scale [1.0, 2.5, -1.0] as little-endian float32 bytes.
    scale: f32[1, 3] @bytes([0, 0, 128, 63, 0, 0, 32, 64, 0, 0, 128, 191]);
  }

  nodes {
    h = matmul(x, w1);
    h_bias = add(h, b1);
    h_relu = relu(h_bias);
    logits = matmul(h_relu, w2);
    scaled = mul(logits, scale);
    probs = softmax(scaled, axis=1);
  }

  outputs { probs; }
}`,

  "Box blur (conv2d)": `webnn_graph "box_blur" v1 {
  inputs {
    image: f32[1, 1, 16, 16];
  }

  consts {
    kernel: f32[1, 1, 3, 3] @scalar(0.11111111);
  }

  nodes {
    blurred = conv2d(image, kernel, padding=[1, 1, 1, 1]);
  }

  outputs { blurred; }
}`,
};

const TYPED_ARRAYS = {
  float32: Float32Array,
  float16: globalThis.Float16Array,
  int32: Int32Array,
  uint32: Uint32Array,
  int8: Int8Array,
  uint8: Uint8Array,
  int64: BigInt64Array,
  uint64: BigUint64Array,
};

const $ = (id) => document.getElementById(id);
const els = {
  example: $("example"), power: $("power"), source: $("source"), run: $("run"),
  randomize: $("randomize"), status: $("status"), ops: $("ops"),
  inputs: $("inputs"), outputs: $("outputs"), timing: $("timing"), env: $("env"),
};

let inputEditors = new Map();

function setStatus(text, kind = "") {
  els.status.textContent = text;
  els.status.className = `status ${kind}`;
}

function pill(text, kind) {
  const span = document.createElement("span");
  span.className = `pill ${kind}`;
  span.textContent = text;
  els.env.append(span);
}

const elementCount = (shape) => shape.reduce((a, b) => a * b, 1);

function sampleValues(info, index) {
  const n = elementCount(info.shape);
  const [h, w] = info.shape.slice(-2);
  if (info.shape.length === 4 && h > 4 && w > 4) {
    // A bright square with noise makes conv2d results easy to see.
    return Array.from({ length: n }, (_, i) => {
      const y = Math.floor(i / w) % h;
      const x = i % w;
      const inside = y > h / 4 && y < (3 * h) / 4 && x > w / 4 && x < (3 * w) / 4;
      return +((inside ? 1 : 0) + (Math.random() - 0.5) * 0.3).toFixed(3);
    });
  }
  if (index < 0) return Array.from({ length: n }, () => +(Math.random() * 4 - 2).toFixed(3));
  return Array.from({ length: n }, (_, i) => +(-2 + (4 * i) / Math.max(n - 1, 1)).toFixed(3));
}

function formatValues(values, shape) {
  const fmt = (v) => (typeof v === "bigint" ? v.toString() : Number.isInteger(v) ? String(v) : v.toFixed(4));
  const last = shape.length ? shape[shape.length - 1] : 1;
  const rows = [];
  for (let i = 0; i < values.length; i += last) {
    rows.push(Array.from(values.slice(i, i + last), fmt).join("  "));
  }
  return rows.join("\n");
}

function heatmap(values, shape) {
  if (shape.length < 2) return null;
  const [h, w] = shape.slice(-2);
  if (h < 4 || w < 4) return null;
  const plane = Array.from(values.slice(0, h * w), Number);
  const min = Math.min(...plane);
  const max = Math.max(...plane);
  const canvas = document.createElement("canvas");
  canvas.className = "heatmap";
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(w, h);
  plane.forEach((v, i) => {
    const t = max > min ? (v - min) / (max - min) : 0;
    img.data.set([20 + 230 * t, 40 + 180 * t, 120 + 100 * (1 - t), 255], i * 4);
  });
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function tensorTitle(info) {
  const h = document.createElement("h3");
  h.innerHTML = `<code></code> <span class="muted"></span>`;
  h.querySelector("code").textContent = info.name;
  h.querySelector("span").textContent = `${info.dataType} [${info.shape.join(", ")}]`;
  return h;
}

function renderInputs(summary, random = false) {
  els.inputs.replaceChildren();
  inputEditors = new Map();
  if (!summary.inputs.length) {
    els.inputs.innerHTML = `<p class="muted">This graph has no inputs.</p>`;
  }
  summary.inputs.forEach((info, i) => {
    const box = document.createElement("div");
    box.className = "tensor";
    const editor = document.createElement("textarea");
    editor.spellcheck = false;
    editor.value = JSON.stringify(sampleValues(info, random ? -1 : i));
    editor.setAttribute("aria-label", `values for ${info.name}`);
    box.append(tensorTitle(info), editor);
    els.inputs.append(box);
    inputEditors.set(info.name, { info, editor });
  });
  els.ops.replaceChildren(
    ...summary.operations.map((op) => {
      const span = document.createElement("span");
      span.className = "op";
      span.textContent = op;
      return span;
    }),
  );
}

function inspect() {
  try {
    const summary = inspectGraph(els.source.value);
    renderInputs(summary);
    setStatus(`${summary.operations.length} operations parsed by rustnn`, "ok");
    return summary;
  } catch (err) {
    setStatus(String(err.message ?? err), "err");
    return null;
  }
}

function contextOptions() {
  const value = els.power.value;
  if (value === "cpu") return { accelerated: false };
  return { accelerated: true, powerPreference: value };
}

async function run() {
  els.run.disabled = true;
  els.outputs.replaceChildren();
  els.timing.textContent = "";
  try {
    setStatus("Creating context…");
    const context = await navigator.ml.createContext(contextOptions());

    setStatus("rustnn is building the graph…");
    const t0 = performance.now();
    const { graph, summary } = await buildGraph(context, els.source.value);
    const tBuild = performance.now() - t0;

    const inputs = {};
    for (const info of summary.inputs) {
      const Typed = TYPED_ARRAYS[info.dataType];
      if (!Typed) throw new Error(`No JavaScript typed array for ${info.dataType}`);
      const editor = inputEditors.get(info.name)?.editor;
      const values = JSON.parse(editor?.value ?? "[]");
      if (values.length !== elementCount(info.shape)) {
        throw new Error(`${info.name}: expected ${elementCount(info.shape)} values, got ${values.length}`);
      }
      const data = info.dataType.endsWith("64") ? Typed.from(values, BigInt) : Typed.from(values);
      const tensor = await context.createTensor({ dataType: info.dataType, shape: info.shape, writable: true });
      context.writeTensor(tensor, data);
      inputs[info.name] = tensor;
    }
    const outputs = {};
    for (const info of summary.outputs) {
      outputs[info.name] = await context.createTensor({ dataType: info.dataType, shape: info.shape, readable: true });
    }

    setStatus("Dispatching…");
    const t1 = performance.now();
    context.dispatch(graph, inputs, outputs);
    const results = await Promise.all(
      summary.outputs.map(async (info) => [info, await context.readTensor(outputs[info.name])]),
    );
    const tRun = performance.now() - t1;

    for (const [info, buffer] of results) {
      const Typed = TYPED_ARRAYS[info.dataType] ?? Uint8Array;
      const values = new Typed(buffer);
      const box = document.createElement("div");
      box.className = "tensor";
      const body = document.createElement("div");
      body.className = "body";
      const pre = document.createElement("pre");
      pre.className = "values";
      pre.textContent = formatValues(values, info.shape);
      body.append(pre);
      const canvas = heatmap(values, info.shape);
      if (canvas) body.append(canvas);
      box.append(tensorTitle(info), body);
      els.outputs.append(box);
    }
    els.timing.textContent = `build ${tBuild.toFixed(1)} ms · dispatch + read ${tRun.toFixed(1)} ms`;
    setStatus("Done", "ok");
    graph.destroy?.();
    context.destroy?.();
  } catch (err) {
    setStatus(String(err?.message ?? err), "err");
  } finally {
    els.run.disabled = !("ml" in navigator);
  }
}

async function main() {
  for (const name of Object.keys(EXAMPLES)) {
    els.example.append(new Option(name, name));
  }
  els.example.addEventListener("change", () => {
    els.source.value = EXAMPLES[els.example.value];
    inspect();
  });
  els.source.addEventListener("input", () => inspect());
  els.randomize.addEventListener("click", () => {
    const summary = inspect();
    if (summary) renderInputs(summary, true);
  });
  els.run.addEventListener("click", run);

  await init();
  pill("rustnn wasm loaded", "ok");
  if ("ml" in navigator) {
    pill("navigator.ml available", "ok");
  } else {
    pill("navigator.ml missing: enable WebNN (chrome://flags/#web-machine-learning-neural-network)", "err");
    els.run.disabled = true;
  }

  els.source.value = EXAMPLES[els.example.value];
  inspect();
}

main().catch((err) => setStatus(String(err?.message ?? err), "err"));
