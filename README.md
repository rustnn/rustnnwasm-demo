# rustnn browser WebNN demos

rustnn compiled to WebAssembly, building graphs on the browser's WebNN API. Two pages:

- `index.html`, **graph playground**: edit a `.webnn` graph; rustnn parses it and builds it
  through the browser's `MLGraphBuilder`, and the page runs it.
- `embeddings.html`, **Transformers.js with a rustnn backend**: `pipeline('feature-extraction',
  provider)` using the pluggable inference providers of
  [transformers.js#1732](https://github.com/huggingface/transformers.js/pull/1732), with
  `all-MiniLM-L6-v2` compared against the default ONNX Runtime pipeline.

rustnn does not wire tensors and dispatch for the browser backend yet, so both pages create
tensors and call `dispatch` from JavaScript. See `../rustnn/docs/integration/webnn-browser.md`.

## Architecture (embeddings demo)

```
 embeddings.html / embeddings.js
        │  pipeline('feature-extraction', provider)      extractor(texts, { pooling, normalize })
        ▼
┌──────────────────────────── Transformers.js (PR #1732) ────────────────────────────┐
│  config + tokenizer (Xenova/all-MiniLM-L6-v2)      mean pooling, normalization     │
│  hub download + browser cache: getModelFile()      calls model.forward(inputs)     │
└─────────────┬───────────────────────────────────────────────────▲──────────────────┘
              │ load(options)                     forward(inputs) │ { last_hidden_state }
              ▼                                                   │
┌──────────────────────── rustnn-provider.js (RustnnInferenceProvider) ──────────────┐
│  load: fetch model.webnn, manifest.json, model.weights                             │
│        (tarekziade/all-MiniLM-L6-v2-webnn) and create an MLContext                 │
│  forward: pad each row to 128 tokens, writeTensor, dispatch, readTensor, unpad     │
└─────────────┬───────────────────────────────────────────────────▲──────────────────┘
              │ loadWebnnModel(context, text, manifest, weights)  │ MLGraph
              ▼                                                   │
┌──────────────────────── rustnn (wasm, pkg/ from src/lib.rs) ───────────────────────┐
│  parse .webnn ─► inline weights ─► GraphInfo ─► narrow int64 to int32 if needed    │
│  converters::webnn::convert_async: one MLGraphBuilder call per operation, build()  │
└─────────────┬──────────────────────────────────────────────────────────────────────┘
              │ MLGraphBuilder calls          (the provider dispatches the MLGraph)
              ▼
┌──────────────── browser WebNN (navigator.ml): GPU, NPU or CPU backend ─────────────┐
└────────────────────────────────────────────────────────────────────────────────────┘
```

## Build and run

```bash
cd rustnnwasm-demo
wasm-pack build --target web --release --no-typescript --no-pack   # writes pkg/
python3 serve.py                                                    # http://127.0.0.1:8137/, no-cache headers
```

The embeddings page also needs the transformers.js PR branch, built in `vendor/` (gitignored)
and mapped with an import map in `embeddings.html`:

```bash
git clone --depth 1 --branch nico/pluggable-inference-providers \
  https://github.com/huggingface/transformers.js vendor/transformers.js
cd vendor/transformers.js
npm exec --yes --package=pnpm@10.28.1 -- pnpm install
npm exec --yes --package=pnpm@10.28.1 -- pnpm \
  --filter @huggingface/transformers-onnxruntime --filter @huggingface/transformers build
```

`serve.py` makes the browser revalidate every file, so a rebuilt `pkg/` or edited JavaScript
is picked up on reload (`python3 -m http.server` lets Chrome cache them).

Open http://localhost:8137/ in a browser with WebNN enabled. For Chrome, either turn on
`chrome://flags/#web-machine-learning-neural-network` or start a separate instance:

```bash
open -na "Google Chrome" --args --user-data-dir=/tmp/chrome-webnn \
  --enable-features=WebMachineLearningNeuralNetwork http://localhost:8137/
```

`.cargo/config.toml` sets the wasm32 target and the `RUSTFLAGS` the WebNN bindings need
(`+reference-types`, `--cfg=web_sys_unstable_apis`).

## Notes

- The `.webnn` text parser depends on `pest`, which pulls in `stacker` and `psm`. `psm`'s
  assembly does not build for wasm32 with Apple's clang, so `src/lib.rs` provides the one symbol
  `stacker` uses there (`rust_psm_stack_pointer`).
- Chrome on macOS accepts only `float32`, `float16` and `int32` inputs and has no int64
  constants. `loadWebnnModel` narrows int64 to int32 when `opSupportLimits()` lacks int64; the
  provider then writes `Int32Array` inputs.
- The embeddings page needs rustnn's WebNN converter to lower `squeeze` and `unsqueeze` (not
  WebNN operations) to `reshape`, as the specification's emulation does; `../rustnn` carries that
  change.
- The MiniLM WebNN graph has a fixed `[1, 128]` input. The provider runs one row at a time and
  rejects sequences longer than 128 tokens.
- In the playground, constants use `@scalar(v)` or `@bytes([...])` (little-endian), since the
  page has no weights file.

## Publishing to GitHub Pages

```bash
wasm-pack build --target web --release --no-typescript --no-pack
scripts/publish-pages.sh            # --no-push only assembles site/
```

The script copies the pages, `pkg/` and the vendor files the import map uses into `site/`, and
force-pushes them as the `gh-pages` branch. The wasm is prebuilt locally, not in CI, because it
links the local `../rustnn` checkout. Visitors need a browser with WebNN enabled.
