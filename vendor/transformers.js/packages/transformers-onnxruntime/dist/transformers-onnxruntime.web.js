const __ONNX_MODULE_URL__ = import.meta.url;
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/host.ts
var ONNX_HOST_SYMBOL = /* @__PURE__ */ Symbol.for("transformers.js.onnxProviderHost");
var configuredHost = globalThis[ONNX_HOST_SYMBOL] ?? null;
var fallbackEnvironment = {
  backends: { onnx: {} },
  logLevel: 30,
  useWasmCache: typeof caches !== "undefined",
  fetch: () => Promise.reject(new Error("OnnxInferenceProvider host does not provide a fetch implementation."))
};
var environment = new Proxy(fallbackEnvironment, {
  get(target, property) {
    return Reflect.get(configuredHost?.env ?? target, property);
  },
  set(target, property, value) {
    return Reflect.set(configuredHost?.env ?? target, property, value);
  }
});
var fallbackApis = {
  IS_NODE_ENV: typeof process !== "undefined" && process?.release?.name === "node",
  IS_WEB_ENV: typeof window !== "undefined" || typeof self !== "undefined",
  IS_WEBGPU_AVAILABLE: typeof navigator !== "undefined" && !!navigator.gpu,
  IS_WEBNN_AVAILABLE: typeof navigator !== "undefined" && "ml" in navigator,
  IS_DENO_WEB_RUNTIME: "Deno" in globalThis && typeof window !== "undefined",
  IS_SAFARI_BELOW_26: false,
  IS_SERVICE_WORKER_ENV: "ServiceWorkerGlobalScope" in globalThis && globalThis instanceof globalThis.ServiceWorkerGlobalScope,
  IS_CHROME_AVAILABLE: "chrome" in globalThis
};
var apis = new Proxy(fallbackApis, {
  get(target, property) {
    return Reflect.get(configuredHost?.apis ?? target, property);
  }
});
var logger = new Proxy(console, {
  get(target, property) {
    return Reflect.get(configuredHost?.logger ?? target, property);
  }
});
var fallbackHost = {
  env: environment,
  apis,
  logger,
  async getModelFile() {
    throw new Error("OnnxInferenceProvider host does not provide model file loading.");
  },
  getCacheNames() {
    return /* @__PURE__ */ new Set();
  },
  createBackendTensor() {
    throw new Error("OnnxInferenceProvider host does not provide tensor creation.");
  },
  getBackendTensorStorage() {
    return null;
  },
  maxExternalDataChunks: 100
};
function configureOnnxProviderHost(host) {
  if (configuredHost === null && fallbackEnvironment.backends.onnx) {
    const target = host.env.backends.onnx ?? {};
    const source = fallbackEnvironment.backends.onnx;
    const targetWasm = target.wasm;
    const targetWebgpu = target.webgpu;
    Object.assign(target, source);
    target.wasm = Object.assign(source.wasm ?? {}, targetWasm ?? {});
    target.webgpu = Object.assign(source.webgpu ?? {}, targetWebgpu ?? {});
    host.env.backends.onnx = target;
  }
  configuredHost = host;
}
function getOnnxProviderHost() {
  return configuredHost ?? fallbackHost;
}

// src/empty.ts
var empty_exports = {};
__export(empty_exports, {
  default: () => empty_default
});
var empty_default = {};

// src/runtime.ts
import * as ONNX_WEB from "onnxruntime-web/webgpu";

// src/wasm-cache.ts
async function loadAndCacheFile(url) {
  const { env: env2, logger: logger4, getCache } = getOnnxProviderHost();
  const fileName = url.split("/").pop();
  let cache;
  try {
    cache = await getCache?.();
    const cached = await cache?.match(url);
    if (cached) return cached;
  } catch (error) {
    logger4.warn(`Failed to load ${fileName} from cache:`, error);
  }
  const response = await env2.fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${fileName}: ${response.status} ${response.statusText}`);
  if (cache) {
    try {
      await cache.put(url, response.clone());
    } catch (error) {
      logger4.warn(`Failed to cache ${fileName}:`, error);
    }
  }
  return response;
}
async function loadWasmBinary(url) {
  const response = await loadAndCacheFile(url);
  if (!response || typeof response === "string") return null;
  try {
    return await response.arrayBuffer();
  } catch (error) {
    getOnnxProviderHost().logger.warn("Failed to read WASM binary:", error);
    return null;
  }
}
async function loadWasmFactory(url) {
  const { apis: apis4, logger: logger4 } = getOnnxProviderHost();
  if (apis4.IS_SERVICE_WORKER_ENV || apis4.IS_CHROME_AVAILABLE) return url;
  const response = await loadAndCacheFile(url);
  if (!response || typeof response === "string") return null;
  try {
    const code = (await response.text()).replaceAll("globalThis.process?.versions?.node", "false");
    return URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
  } catch (error) {
    logger4.warn("Failed to read WASM factory:", error);
    return null;
  }
}

// src/runtime.ts
import { Tensor } from "onnxruntime-common";
var { env, apis: apis2, logger: logger2 } = getOnnxProviderHost();
var LogLevel = { DEBUG: 10, INFO: 20, WARNING: 30, ERROR: 40, NONE: 50 };
function isBlobURL(url) {
  return url.startsWith("blob:");
}
function toAbsoluteURL(url) {
  return new URL(url, globalThis.location?.href ?? __ONNX_MODULE_URL__).href;
}
var DEVICE_TO_EXECUTION_PROVIDER_MAPPING = Object.freeze({
  auto: null,
  // Auto-detect based on device and environment
  gpu: null,
  // Auto-detect GPU
  cpu: "cpu",
  // CPU
  wasm: "wasm",
  // WebAssembly
  webgpu: "webgpu",
  // WebGPU
  cuda: "cuda",
  // CUDA
  dml: "dml",
  // DirectML
  coreml: "coreml",
  // CoreML
  webnn: { name: "webnn", deviceType: "cpu" },
  // WebNN (default)
  "webnn-npu": { name: "webnn", deviceType: "npu" },
  // WebNN NPU
  "webnn-gpu": { name: "webnn", deviceType: "gpu" },
  // WebNN GPU
  "webnn-cpu": { name: "webnn", deviceType: "cpu" }
  // WebNN CPU
});
function getOnnxLogSeverityLevel(logLevel) {
  if (logLevel <= LogLevel.DEBUG) {
    return 0;
  } else if (logLevel <= LogLevel.INFO) {
    return 2;
  } else if (logLevel <= LogLevel.WARNING) {
    return 3;
  } else if (logLevel <= LogLevel.ERROR) {
    return 3;
  } else {
    return 4;
  }
}
var ONNX_LOG_LEVEL_NAMES = {
  0: "verbose",
  1: "info",
  2: "warning",
  3: "error",
  4: "fatal"
};
var supportedDevices = [];
var defaultDevices;
var ONNX;
var ORT_SYMBOL = /* @__PURE__ */ Symbol.for("onnxruntime");
if (ORT_SYMBOL in globalThis) {
  ONNX = globalThis[ORT_SYMBOL];
} else if (apis2.IS_NODE_ENV) {
  ONNX = empty_exports;
  switch (process.platform) {
    case "win32":
      supportedDevices.push("dml");
      break;
    case "linux":
      if (process.arch === "x64") {
        supportedDevices.push("cuda");
      }
      break;
    case "darwin":
      supportedDevices.push("coreml");
      break;
  }
  supportedDevices.push("webgpu");
  supportedDevices.push("cpu");
  defaultDevices = ["cpu"];
} else {
  ONNX = ONNX_WEB;
  if (apis2.IS_WEBNN_AVAILABLE) {
    supportedDevices.push("webnn-npu", "webnn-gpu", "webnn-cpu", "webnn");
  }
  if (apis2.IS_WEBGPU_AVAILABLE) {
    supportedDevices.push("webgpu");
  }
  supportedDevices.push("wasm");
  defaultDevices = ["wasm"];
}
var InferenceSession = ONNX.InferenceSession;
function deviceToExecutionProviders(device = null) {
  if (!device) return defaultDevices;
  switch (device) {
    case "auto":
      return supportedDevices;
    case "gpu":
      return supportedDevices.filter((x) => ["webgpu", "cuda", "dml", "webnn-gpu"].includes(x));
  }
  if (supportedDevices.includes(device)) {
    return [DEVICE_TO_EXECUTION_PROVIDER_MAPPING[device] ?? device];
  }
  throw new Error(`Unsupported device: "${device}". Should be one of: ${supportedDevices.join(", ")}.`);
}
var webInitChain = Promise.resolve();
var wasmLoadPromise = null;
async function ensureWasmLoaded() {
  if (wasmLoadPromise) {
    return wasmLoadPromise;
  }
  const shouldUseWasmCache = env.useWasmCache && typeof ONNX_ENV?.wasm?.wasmPaths === "object" && ONNX_ENV?.wasm?.wasmPaths?.wasm && ONNX_ENV?.wasm?.wasmPaths?.mjs;
  if (!shouldUseWasmCache) {
    if (apis2.IS_DENO_WEB_RUNTIME) {
      throw new Error(
        "env.useWasmCache=false is not supported in Deno's web runtime. Remove the useWasmCache override."
      );
    }
    wasmLoadPromise = Promise.resolve();
    return wasmLoadPromise;
  }
  wasmLoadPromise = (async () => {
    const urls = ONNX_ENV.wasm.wasmPaths;
    let wasmBinaryLoaded = false;
    await Promise.all([
      // Load and cache the WASM binary
      urls.wasm && !isBlobURL(urls.wasm) ? (async () => {
        try {
          const wasmBinary = await loadWasmBinary(toAbsoluteURL(urls.wasm));
          if (wasmBinary) {
            ONNX_ENV.wasm.wasmBinary = wasmBinary;
            wasmBinaryLoaded = true;
          }
        } catch (err) {
          logger2.warn("Failed to pre-load WASM binary:", err);
        }
      })() : Promise.resolve(),
      // Load and cache the WASM factory as a blob URL
      urls.mjs && !isBlobURL(urls.mjs) ? (async () => {
        try {
          const wasmFactoryBlob = await loadWasmFactory(toAbsoluteURL(urls.mjs));
          if (wasmFactoryBlob) {
            ONNX_ENV.wasm.wasmPaths.mjs = wasmFactoryBlob;
          }
        } catch (err) {
          logger2.warn("Failed to pre-load WASM factory:", err);
        }
      })() : Promise.resolve()
    ]);
    if (!wasmBinaryLoaded) {
      ONNX_ENV.wasm.wasmPaths.mjs = urls.mjs;
    }
  })();
  return wasmLoadPromise;
}
async function createInferenceSession(buffer_or_path, session_options, session_config) {
  await ensureWasmLoaded();
  const logSeverityLevel = getOnnxLogSeverityLevel(env.logLevel ?? LogLevel.WARNING);
  const load = () => {
    const options = {
      // Set default log severity level, but allow overriding through session options
      logSeverityLevel,
      ...session_options
    };
    const create = InferenceSession.create;
    return create(buffer_or_path, options);
  };
  const session = await (apis2.IS_WEB_ENV ? webInitChain = webInitChain.then(load) : load());
  const configuredSession = session;
  configuredSession.config = session_config;
  return configuredSession;
}
var webInferenceChain = Promise.resolve({});
async function runInferenceSession(session, ortFeed) {
  const run = () => session.run(ortFeed);
  return apis2.IS_WEB_ENV ? webInferenceChain = webInferenceChain.then(run) : run();
}
function isONNXTensor(x) {
  return x instanceof ONNX.Tensor;
}
var ONNX_ENV = ONNX.env;
function isONNXProxy() {
  return ONNX_ENV?.wasm?.proxy;
}
if (ONNX_ENV) {
  let setLogLevel = function(logLevel) {
    const severityLevel = getOnnxLogSeverityLevel(logLevel);
    ONNX_ENV.logLevel = ONNX_LOG_LEVEL_NAMES[severityLevel];
  };
  setLogLevel2 = setLogLevel;
  const configured = env.backends.onnx ??= {};
  const configuredWasm = configured.wasm;
  const configuredWebgpu = configured.webgpu;
  for (const [key, value] of Object.entries(configured)) {
    if (key !== "wasm" && key !== "webgpu" && key !== "setLogLevel") {
      ONNX_ENV[key] = value;
    }
  }
  if (ONNX_ENV.wasm) {
    Object.assign(ONNX_ENV.wasm, configuredWasm ?? {});
    if (
      // @ts-ignore Cannot find name 'ServiceWorkerGlobalScope'.ts(2304)
      !(typeof ServiceWorkerGlobalScope !== "undefined" && self instanceof ServiceWorkerGlobalScope) && ONNX_ENV.versions?.web && !ONNX_ENV.wasm.wasmPaths
    ) {
      const wasmPathPrefix = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ONNX_ENV.versions.web}/dist/`;
      let wasmPathSuffix = ".asyncify";
      if (apis2.IS_SAFARI_BELOW_26 && !apis2.IS_WEBGPU_AVAILABLE) {
        wasmPathSuffix = "";
      }
      ONNX_ENV.wasm.wasmPaths = {
        mjs: `${wasmPathPrefix}ort-wasm-simd-threaded${wasmPathSuffix}.mjs`,
        wasm: `${wasmPathPrefix}ort-wasm-simd-threaded${wasmPathSuffix}.wasm`
      };
    }
    ONNX_ENV.wasm.proxy ??= false;
  }
  if (ONNX_ENV.webgpu) {
    Object.assign(ONNX_ENV.webgpu, configuredWebgpu ?? {});
    ONNX_ENV.webgpu.powerPreference ??= "high-performance";
  }
  setLogLevel(env.logLevel ?? LogLevel.WARNING);
  Object.assign(configured, ONNX_ENV, { setLogLevel });
  configured.wasm = ONNX_ENV.wasm;
  configured.webgpu = ONNX_ENV.webgpu;
  env.backends.onnx = configured;
}
var setLogLevel2;

// src/session-config.ts
var MODEL_TYPES = {
  EncoderOnly: "EncoderOnly",
  EncoderDecoder: "EncoderDecoder",
  Seq2Seq: "Seq2Seq",
  Vision2Seq: "Vision2Seq",
  DecoderOnly: "DecoderOnly",
  DecoderOnlyWithoutHead: "DecoderOnlyWithoutHead",
  MaskGeneration: "MaskGeneration",
  ImageTextToText: "ImageTextToText",
  Musicgen: "Musicgen",
  MultiModality: "MultiModality",
  Phi3V: "Phi3V",
  AudioTextToText: "AudioTextToText",
  AutoEncoder: "AutoEncoder",
  ImageAudioTextToText: "ImageAudioTextToText",
  Supertonic: "Supertonic",
  Chatterbox: "Chatterbox",
  VoxtralRealtime: "VoxtralRealtime"
};
var MODEL_SESSION_CONFIG = {
  [MODEL_TYPES.DecoderOnly]: {
    sessions: (_config, options) => ({ model: options.model_file_name ?? "model" }),
    cache_sessions: { model: true },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [MODEL_TYPES.DecoderOnlyWithoutHead]: {
    sessions: (_config, options) => ({ model: options.model_file_name ?? "model" })
  },
  [MODEL_TYPES.Seq2Seq]: {
    sessions: () => ({ model: "encoder_model", decoder_model_merged: "decoder_model_merged" }),
    cache_sessions: { decoder_model_merged: true },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [MODEL_TYPES.Vision2Seq]: {
    sessions: () => ({ model: "encoder_model", decoder_model_merged: "decoder_model_merged" }),
    cache_sessions: { decoder_model_merged: true },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [MODEL_TYPES.Musicgen]: {
    sessions: () => ({
      model: "text_encoder",
      decoder_model_merged: "decoder_model_merged",
      encodec_decode: "encodec_decode"
    }),
    cache_sessions: { decoder_model_merged: true },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [MODEL_TYPES.EncoderDecoder]: {
    sessions: () => ({ model: "encoder_model", decoder_model_merged: "decoder_model_merged" }),
    cache_sessions: { decoder_model_merged: true }
  },
  [MODEL_TYPES.MaskGeneration]: {
    sessions: () => ({ model: "vision_encoder", prompt_encoder_mask_decoder: "prompt_encoder_mask_decoder" })
  },
  [MODEL_TYPES.ImageTextToText]: {
    text_only_sessions: { embed_tokens: "embed_tokens", decoder_model_merged: "decoder_model_merged" },
    sessions: (config, _options, textOnly) => {
      const sessions = { ...MODEL_SESSION_CONFIG[MODEL_TYPES.ImageTextToText].text_only_sessions };
      if (!textOnly) sessions.vision_encoder = "vision_encoder";
      if (config.is_encoder_decoder) sessions.model = "encoder_model";
      return sessions;
    },
    cache_sessions: { decoder_model_merged: true },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [MODEL_TYPES.AudioTextToText]: {
    text_only_sessions: { embed_tokens: "embed_tokens", decoder_model_merged: "decoder_model_merged" },
    sessions: (_config, _options, textOnly) => ({
      ...MODEL_SESSION_CONFIG[MODEL_TYPES.AudioTextToText].text_only_sessions,
      ...textOnly ? {} : { audio_encoder: "audio_encoder" }
    }),
    cache_sessions: { decoder_model_merged: true },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [MODEL_TYPES.ImageAudioTextToText]: {
    text_only_sessions: { embed_tokens: "embed_tokens", decoder_model_merged: "decoder_model_merged" },
    sessions: (_config, _options, textOnly) => ({
      ...MODEL_SESSION_CONFIG[MODEL_TYPES.ImageAudioTextToText].text_only_sessions,
      ...textOnly ? {} : { audio_encoder: "audio_encoder", vision_encoder: "vision_encoder" }
    }),
    optional_configs: { generation_config: "generation_config.json" }
  },
  [MODEL_TYPES.Phi3V]: {
    sessions: () => ({
      prepare_inputs_embeds: "prepare_inputs_embeds",
      model: "model",
      vision_encoder: "vision_encoder"
    }),
    cache_sessions: { model: true },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [MODEL_TYPES.MultiModality]: {
    sessions: () => ({
      prepare_inputs_embeds: "prepare_inputs_embeds",
      model: "language_model",
      lm_head: "lm_head",
      gen_head: "gen_head",
      gen_img_embeds: "gen_img_embeds",
      image_decode: "image_decode"
    }),
    cache_sessions: { model: true },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [MODEL_TYPES.AutoEncoder]: {
    sessions: () => ({ encoder_model: "encoder_model", decoder_model: "decoder_model" })
  },
  [MODEL_TYPES.Supertonic]: {
    sessions: () => ({ text_encoder: "text_encoder", latent_denoiser: "latent_denoiser", voice_decoder: "voice_decoder" })
  },
  [MODEL_TYPES.Chatterbox]: {
    sessions: () => ({
      embed_tokens: "embed_tokens",
      speech_encoder: "speech_encoder",
      model: "language_model",
      conditional_decoder: "conditional_decoder"
    }),
    cache_sessions: { model: true },
    optional_configs: { generation_config: "generation_config.json" }
  },
  [MODEL_TYPES.VoxtralRealtime]: {
    text_only_sessions: { embed_tokens: "embed_tokens", decoder_model_merged: "decoder_model_merged" },
    sessions: (_config, _options, textOnly) => ({
      ...MODEL_SESSION_CONFIG[MODEL_TYPES.VoxtralRealtime].text_only_sessions,
      ...textOnly ? {} : { audio_encoder: "audio_encoder" }
    }),
    cache_sessions: { decoder_model_merged: true, audio_encoder: true },
    optional_configs: { generation_config: "generation_config.json" }
  },
  default: {
    sessions: (_config, options) => ({ model: options.model_file_name ?? "model" })
  }
};
function getSessionsConfig(modelType, config, options = {}) {
  const typeConfig = MODEL_SESSION_CONFIG[modelType] ?? MODEL_SESSION_CONFIG.default;
  return {
    sessions: typeConfig.sessions(config, options, options.textOnly ?? false),
    cache_sessions: typeConfig.cache_sessions,
    optional_configs: typeConfig.optional_configs
  };
}
function getTextOnlySessions(modelType) {
  return MODEL_SESSION_CONFIG[modelType]?.text_only_sessions ?? null;
}

// src/provider.ts
var DATA_TYPES = Object.freeze({
  auto: "auto",
  fp32: "fp32",
  fp16: "fp16",
  q8: "q8",
  int8: "int8",
  uint8: "uint8",
  q4: "q4",
  bnb4: "bnb4",
  q4f16: "q4f16",
  q2: "q2",
  q2f16: "q2f16",
  q1: "q1",
  q1f16: "q1f16"
});
var DEFAULT_DTYPE_SUFFIX_MAPPING = Object.freeze({
  fp32: "",
  fp16: "_fp16",
  int8: "_int8",
  uint8: "_uint8",
  q8: "_quantized",
  q4: "_q4",
  q2: "_q2",
  q1: "_q1",
  q4f16: "_q4f16",
  q2f16: "_q2f16",
  q1f16: "_q1f16",
  bnb4: "_bnb4"
});
var { apis: apis3, logger: logger3 } = getOnnxProviderHost();
function selectDevice(value, fileName, { warn } = {}) {
  const fallback = apis3.IS_NODE_ENV ? "cpu" : "wasm";
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (Object.hasOwn(value, fileName)) return value[fileName];
  warn?.(`device not specified for "${fileName}". Using the default device (${fallback}).`);
  return fallback;
}
function selectDtype(value, fileName, device, { configDtype = null, warn } = {}) {
  let resolved = value;
  let needsWarn = false;
  if (value && typeof value !== "string") {
    resolved = Object.hasOwn(value, fileName) ? value[fileName] : null;
    needsWarn = resolved === null;
  }
  if (resolved === "auto") {
    const fallback = typeof configDtype === "string" ? configDtype : configDtype?.[fileName];
    if (fallback && fallback !== "auto" && Object.hasOwn(DATA_TYPES, fallback)) return fallback;
  }
  const result = resolved && resolved !== "auto" && Object.hasOwn(DATA_TYPES, resolved) ? resolved : device === "wasm" ? "q8" : "fp32";
  if (needsWarn)
    warn?.(
      `dtype not specified for "${fileName}". Using the default dtype (${result}) for this device (${device}).`
    );
  return result;
}
var fp16Supported;
async function isWebGpuFp16Supported() {
  if (fp16Supported === void 0) {
    try {
      const adapter = await navigator.gpu.requestAdapter();
      fp16Supported = !!adapter?.features.has("shader-f16");
    } catch {
      fp16Supported = false;
    }
  }
  return fp16Supported;
}
var OnnxInferenceProvider = class _OnnxInferenceProvider {
  constructor(modelId, modelClass = void 0) {
    this.modelId = modelId;
    this.modelClass = modelClass;
  }
  static from_modelId(modelId) {
    return new _OnnxInferenceProvider(modelId);
  }
  static listModelArtifacts({
    modelType,
    config,
    model_file_name = null,
    use_external_data_format = null,
    dtype: overrideDtype = null,
    device: overrideDevice = null
  }) {
    const { sessions, optional_configs: optionalConfigs } = getSessionsConfig(modelType, config, {
      model_file_name
    });
    const files = ["config.json"];
    const customConfig = config?.["transformers.js_config"] ?? {};
    const rawDevice = overrideDevice ?? customConfig.device;
    for (const baseName of Object.values(sessions)) {
      const device = selectDevice(rawDevice, baseName);
      const deviceConfig = customConfig.device_config?.[device];
      const resolvedConfig = deviceConfig ? { ...customConfig, ...deviceConfig } : customConfig;
      const dtype = overrideDtype ?? resolvedConfig.dtype;
      const selectedDtype = selectDtype(dtype, baseName, device, { configDtype: resolvedConfig.dtype });
      const suffix = DEFAULT_DTYPE_SUFFIX_MAPPING[selectedDtype] ?? "";
      const fullName = `${baseName}${suffix}.onnx`;
      files.push(`onnx/${fullName}`);
      const externalConfig = use_external_data_format ?? resolvedConfig.use_external_data_format;
      const count = typeof externalConfig === "object" && externalConfig !== null ? +(externalConfig[fullName] ?? externalConfig[baseName] ?? 0) : +(externalConfig ?? 0);
      files.push(...externalDataChunkNames(fullName, count).map((name) => `onnx/${name}`));
    }
    if (optionalConfigs) files.push(...Object.values(optionalConfigs));
    return files;
  }
  static async getAvailableDtypes({
    modelId,
    modelType,
    config,
    model_file_name,
    getFileMetadata,
    metadataOptions
  }) {
    const { sessions } = getSessionsConfig(modelType, config, { model_file_name });
    const results = await Promise.all(
      Object.entries(DEFAULT_DTYPE_SUFFIX_MAPPING).map(async ([dtype, suffix]) => ({
        dtype,
        available: (await Promise.all(
          Object.values(sessions).map(
            async (baseName) => (await getFileMetadata(modelId, `onnx/${baseName}${suffix}.onnx`, metadataOptions)).exists
          )
        )).every(Boolean)
      }))
    );
    return results.filter((result) => result.available).map((result) => result.dtype);
  }
  static filterModelArtifacts(files, { modelType, config }) {
    if (!getTextOnlySessions(modelType)) return files;
    const { sessions } = getSessionsConfig(modelType, config, { textOnly: true });
    const allowedPrefixes = Object.values(sessions).map((name) => `onnx/${name}`);
    return files.filter(
      (file) => !file.startsWith("onnx/") || allowedPrefixes.some((prefix) => file.startsWith(prefix))
    );
  }
  getSessionConfig(modelType, config, options = {}) {
    return getSessionsConfig(modelType, config, options);
  }
  providerType = "onnx";
  sessionProvider = { version: 1 };
  modelClass;
  /** Load a Transformers.js model class with this backend. */
  async load(options) {
    throwIfAborted(options.signal);
    const modelClass = options.modelClass ?? this.modelClass;
    if (!modelClass) {
      throw new Error("OnnxInferenceProvider requires a Transformers.js model class before it can load a model.");
    }
    const { modelClass: _modelClass, ...loadOptions } = options;
    return modelClass._from_pretrained(this.modelId, {
      ...loadOptions,
      fetch: options.fetch ?? getOnnxProviderHost().env.fetch,
      inferenceProvider: this
    });
  }
  async getSession(fileName, options, cache_config = false, session_name = void 0) {
    throwIfAborted(options.signal);
    let custom_config = options.config?.["transformers.js_config"] ?? {};
    const selectedDevice = selectDevice(options.device ?? custom_config.device, fileName, {
      warn: (msg) => logger3.info(msg)
    });
    const executionProviders = deviceToExecutionProviders(selectedDevice);
    const device_config = custom_config.device_config ?? {};
    if (Object.hasOwn(device_config, selectedDevice)) {
      custom_config = { ...custom_config, ...device_config[selectedDevice] };
    }
    const selectedDtype = selectDtype(options.dtype ?? custom_config.dtype, fileName, selectedDevice, {
      configDtype: custom_config.dtype,
      warn: (msg) => logger3.info(msg)
    });
    if (!Object.hasOwn(DEFAULT_DTYPE_SUFFIX_MAPPING, selectedDtype)) {
      throw new Error(`Invalid dtype: ${selectedDtype}. Should be one of: ${Object.keys(DATA_TYPES).join(", ")}`);
    }
    if (selectedDevice === "webgpu" && !apis3.IS_NODE_ENV && selectedDtype === DATA_TYPES.fp16 && !await isWebGpuFp16Supported()) {
      throw new Error(`The device (${selectedDevice}) does not support fp16.`);
    }
    const suffix = DEFAULT_DTYPE_SUFFIX_MAPPING[selectedDtype];
    const session_options = { ...options.session_options };
    session_options.executionProviders ??= executionProviders;
    const free_dimension_overrides = custom_config.free_dimension_overrides;
    if (free_dimension_overrides) {
      session_options.freeDimensionOverrides ??= free_dimension_overrides;
    } else if (selectedDevice.startsWith("webnn") && !session_options.freeDimensionOverrides) {
      logger3.warn(
        `WebNN does not currently support dynamic shapes and requires 'free_dimension_overrides' to be set in config.json, preferably as a field within config["transformers.js_config"]["device_config"]["${selectedDevice}"]. When 'free_dimension_overrides' is not set, you may experience significant performance degradation.`
      );
    }
    const bufferOrPathPromise = getCoreModelFile(this.modelId, fileName, options, suffix);
    const use_external_data_format = options.use_external_data_format ?? custom_config.use_external_data_format;
    const externalData = await getModelDataFiles(
      this.modelId,
      fileName,
      suffix,
      options,
      use_external_data_format,
      session_options
    );
    throwIfAborted(options.signal);
    if (externalData.length > 0 && (!apis3.IS_NODE_ENV || externalData.some((data) => typeof data !== "string"))) {
      session_options.externalData = externalData;
    }
    if (cache_config && selectedDevice === "webgpu") {
      const names = getOnnxProviderHost().getCacheNames(options.config, { prefix: "present", session_name });
      if (names.size > 0 && !isONNXProxy()) {
        const preferredOutputLocation = {};
        for (const key of names) preferredOutputLocation[key] = "gpu-buffer";
        session_options.preferredOutputLocation = preferredOutputLocation;
      }
    }
    const buffer_or_path = await bufferOrPathPromise;
    throwIfAborted(options.signal);
    return {
      buffer_or_path,
      session_options,
      session_config: { dtype: selectedDtype, device: selectedDevice }
    };
  }
  async constructSessions(names, options, cache_sessions = void 0) {
    const tasks = Object.keys(names).map(async (name) => {
      const sessionInfo = await this.getSession(names[name], options, cache_sessions?.[name] ?? false, name);
      const ortSession = await createInferenceSession(
        sessionInfo.buffer_or_path,
        sessionInfo.session_options,
        sessionInfo.session_config
      );
      try {
        throwIfAborted(options.signal);
      } catch (error) {
        await ortSession.release();
        throw error;
      }
      return [
        name,
        {
          inputNames: ortSession.inputNames,
          outputNames: ortSession.outputNames,
          inputMetadata: ortSession.inputMetadata,
          outputMetadata: ortSession.outputMetadata,
          config: ortSession.config,
          run: (inputs) => this.run(ortSession, inputs),
          release: () => ortSession.release()
        }
      ];
    });
    const results = await Promise.allSettled(tasks);
    const sessions = results.filter(
      (result) => result.status === "fulfilled"
    ).map((result) => result.value);
    const failure = results.find((result) => result.status === "rejected");
    if (failure) {
      await Promise.allSettled(sessions.map(([, session]) => session.release()));
      throw failure.reason;
    }
    return Object.fromEntries(sessions);
  }
  async run(session, inputs) {
    const checkedInputs = validateInputs(session, inputs);
    try {
      const ortFeed = Object.fromEntries(
        Object.entries(checkedInputs).map(([key, value]) => {
          const storage = getOnnxProviderHost().getBackendTensorStorage(value);
          const tensor = storage?.backend === "onnx" ? storage.handle : new Tensor(value.type, value.data, value.dims);
          if (apis3.IS_NODE_ENV && typeof Float16Array !== "undefined" && tensor.cpuData instanceof Float16Array) {
            tensor.cpuData = new Uint16Array(tensor.cpuData.buffer);
          }
          return [key, tensor];
        })
      );
      return replaceTensors(await runInferenceSession(session, ortFeed));
    } catch (error) {
      const formatted = Object.fromEntries(
        Object.entries(checkedInputs).map(([key, tensor]) => {
          const unpacked = { type: tensor.type, dims: tensor.dims, location: tensor.location };
          if (unpacked.location !== "gpu-buffer") unpacked.data = tensor.data;
          return [key, unpacked];
        })
      );
      logger3.error(`An error occurred during model execution: "${error}".`);
      logger3.error("Inputs given to model:", formatted);
      throw error;
    }
  }
};
function replaceTensors(value) {
  for (const property in value) {
    if (isONNXTensor(value[property])) {
      const tensor = value[property];
      value[property] = getOnnxProviderHost().createBackendTensor({
        backend: "onnx",
        handle: tensor,
        get type() {
          return tensor.type;
        },
        get dims() {
          return tensor.dims;
        },
        set dims(value2) {
          tensor.dims = value2;
        },
        get data() {
          return tensor.data;
        },
        get size() {
          return tensor.size;
        },
        get location() {
          return tensor.location;
        },
        dispose() {
          tensor.dispose();
        }
      });
    } else if (value[property] && typeof value[property] === "object") {
      replaceTensors(value[property]);
    }
  }
  return value;
}
function validateInputs(session, inputs) {
  const checkedInputs = /* @__PURE__ */ Object.create(null);
  const missingInputs = [];
  for (const inputName of session.inputNames) {
    const tensor = inputs[inputName];
    if (!tensor || !Array.isArray(tensor.dims) || typeof tensor.type !== "string") {
      missingInputs.push(inputName);
      continue;
    }
    checkedInputs[inputName] = isONNXProxy() ? tensor.clone() : tensor;
  }
  if (missingInputs.length > 0) {
    throw new Error(
      `An error occurred during model execution: "Missing the following inputs: ${missingInputs.join(", ")}.`
    );
  }
  const inputNames = Object.keys(inputs);
  if (inputNames.length > session.inputNames.length) {
    const ignored = inputNames.filter((inputName) => !session.inputNames.includes(inputName));
    logger3.warn(
      `WARNING: Too many inputs were provided (${inputNames.length} > ${session.inputNames.length}). The following inputs will be ignored: "${ignored.join(", ")}".`
    );
  }
  return checkedInputs;
}
function loadModelFile(modelId, file, options, returnPath = false) {
  if (typeof options.getModelFile === "function") {
    return options.getModelFile(modelId, file, { ...options, fatal: true, returnPath });
  }
  return getOnnxProviderHost().getModelFile(modelId, file, true, options, returnPath);
}
async function getCoreModelFile(modelId, fileName, options, suffix) {
  const baseName = `${fileName}${suffix}.onnx`;
  return loadModelFile(modelId, `onnx/${baseName}`, options, apis3.IS_NODE_ENV);
}
function externalDataChunkNames(fullName, count) {
  return Array.from({ length: count }, (_, index) => `${fullName}_data${index === 0 ? "" : `_${index}`}`);
}
function throwIfAborted(signal) {
  if (!signal?.aborted) return;
  if (typeof signal.throwIfAborted === "function") signal.throwIfAborted();
  throw signal.reason ?? new Error("Model loading aborted.");
}
async function getModelDataFiles(modelId, fileName, suffix, options, externalConfig, sessionOptions) {
  const baseName = `${fileName}${suffix}.onnx`;
  let count = 0;
  if (typeof externalConfig === "object" && externalConfig !== null) {
    count = +(externalConfig[baseName] ?? externalConfig[fileName] ?? 0);
  } else if (externalConfig) {
    count = +externalConfig;
  }
  const maxChunks = getOnnxProviderHost().maxExternalDataChunks;
  if (count > maxChunks) {
    throw new Error(
      `The number of external data chunks (${count}) exceeds the maximum allowed value (${maxChunks}).`
    );
  }
  if (count > 0) {
    return Promise.all(
      externalDataChunkNames(baseName, count).map(async (path) => {
        const data = await loadModelFile(modelId, `onnx/${path}`, options, apis3.IS_NODE_ENV);
        return data instanceof Uint8Array ? { path, data } : path;
      })
    );
  }
  if (sessionOptions.externalData !== void 0) {
    return Promise.all(
      sessionOptions.externalData.map(
        async (item) => typeof item.data === "string" ? { ...item, data: await loadModelFile(modelId, item.data, options) } : item
      )
    );
  }
  return [];
}

// src/tensor-ops.ts
var wrap = async (session_bytes, session_options, names) => {
  const session = await createInferenceSession(new Uint8Array(session_bytes), session_options, {});
  return async (inputs) => {
    const proxied = isONNXProxy();
    const ortFeed = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => {
        const input = proxied ? value.clone() : value;
        const storage = getOnnxProviderHost().getBackendTensorStorage(input);
        return [
          key,
          storage?.backend === "onnx" ? storage.handle : new Tensor(input.type, input.data, input.dims)
        ];
      })
    );
    const outputs = await runInferenceSession(session, ortFeed);
    if (Array.isArray(names)) {
      return names.map((name) => wrapTensor(outputs[name]));
    } else {
      return wrapTensor(outputs[names]);
    }
  };
};
var OnnxTensorOpRegistry = class {
  static backend = "onnx";
  static _nearest_interpolate_4d;
  static _bilinear_interpolate_4d;
  static _bicubic_interpolate_4d;
  static _matmul;
  static _stft;
  static _rfft;
  static _top_k;
  static _slice;
  static session_options = {
    // TODO: Allow for multiple execution providers
    // executionProviders: ['webgpu'],
  };
  static get nearest_interpolate_4d() {
    if (!this._nearest_interpolate_4d) {
      this._nearest_interpolate_4d = wrap(
        [
          8,
          10,
          18,
          0,
          58,
          129,
          1,
          10,
          41,
          10,
          1,
          120,
          10,
          0,
          10,
          0,
          10,
          1,
          115,
          18,
          1,
          121,
          34,
          6,
          82,
          101,
          115,
          105,
          122,
          101,
          42,
          18,
          10,
          4,
          109,
          111,
          100,
          101,
          34,
          7,
          110,
          101,
          97,
          114,
          101,
          115,
          116,
          160,
          1,
          3,
          18,
          1,
          114,
          90,
          31,
          10,
          1,
          120,
          18,
          26,
          10,
          24,
          8,
          1,
          18,
          20,
          10,
          3,
          18,
          1,
          98,
          10,
          3,
          18,
          1,
          99,
          10,
          3,
          18,
          1,
          104,
          10,
          3,
          18,
          1,
          119,
          90,
          15,
          10,
          1,
          115,
          18,
          10,
          10,
          8,
          8,
          7,
          18,
          4,
          10,
          2,
          8,
          4,
          98,
          31,
          10,
          1,
          121,
          18,
          26,
          10,
          24,
          8,
          1,
          18,
          20,
          10,
          3,
          18,
          1,
          98,
          10,
          3,
          18,
          1,
          99,
          10,
          3,
          18,
          1,
          104,
          10,
          3,
          18,
          1,
          119,
          66,
          2,
          16,
          21
        ],
        this.session_options,
        "y"
      );
    }
    return this._nearest_interpolate_4d;
  }
  static get bilinear_interpolate_4d() {
    if (!this._bilinear_interpolate_4d) {
      this._bilinear_interpolate_4d = wrap(
        [
          8,
          9,
          18,
          0,
          58,
          128,
          1,
          10,
          40,
          10,
          1,
          120,
          10,
          0,
          10,
          0,
          10,
          1,
          115,
          18,
          1,
          121,
          34,
          6,
          82,
          101,
          115,
          105,
          122,
          101,
          42,
          17,
          10,
          4,
          109,
          111,
          100,
          101,
          34,
          6,
          108,
          105,
          110,
          101,
          97,
          114,
          160,
          1,
          3,
          18,
          1,
          114,
          90,
          31,
          10,
          1,
          120,
          18,
          26,
          10,
          24,
          8,
          1,
          18,
          20,
          10,
          3,
          18,
          1,
          98,
          10,
          3,
          18,
          1,
          99,
          10,
          3,
          18,
          1,
          104,
          10,
          3,
          18,
          1,
          119,
          90,
          15,
          10,
          1,
          115,
          18,
          10,
          10,
          8,
          8,
          7,
          18,
          4,
          10,
          2,
          8,
          4,
          98,
          31,
          10,
          1,
          121,
          18,
          26,
          10,
          24,
          8,
          1,
          18,
          20,
          10,
          3,
          18,
          1,
          98,
          10,
          3,
          18,
          1,
          99,
          10,
          3,
          18,
          1,
          104,
          10,
          3,
          18,
          1,
          119,
          66,
          2,
          16,
          20
        ],
        this.session_options,
        "y"
      );
    }
    return this._bilinear_interpolate_4d;
  }
  static get bicubic_interpolate_4d() {
    if (!this._bicubic_interpolate_4d) {
      this._bicubic_interpolate_4d = wrap(
        [
          8,
          9,
          18,
          0,
          58,
          127,
          10,
          39,
          10,
          1,
          120,
          10,
          0,
          10,
          0,
          10,
          1,
          115,
          18,
          1,
          121,
          34,
          6,
          82,
          101,
          115,
          105,
          122,
          101,
          42,
          16,
          10,
          4,
          109,
          111,
          100,
          101,
          34,
          5,
          99,
          117,
          98,
          105,
          99,
          160,
          1,
          3,
          18,
          1,
          114,
          90,
          31,
          10,
          1,
          120,
          18,
          26,
          10,
          24,
          8,
          1,
          18,
          20,
          10,
          3,
          18,
          1,
          98,
          10,
          3,
          18,
          1,
          99,
          10,
          3,
          18,
          1,
          104,
          10,
          3,
          18,
          1,
          119,
          90,
          15,
          10,
          1,
          115,
          18,
          10,
          10,
          8,
          8,
          7,
          18,
          4,
          10,
          2,
          8,
          4,
          98,
          31,
          10,
          1,
          121,
          18,
          26,
          10,
          24,
          8,
          1,
          18,
          20,
          10,
          3,
          18,
          1,
          98,
          10,
          3,
          18,
          1,
          99,
          10,
          3,
          18,
          1,
          104,
          10,
          3,
          18,
          1,
          119,
          66,
          2,
          16,
          20
        ],
        this.session_options,
        "y"
      );
    }
    return this._bicubic_interpolate_4d;
  }
  static get matmul() {
    if (!this._matmul) {
      this._matmul = wrap(
        [
          8,
          9,
          18,
          0,
          58,
          55,
          10,
          17,
          10,
          1,
          97,
          10,
          1,
          98,
          18,
          1,
          99,
          34,
          6,
          77,
          97,
          116,
          77,
          117,
          108,
          18,
          1,
          114,
          90,
          9,
          10,
          1,
          97,
          18,
          4,
          10,
          2,
          8,
          1,
          90,
          9,
          10,
          1,
          98,
          18,
          4,
          10,
          2,
          8,
          1,
          98,
          9,
          10,
          1,
          99,
          18,
          4,
          10,
          2,
          8,
          1,
          66,
          2,
          16,
          20
        ],
        this.session_options,
        "c"
      );
    }
    return this._matmul;
  }
  static get stft() {
    if (!this._stft) {
      this._stft = wrap(
        [
          8,
          7,
          18,
          0,
          58,
          148,
          1,
          10,
          38,
          10,
          1,
          115,
          10,
          1,
          106,
          10,
          1,
          119,
          10,
          1,
          108,
          18,
          1,
          111,
          34,
          4,
          83,
          84,
          70,
          84,
          42,
          15,
          10,
          8,
          111,
          110,
          101,
          115,
          105,
          100,
          101,
          100,
          24,
          1,
          160,
          1,
          2,
          18,
          1,
          115,
          90,
          26,
          10,
          1,
          115,
          18,
          21,
          10,
          19,
          8,
          1,
          18,
          15,
          10,
          3,
          18,
          1,
          98,
          10,
          3,
          18,
          1,
          115,
          10,
          3,
          18,
          1,
          99,
          90,
          11,
          10,
          1,
          106,
          18,
          6,
          10,
          4,
          8,
          7,
          18,
          0,
          90,
          16,
          10,
          1,
          119,
          18,
          11,
          10,
          9,
          8,
          1,
          18,
          5,
          10,
          3,
          18,
          1,
          119,
          90,
          11,
          10,
          1,
          108,
          18,
          6,
          10,
          4,
          8,
          7,
          18,
          0,
          98,
          31,
          10,
          1,
          111,
          18,
          26,
          10,
          24,
          8,
          1,
          18,
          20,
          10,
          3,
          18,
          1,
          98,
          10,
          3,
          18,
          1,
          102,
          10,
          3,
          18,
          1,
          100,
          10,
          3,
          18,
          1,
          99,
          66,
          2,
          16,
          17
        ],
        this.session_options,
        "o"
      );
    }
    return this._stft;
  }
  static get rfft() {
    if (!this._rfft) {
      this._rfft = wrap(
        [
          8,
          9,
          18,
          0,
          58,
          97,
          10,
          33,
          10,
          1,
          120,
          10,
          0,
          10,
          1,
          97,
          18,
          1,
          121,
          34,
          3,
          68,
          70,
          84,
          42,
          15,
          10,
          8,
          111,
          110,
          101,
          115,
          105,
          100,
          101,
          100,
          24,
          1,
          160,
          1,
          2,
          18,
          1,
          100,
          90,
          21,
          10,
          1,
          120,
          18,
          16,
          10,
          14,
          8,
          1,
          18,
          10,
          10,
          3,
          18,
          1,
          115,
          10,
          3,
          18,
          1,
          99,
          90,
          11,
          10,
          1,
          97,
          18,
          6,
          10,
          4,
          8,
          7,
          18,
          0,
          98,
          21,
          10,
          1,
          121,
          18,
          16,
          10,
          14,
          8,
          1,
          18,
          10,
          10,
          3,
          18,
          1,
          115,
          10,
          3,
          18,
          1,
          99,
          66,
          2,
          16,
          20
        ],
        this.session_options,
        "y"
      );
    }
    return this._rfft;
  }
  static get top_k() {
    if (!this._top_k) {
      this._top_k = wrap(
        [
          8,
          10,
          18,
          0,
          58,
          73,
          10,
          18,
          10,
          1,
          120,
          10,
          1,
          107,
          18,
          1,
          118,
          18,
          1,
          105,
          34,
          4,
          84,
          111,
          112,
          75,
          18,
          1,
          116,
          90,
          9,
          10,
          1,
          120,
          18,
          4,
          10,
          2,
          8,
          1,
          90,
          15,
          10,
          1,
          107,
          18,
          10,
          10,
          8,
          8,
          7,
          18,
          4,
          10,
          2,
          8,
          1,
          98,
          9,
          10,
          1,
          118,
          18,
          4,
          10,
          2,
          8,
          1,
          98,
          9,
          10,
          1,
          105,
          18,
          4,
          10,
          2,
          8,
          7,
          66,
          2,
          16,
          21
        ],
        this.session_options,
        [
          /* Values */
          "v",
          /* Indices */
          "i"
        ]
      );
    }
    return this._top_k;
  }
  static get slice() {
    if (!this._slice) {
      this._slice = wrap(
        [
          8,
          7,
          18,
          0,
          58,
          96,
          10,
          25,
          10,
          1,
          120,
          10,
          1,
          115,
          10,
          1,
          101,
          10,
          1,
          97,
          10,
          1,
          116,
          18,
          1,
          121,
          34,
          5,
          83,
          108,
          105,
          99,
          101,
          18,
          1,
          114,
          90,
          9,
          10,
          1,
          120,
          18,
          4,
          10,
          2,
          8,
          1,
          90,
          9,
          10,
          1,
          115,
          18,
          4,
          10,
          2,
          8,
          7,
          90,
          9,
          10,
          1,
          101,
          18,
          4,
          10,
          2,
          8,
          7,
          90,
          9,
          10,
          1,
          97,
          18,
          4,
          10,
          2,
          8,
          7,
          90,
          9,
          10,
          1,
          116,
          18,
          4,
          10,
          2,
          8,
          7,
          98,
          9,
          10,
          1,
          121,
          18,
          4,
          10,
          2,
          8,
          1,
          66,
          2,
          16,
          13
        ],
        this.session_options,
        "y"
      );
    }
    return this._slice;
  }
};
function wrapTensor(tensor) {
  return getOnnxProviderHost().createBackendTensor({
    backend: "onnx",
    handle: tensor,
    get type() {
      return tensor.type;
    },
    get dims() {
      return tensor.dims;
    },
    set dims(value) {
      tensor.dims = value;
    },
    get data() {
      return tensor.data;
    },
    get size() {
      return tensor.size;
    },
    get location() {
      return tensor.location;
    },
    dispose() {
      tensor.dispose();
    }
  });
}
export {
  OnnxInferenceProvider,
  OnnxTensorOpRegistry,
  configureOnnxProviderHost
};
