import { pipeline } from "@huggingface/transformers";
import { RustnnInferenceProvider } from "./rustnn-provider.js";

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";

const $ = (id) => document.getElementById(id);
const els = {
  power: $("power"), sentences: $("sentences"), runRustnn: $("run-rustnn"), runOrt: $("run-ort"),
  status: $("status"), timing: $("timing"), parity: $("parity"), env: $("env"),
  matrix: { rustnn: $("matrix-rustnn"), ort: $("matrix-ort") },
};

const extractors = { rustnn: null, ort: null };
const results = { rustnn: null, ort: null };
const timings = {};
let rustnnPower = null;

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

function contextOptions() {
  const value = els.power.value;
  if (value === "cpu") return { accelerated: false };
  return { accelerated: true, powerPreference: value };
}

function progress(label) {
  const files = new Map();
  return (event) => {
    if (event.status === "progress" && event.total) {
      files.set(event.file, [event.loaded, event.total]);
      let loaded = 0;
      let total = 0;
      for (const [l, t] of files.values()) { loaded += l; total += t; }
      setStatus(`${label}: downloading ${(loaded / 1e6).toFixed(1)} / ${(total / 1e6).toFixed(1)} MB`);
    }
  };
}

async function getExtractor(kind) {
  if (kind === "rustnn" && extractors.rustnn && rustnnPower !== els.power.value) {
    await extractors.rustnn.dispose();
    extractors.rustnn = null;
  }
  if (extractors[kind]) return extractors[kind];
  const t0 = performance.now();
  if (kind === "rustnn") {
    rustnnPower = els.power.value;
    const provider = new RustnnInferenceProvider({
      modelId: MODEL_ID,
      contextOptions: contextOptions(),
      onStage: (stage) => setStatus(`rustnn: ${stage}…`),
    });
    extractors.rustnn = await pipeline("feature-extraction", provider, {
      device: "webnn",
      dtype: "fp32",
      progress_callback: progress("rustnn"),
    });
  } else {
    extractors.ort = await pipeline("feature-extraction", MODEL_ID, {
      device: "wasm",
      dtype: "fp32",
      progress_callback: progress("ONNX Runtime"),
    });
  }
  timings[`${kind}Load`] = performance.now() - t0;
  return extractors[kind];
}

function sentences() {
  return els.sentences.value.split("\n").map((s) => s.trim()).filter(Boolean);
}

function cosineMatrix(embeddings) {
  return embeddings.map((a) => embeddings.map((b) => a.reduce((sum, v, i) => sum + v * b[i], 0)));
}

function renderMatrix(target, texts, matrix) {
  const table = document.createElement("table");
  const head = table.createTHead().insertRow();
  head.insertCell().textContent = "";
  texts.forEach((_, i) => { head.insertCell().textContent = `#${i + 1}`; });
  const body = table.createTBody();
  matrix.forEach((row, i) => {
    const tr = body.insertRow();
    const label = tr.insertCell();
    label.textContent = `#${i + 1} ${texts[i]}`;
    label.className = "label";
    row.forEach((value) => {
      const td = tr.insertCell();
      td.textContent = value.toFixed(3);
      td.style.setProperty("--level", Math.max(0, value).toFixed(3));
      td.className = "cell";
    });
  });
  target.replaceChildren(table);
}

function renderTiming() {
  const parts = [];
  for (const kind of ["rustnn", "ort"]) {
    const name = kind === "rustnn" ? "rustnn" : "ORT";
    if (timings[`${kind}Load`] != null) parts.push(`${name} load ${(timings[`${kind}Load`] / 1000).toFixed(1)} s`);
    if (timings[`${kind}Run`] != null) parts.push(`${name} embed ${timings[`${kind}Run`].toFixed(0)} ms`);
  }
  els.timing.textContent = parts.join(" · ");
}

function renderParity() {
  const { rustnn, ort } = results;
  if (!rustnn || !ort || rustnn.texts.join("\n") !== ort.texts.join("\n")) {
    els.parity.textContent = rustnn && ort ? "Run both on the same sentences to compare." : "";
    return;
  }
  let maxDiff = 0;
  let minCos = 1;
  rustnn.embeddings.forEach((a, i) => {
    const b = ort.embeddings[i];
    minCos = Math.min(minCos, a.reduce((sum, v, j) => sum + v * b[j], 0));
    a.forEach((v, j) => { maxDiff = Math.max(maxDiff, Math.abs(v - b[j])); });
  });
  els.parity.textContent =
    `rustnn vs ONNX Runtime: max |Δ| ${maxDiff.toExponential(2)} per dimension, ` +
    `lowest cosine similarity between the two embeddings of a sentence ${minCos.toFixed(6)}.`;
}

async function run(kind) {
  const texts = sentences();
  if (!texts.length) return setStatus("Enter at least one sentence.", "err");
  els.runRustnn.disabled = els.runOrt.disabled = true;
  try {
    const extractor = await getExtractor(kind);
    setStatus(`${kind === "rustnn" ? "rustnn" : "ONNX Runtime"}: embedding ${texts.length} sentences…`);
    const t0 = performance.now();
    const output = await extractor(texts, { pooling: "mean", normalize: true });
    timings[`${kind}Run`] = performance.now() - t0;
    const embeddings = output.tolist();
    results[kind] = { texts, embeddings };
    renderMatrix(els.matrix[kind], texts, cosineMatrix(embeddings));
    renderTiming();
    renderParity();
    const info = kind === "rustnn" ? extractors.rustnn.model?.info : null;
    setStatus(
      info
        ? `Done · ${info.operations} WebNN operations, built in ${info.buildMs.toFixed(0)} ms` +
            (info.narrowInt64 ? " · int64 narrowed to int32 for this browser" : "")
        : "Done",
      "ok",
    );
  } catch (err) {
    console.error(err);
    setStatus(String(err?.message ?? err), "err");
  } finally {
    els.runRustnn.disabled = !("ml" in navigator);
    els.runOrt.disabled = false;
  }
}

els.runRustnn.addEventListener("click", () => run("rustnn"));
els.runOrt.addEventListener("click", () => run("ort"));

if ("ml" in navigator) {
  pill("navigator.ml available", "ok");
} else {
  pill("navigator.ml missing: enable WebNN (chrome://flags/#web-machine-learning-neural-network)", "err");
  els.runRustnn.disabled = true;
}
pill(`model ${MODEL_ID}`, "");
