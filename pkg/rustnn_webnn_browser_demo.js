/**
 * Parses `.webnn` text and builds it on `context`; resolves to `{ graph, summary }`.
 * @param {MLContext} context
 * @param {string} text
 * @returns {Promise<any>}
 */
export function buildGraph(context, text) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.buildGraph(context, ptr0, len0);
    return ret;
}

/**
 * Parses `.webnn` text and returns its operations, inputs and outputs.
 * @param {string} text
 * @returns {any}
 */
export function inspectGraph(text) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.inspectGraph(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Builds a model published as `model.webnn`, `manifest.json` and `model.weights` on `context`;
 * resolves to `{ graph, summary }`. With `narrow_int64`, int64 inputs, outputs and constants
 * become int32 and `summary` reports the narrowed types.
 * @param {MLContext} context
 * @param {string} text
 * @param {string} manifest
 * @param {Uint8Array} weights
 * @param {boolean} narrow_int64_types
 * @returns {Promise<any>}
 */
export function loadWebnnModel(context, text, manifest, weights, narrow_int64_types) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(manifest, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArray8ToWasm0(weights, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.loadWebnnModel(context, ptr0, len0, ptr1, len1, ptr2, len2, narrow_int64_types);
    return ret;
}

/**
 * Reports Rust panics with their message in the browser console.
 */
export function start() {
    wasm.start();
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_30c8987f7c2ed4e2: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_String_8564e559799eccda: function(arg0, arg1) {
            const ret = String(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_debug_string_4687d8d8c2017d52: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_is_function_1f9d30630b8b1d3d: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_string_90b56bc79aad6f6c: function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        },
        __wbg___wbindgen_is_undefined_8865fb403f8fe9d8: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_throw_41e9ee4f547fc59a: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg__wbg_cb_unref_dcc1a90847f04c41: function(arg0) {
            arg0._wbg_cb_unref();
        },
        __wbg_abs_4544b4debbf4da1f: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.abs(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_add_a853c0af32d8cf35: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.add(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_argMax_310c4802fedda750: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.argMax(arg1, arg2 >>> 0, arg3);
            return ret;
        }, arguments); },
        __wbg_argMin_2dcae62f88270bda: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.argMin(arg1, arg2 >>> 0, arg3);
            return ret;
        }, arguments); },
        __wbg_averagePool2d_7a3e216a9208995a: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.averagePool2d(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_batchNormalization_88f11d234fc13492: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.batchNormalization(arg1, arg2, arg3, arg4);
            return ret;
        }, arguments); },
        __wbg_build_ec6b1db55abe7140: function(arg0, arg1) {
            const ret = arg0.build(arg1);
            return ret;
        },
        __wbg_call_187d372bd5fdd4aa: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_cast_a26290dad4e3e8b8: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.cast(arg1, __wbindgen_enum_MlOperandDataType[arg2], arg3);
            return ret;
        }, arguments); },
        __wbg_ceil_71375c3fc9f9d17b: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.ceil(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_clamp_abde99e36160ac71: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.clamp(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_concat_3ac28d6770e539f9: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.concat(getArrayJsValueViewFromWasm0(arg1, arg2), arg3 >>> 0, arg4);
            return ret;
        }, arguments); },
        __wbg_constant_3c46059dbb4d04c7: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.constant(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_conv2d_8b257098e562f519: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.conv2d(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_convTranspose2d_f20ebd713c7b03af: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.convTranspose2d(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_cos_5e4b4fe836c9ddab: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.cos(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_cumulativeSum_bf7c91792e89feda: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.cumulativeSum(arg1, arg2 >>> 0, arg3);
            return ret;
        }, arguments); },
        __wbg_dequantizeLinear_e7a3f331a4fa7415: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.dequantizeLinear(arg1, arg2, arg3, arg4);
            return ret;
        }, arguments); },
        __wbg_div_ee6385a8052b5426: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.div(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_elu_c402f3241ee706d9: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.elu(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_equal_2b6a45455b0f2f42: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.equal(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_erf_d26aa3fec534d967: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.erf(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_error_757e9472f8410341: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_exp_d70f70cd581d0ade: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.exp(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_expand_845454a44d19079a: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.expand(arg1, getArrayJsValueViewFromWasm0(arg2, arg3), arg4);
            return ret;
        }, arguments); },
        __wbg_floor_0eabe437ee3af3fb: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.floor(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_gatherElements_3208477fbcafa61c: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.gatherElements(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_gatherND_d6b6b6006f1bd494: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.gatherND(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_gather_7298d3329dd9241a: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.gather(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_gelu_3fe75f894e2d141f: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.gelu(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_gemm_6f062c9bf1daf4c6: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.gemm(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_greaterOrEqual_34023ad2b12562cc: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.greaterOrEqual(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_greater_2393675c2ea8e037: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.greater(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_gruCell_2ec42b0ea3f2c251: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            const ret = arg0.gruCell(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6);
            return ret;
        }, arguments); },
        __wbg_gru_be9d7964f7ee8db4: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            const ret = arg0.gru(arg1, arg2, arg3, arg4 >>> 0, arg5 >>> 0, arg6);
            return ret;
        }, arguments); },
        __wbg_hardSigmoid_8f8e2032e7d5abf0: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.hardSigmoid(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_hardSwish_5383be0016249ac8: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.hardSwish(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_identity_78662f2788cf11c8: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.identity(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_input_ef734520ee92e2a4: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.input(getStringFromWasm0(arg1, arg2), arg3);
            return ret;
        }, arguments); },
        __wbg_instanceNormalization_e2c53257668e01d3: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.instanceNormalization(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_isInfinite_eb2d40af48a7c110: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.isInfinite(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_isNaN_be0d5e54f5724bf2: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.isNaN(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_l2Pool2d_3fc9307787e1acea: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.l2Pool2d(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_layerNormalization_b9e5ed48e2eb952d: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.layerNormalization(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_leakyRelu_3ae77d6858275829: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.leakyRelu(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_lesserOrEqual_af0babf26c5424d1: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.lesserOrEqual(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_lesser_72b9fb8b689c4d63: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.lesser(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_linear_56c80141b03e8530: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.linear(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_log_e5d13330aba591b9: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.log(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_logicalAnd_b013defbc20bf73c: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.logicalAnd(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_logicalNot_08f75a111e1c826a: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.logicalNot(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_logicalOr_f357f0086da045fc: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.logicalOr(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_logicalXor_0b19d98ca794ae56: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.logicalXor(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_lstmCell_33b5574bdac4b53c: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
            const ret = arg0.lstmCell(arg1, arg2, arg3, arg4, arg5, arg6 >>> 0, arg7);
            return ret;
        }, arguments); },
        __wbg_lstm_da4b225f4a4294e9: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            const ret = arg0.lstm(arg1, arg2, arg3, arg4 >>> 0, arg5 >>> 0, arg6);
            return ret;
        }, arguments); },
        __wbg_matmul_9f159ec19e22701e: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.matmul(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_maxPool2d_c2e2da42a66fa0bc: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.maxPool2d(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_max_0778242ec753ce79: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.max(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_min_06ae9a768c87696d: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.min(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_mul_f19845294e505d2c: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.mul(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_neg_10730dca50c6cbfc: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.neg(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_new_28744009d011f847: function() {
            const ret = new Map();
            return ret;
        },
        __wbg_new_617a8cdb8bb1130e: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_ee2291f50781bf1d: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_fbd9bc3911010870: function() { return handleError(function (arg0) {
            const ret = new MLGraphBuilder(arg0);
            return ret;
        }, arguments); },
        __wbg_new_from_slice_9a868026ffa4208a: function(arg0, arg1) {
            const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_new_typed_689a3a281a8d4da6: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_typed_b01cb72a8af741a3: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return wasm_bindgen_ea3c40fd249d112d___convert__closures_____invoke___js_sys_fbacb6b82fe0334d___Function_fn_wasm_bindgen_ea3c40fd249d112d___JsValue_____wasm_bindgen_ea3c40fd249d112d___sys__Undefined___js_sys_fbacb6b82fe0334d___Function_fn_wasm_bindgen_ea3c40fd249d112d___JsValue_____wasm_bindgen_ea3c40fd249d112d___sys__Undefined_______true_(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return ret;
            } finally {
                state0.a = 0;
            }
        },
        __wbg_notEqual_1740af9052e8839a: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.notEqual(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_pad_3d611aa5d1e1778e: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            const ret = arg0.pad(arg1, getArrayJsValueViewFromWasm0(arg2, arg3), getArrayJsValueViewFromWasm0(arg4, arg5), arg6);
            return ret;
        }, arguments); },
        __wbg_pow_e434b6a4c378f75d: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.pow(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_prelu_297b8d218ca702b7: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.prelu(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_quantizeLinear_fb5bcd78ed2c5dbe: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.quantizeLinear(arg1, arg2, arg3, arg4);
            return ret;
        }, arguments); },
        __wbg_queueMicrotask_9833f9a49df95a49: function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        },
        __wbg_queueMicrotask_a72f977e97f23c5f: function(arg0) {
            queueMicrotask(arg0);
        },
        __wbg_reciprocal_b3fdcc690d8543fe: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reciprocal(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reduceL1_ed7c9acc00cb6fcc: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reduceL1(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reduceL2_7b660da75acb68dc: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reduceL2(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reduceLogSumExp_c83d09810a389e64: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reduceLogSumExp(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reduceLogSum_e16b61553ddd1c46: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reduceLogSum(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reduceMax_3dd32fcd8962b31f: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reduceMax(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reduceMean_734b496fb7fbd98b: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reduceMean(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reduceMin_188f5a2c3aaec7c1: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reduceMin(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reduceProduct_8cd39fdf346aa065: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reduceProduct(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reduceSumSquare_2e2a8894a09df869: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reduceSumSquare(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reduceSum_4bb85b3d639a468f: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reduceSum(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_relu_496db16dc5b739f5: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.relu(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_resample2d_ebff8c895034fc50: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.resample2d(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_reshape_5c66cd6df9fdc6a8: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.reshape(arg1, getArrayJsValueViewFromWasm0(arg2, arg3), arg4);
            return ret;
        }, arguments); },
        __wbg_resolve_0076e10020304ede: function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        },
        __wbg_reverse_682f5ce6b77f146c: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.reverse(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_roundEven_187716a69e80f1e5: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.roundEven(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_scatterElements_42a1a2a006c3a74c: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.scatterElements(arg1, arg2, arg3, arg4);
            return ret;
        }, arguments); },
        __wbg_scatterND_9ca31787c2ee4d0e: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.scatterND(arg1, arg2, arg3, arg4);
            return ret;
        }, arguments); },
        __wbg_set_145a351398b48c65: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_set_6ae97e73113c4f0b: function(arg0, arg1, arg2) {
            const ret = arg0.set(arg1, arg2);
            return ret;
        },
        __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
            arg0[arg1] = arg2;
        },
        __wbg_set_a_transpose_e8a6717216fe49f2: function(arg0, arg1) {
            arg0.aTranspose = arg1 !== 0;
        },
        __wbg_set_activations_1388151de8f382ee: function(arg0, arg1, arg2) {
            arg0.activations = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_activations_2f4be66b98860c77: function(arg0, arg1, arg2) {
            arg0.activations = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_activations_4096baeebadbc2e5: function(arg0, arg1, arg2) {
            arg0.activations = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_activations_c752acc86a0b01fc: function(arg0, arg1, arg2) {
            arg0.activations = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_alpha_2c0ca87155d699bd: function(arg0, arg1) {
            arg0.alpha = arg1;
        },
        __wbg_set_alpha_a08154bf0031e07b: function(arg0, arg1) {
            arg0.alpha = arg1;
        },
        __wbg_set_alpha_b6ec82053e2fa9aa: function(arg0, arg1) {
            arg0.alpha = arg1;
        },
        __wbg_set_alpha_df2e32373d40bb6b: function(arg0, arg1) {
            arg0.alpha = arg1;
        },
        __wbg_set_alpha_f4ca12922b9e6bde: function(arg0, arg1) {
            arg0.alpha = arg1;
        },
        __wbg_set_axes_51d9e584f6c5e2c7: function(arg0, arg1, arg2) {
            arg0.axes = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_axes_88cafd2372f1b834: function(arg0, arg1, arg2) {
            arg0.axes = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_axes_9796e9fbcd9eaa55: function(arg0, arg1, arg2) {
            arg0.axes = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_axes_c0e0575f36835c53: function(arg0, arg1, arg2) {
            arg0.axes = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_axis_20112b4495664e94: function(arg0, arg1) {
            arg0.axis = arg1 >>> 0;
        },
        __wbg_set_axis_7fa9dd8cffd1d360: function(arg0, arg1) {
            arg0.axis = arg1 >>> 0;
        },
        __wbg_set_axis_a93494796e43123d: function(arg0, arg1) {
            arg0.axis = arg1 >>> 0;
        },
        __wbg_set_axis_f970878b51faf593: function(arg0, arg1) {
            arg0.axis = arg1 >>> 0;
        },
        __wbg_set_b_transpose_fb4dfdcc34498f1f: function(arg0, arg1) {
            arg0.bTranspose = arg1 !== 0;
        },
        __wbg_set_bea140a88be9b277: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbg_set_beta_067b405b7dd32633: function(arg0, arg1) {
            arg0.beta = arg1;
        },
        __wbg_set_beta_6b015f969d09f250: function(arg0, arg1) {
            arg0.beta = arg1;
        },
        __wbg_set_beta_d5b84ab5865b7a8c: function(arg0, arg1) {
            arg0.beta = arg1;
        },
        __wbg_set_bias_07557094c846b6ab: function(arg0, arg1) {
            arg0.bias = arg1;
        },
        __wbg_set_bias_30b45de4b11592ff: function(arg0, arg1) {
            arg0.bias = arg1;
        },
        __wbg_set_bias_358658a8605546f2: function(arg0, arg1) {
            arg0.bias = arg1;
        },
        __wbg_set_bias_4abb8a2520e4d377: function(arg0, arg1) {
            arg0.bias = arg1;
        },
        __wbg_set_bias_4ad3f1f2905627fa: function(arg0, arg1) {
            arg0.bias = arg1;
        },
        __wbg_set_bias_4cab20ed30d0d6a3: function(arg0, arg1) {
            arg0.bias = arg1;
        },
        __wbg_set_bias_5b3864d4e3211092: function(arg0, arg1) {
            arg0.bias = arg1;
        },
        __wbg_set_bias_7c44a304f0f7ec81: function(arg0, arg1) {
            arg0.bias = arg1;
        },
        __wbg_set_bias_aa92338832bce87d: function(arg0, arg1) {
            arg0.bias = arg1;
        },
        __wbg_set_data_type_f18bba88f685cfb3: function(arg0, arg1) {
            arg0.dataType = __wbindgen_enum_MlOperandDataType[arg1];
        },
        __wbg_set_diagonal_c9dd18651c051120: function(arg0, arg1) {
            arg0.diagonal = arg1;
        },
        __wbg_set_dilations_5bbaa49c311c2c83: function(arg0, arg1, arg2) {
            arg0.dilations = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_dilations_aefc11dc7370a552: function(arg0, arg1, arg2) {
            arg0.dilations = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_dilations_cc963a671b2e711c: function(arg0, arg1, arg2) {
            arg0.dilations = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_direction_5f36c69e59629523: function(arg0, arg1) {
            arg0.direction = __wbindgen_enum_MlRecurrentNetworkDirection[arg1];
        },
        __wbg_set_direction_f3ca1a52259937bc: function(arg0, arg1) {
            arg0.direction = __wbindgen_enum_MlRecurrentNetworkDirection[arg1];
        },
        __wbg_set_epsilon_81b8d0854a4d4946: function(arg0, arg1) {
            arg0.epsilon = arg1;
        },
        __wbg_set_epsilon_afc4d129b2654610: function(arg0, arg1) {
            arg0.epsilon = arg1;
        },
        __wbg_set_epsilon_b3f688bdfe794177: function(arg0, arg1) {
            arg0.epsilon = arg1;
        },
        __wbg_set_exclusive_448ae6c746d5062c: function(arg0, arg1) {
            arg0.exclusive = arg1 !== 0;
        },
        __wbg_set_filter_layout_048ccc3028719d94: function(arg0, arg1) {
            arg0.filterLayout = __wbindgen_enum_MlConvTranspose2dFilterOperandLayout[arg1];
        },
        __wbg_set_filter_layout_16c618fd3ced8cd5: function(arg0, arg1) {
            arg0.filterLayout = __wbindgen_enum_MlConv2dFilterOperandLayout[arg1];
        },
        __wbg_set_groups_9f55052c7874e36d: function(arg0, arg1) {
            arg0.groups = arg1 >>> 0;
        },
        __wbg_set_groups_e80b9f692f009639: function(arg0, arg1) {
            arg0.groups = arg1 >>> 0;
        },
        __wbg_set_initial_cell_state_c695a2d2761dd9b4: function(arg0, arg1) {
            arg0.initialCellState = arg1;
        },
        __wbg_set_initial_hidden_state_888f0f96ca0b84df: function(arg0, arg1) {
            arg0.initialHiddenState = arg1;
        },
        __wbg_set_initial_hidden_state_bf2aceb5d6e18cdf: function(arg0, arg1) {
            arg0.initialHiddenState = arg1;
        },
        __wbg_set_input_layout_c78c0ad431d82ae1: function(arg0, arg1) {
            arg0.inputLayout = __wbindgen_enum_MlInputOperandLayout[arg1];
        },
        __wbg_set_input_layout_d59a690f5c24f169: function(arg0, arg1) {
            arg0.inputLayout = __wbindgen_enum_MlInputOperandLayout[arg1];
        },
        __wbg_set_keep_dimensions_77dee6bfb68e60ec: function(arg0, arg1) {
            arg0.keepDimensions = arg1 !== 0;
        },
        __wbg_set_keep_dimensions_f02acc7912d13641: function(arg0, arg1) {
            arg0.keepDimensions = arg1 !== 0;
        },
        __wbg_set_label_04d86fa03a75a935: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_096983b0cd3e5b79: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_09763677d72795e1: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_105845f583650611: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_161fefdd7b08f37b: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_2237e192a09a09dd: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_27fcdfb57072caab: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_35253d11a3d8e6f1: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_373d59dc3fef40e6: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_48448e377b8cdfdf: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_554d93882c8938c0: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_5646c32064ef3c00: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_57c9d626952b9358: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_6667d13414dc8ee4: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_678577543f35ce84: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_68eb9136ac5ead08: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_7ffeccd55a3d1102: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_933cad94461e0805: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_9552690819b683fd: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_9649494848b22b68: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_9d5090f457972cd0: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_9d555eee80fda679: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_9e3476fa021ae810: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_b235e46e8de9d732: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_cb1a02d97822e70c: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_cc1b0246b1a2af55: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_dac7c778e7ae1caa: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_dc00821d199ebd0a: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_f05008e673cf3e18: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_layout_0ccdabb7e3008947: function(arg0, arg1) {
            arg0.layout = __wbindgen_enum_MlLstmWeightLayout[arg1];
        },
        __wbg_set_layout_4a462af6e9cb2daf: function(arg0, arg1) {
            arg0.layout = __wbindgen_enum_MlLstmWeightLayout[arg1];
        },
        __wbg_set_layout_881ff6820babe43e: function(arg0, arg1) {
            arg0.layout = __wbindgen_enum_MlGruWeightLayout[arg1];
        },
        __wbg_set_layout_ac67f9e2ad3886a4: function(arg0, arg1) {
            arg0.layout = __wbindgen_enum_MlGruWeightLayout[arg1];
        },
        __wbg_set_layout_e6c9eaf423aabcb5: function(arg0, arg1) {
            arg0.layout = __wbindgen_enum_MlInputOperandLayout[arg1];
        },
        __wbg_set_layout_fa5de2040c69a030: function(arg0, arg1) {
            arg0.layout = __wbindgen_enum_MlInputOperandLayout[arg1];
        },
        __wbg_set_max_value_f64_6e8f67d8a4f937c7: function(arg0, arg1) {
            arg0.maxValue = arg1;
        },
        __wbg_set_min_value_f64_892ea3468320a075: function(arg0, arg1) {
            arg0.minValue = arg1;
        },
        __wbg_set_mode_53ea85b7304f9293: function(arg0, arg1) {
            arg0.mode = __wbindgen_enum_MlInterpolationMode[arg1];
        },
        __wbg_set_mode_eb25d67a77194ff5: function(arg0, arg1) {
            arg0.mode = __wbindgen_enum_MlPaddingMode[arg1];
        },
        __wbg_set_output_data_type_bb9219460468729a: function(arg0, arg1) {
            arg0.outputDataType = __wbindgen_enum_MlOperandDataType[arg1];
        },
        __wbg_set_output_padding_fa86b26d8374b886: function(arg0, arg1, arg2) {
            arg0.outputPadding = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_output_shape_rounding_51479b6209d441ac: function(arg0, arg1) {
            arg0.outputShapeRounding = __wbindgen_enum_MlRoundingType[arg1];
        },
        __wbg_set_output_sizes_108238d5a1d45b35: function(arg0, arg1, arg2) {
            arg0.outputSizes = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_output_sizes_33fd9b0b55ec14f8: function(arg0, arg1, arg2) {
            arg0.outputSizes = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_padding_05b17ccdc3bbf507: function(arg0, arg1, arg2) {
            arg0.padding = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_padding_61ddd94760896500: function(arg0, arg1, arg2) {
            arg0.padding = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_padding_a4ccd4153464ea04: function(arg0, arg1, arg2) {
            arg0.padding = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_peephole_weight_61cdd839661804a0: function(arg0, arg1) {
            arg0.peepholeWeight = arg1;
        },
        __wbg_set_peephole_weight_c411e43d717c8a83: function(arg0, arg1) {
            arg0.peepholeWeight = arg1;
        },
        __wbg_set_permutation_5955835be8c2071e: function(arg0, arg1, arg2) {
            arg0.permutation = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_recurrent_bias_40af0ba3c11e07c0: function(arg0, arg1) {
            arg0.recurrentBias = arg1;
        },
        __wbg_set_recurrent_bias_8337f70a08cf6ff8: function(arg0, arg1) {
            arg0.recurrentBias = arg1;
        },
        __wbg_set_recurrent_bias_84a3528bf8e02e3c: function(arg0, arg1) {
            arg0.recurrentBias = arg1;
        },
        __wbg_set_recurrent_bias_88fcd3ffe53167b9: function(arg0, arg1) {
            arg0.recurrentBias = arg1;
        },
        __wbg_set_reset_after_8cce07a67b85b1eb: function(arg0, arg1) {
            arg0.resetAfter = arg1 !== 0;
        },
        __wbg_set_reset_after_c3be70fcb5304278: function(arg0, arg1) {
            arg0.resetAfter = arg1 !== 0;
        },
        __wbg_set_return_sequence_0acfb392c138e8ab: function(arg0, arg1) {
            arg0.returnSequence = arg1 !== 0;
        },
        __wbg_set_return_sequence_c4e21a67886e3562: function(arg0, arg1) {
            arg0.returnSequence = arg1 !== 0;
        },
        __wbg_set_reversed_3f54b5ecd854900f: function(arg0, arg1) {
            arg0.reversed = arg1 !== 0;
        },
        __wbg_set_scale_5f9acb3cbd530263: function(arg0, arg1) {
            arg0.scale = arg1;
        },
        __wbg_set_scale_a48d24dd3901805b: function(arg0, arg1) {
            arg0.scale = arg1;
        },
        __wbg_set_scale_fb505607f6c0a04f: function(arg0, arg1) {
            arg0.scale = arg1;
        },
        __wbg_set_scales_477cf1a7ea16b398: function(arg0, arg1, arg2) {
            arg0.scales = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_shape_7805059d1c806275: function(arg0, arg1, arg2) {
            arg0.shape = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_sizes_ce473ede3c520377: function(arg0, arg1, arg2) {
            arg0.sizes = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_strides_619f0c6b1d828dca: function(arg0, arg1, arg2) {
            arg0.strides = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_strides_beaf7d9d5df329b4: function(arg0, arg1, arg2) {
            arg0.strides = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_strides_c4833854476302bb: function(arg0, arg1, arg2) {
            arg0.strides = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_strides_c9e456f0a0db5740: function(arg0, arg1, arg2) {
            arg0.strides = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_set_upper_4d82c46a56fe8f31: function(arg0, arg1) {
            arg0.upper = arg1 !== 0;
        },
        __wbg_set_window_dimensions_3984258f21729206: function(arg0, arg1, arg2) {
            arg0.windowDimensions = getArrayJsValueViewFromWasm0(arg1, arg2);
        },
        __wbg_sigmoid_06053249b188a7da: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.sigmoid(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_sign_2127556928f285e0: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.sign(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_sin_de34f72ec3ac4c2b: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.sin(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_slice_6da4cdc5d543fcd0: function(arg0, arg1) {
            const ret = arg1.slice();
            const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_slice_b54aba9dbcfa9bc8: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            const ret = arg0.slice(arg1, getArrayJsValueViewFromWasm0(arg2, arg3), getArrayJsValueViewFromWasm0(arg4, arg5), arg6);
            return ret;
        }, arguments); },
        __wbg_softmax_b59c7b56a41df0a9: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.softmax(arg1, arg2 >>> 0, arg3);
            return ret;
        }, arguments); },
        __wbg_softplus_ab39b7914be1967f: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.softplus(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_softsign_ef0c3f1257aec569: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.softsign(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_split_0bc1c854c81de20a: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.split(arg1, arg2 >>> 0, arg3);
            return ret;
        }, arguments); },
        __wbg_split_39d601fa49782279: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.split(arg1, getArrayJsValueViewFromWasm0(arg2, arg3), arg4);
            return ret;
        }, arguments); },
        __wbg_sqrt_23f19c2fb10a3de3: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.sqrt(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_static_accessor_GLOBAL_266715b9d96ba635: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_10fb7dc1ae063179: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_SELF_0b583911f537483a: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_WINDOW_d7f903d1508cbdc4: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_sub_c227f1db110fe916: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.sub(arg1, arg2, arg3);
            return ret;
        }, arguments); },
        __wbg_tan_c5541f2a0ead0e6f: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.tan(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_tanh_2365bbe843432f75: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.tanh(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_then_c949d5a25a4e78f8: function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        },
        __wbg_then_e71170d78fcf8954: function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        },
        __wbg_tile_8af31cff00581264: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.tile(arg1, getArrayJsValueViewFromWasm0(arg2, arg3), arg4);
            return ret;
        }, arguments); },
        __wbg_transpose_a00ad1763ff2f539: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.transpose(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_triangular_39d533ba22e63533: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.triangular(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_where_9ddffc3d08bfe1eb: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.where(arg1, arg2, arg3, arg4);
            return ret;
        }, arguments); },
        __wbindgen_generic_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 950, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_ea3c40fd249d112d___convert__closures_____invoke___wasm_bindgen_ea3c40fd249d112d___JsValue__core_f0fd674eaa06beef___result__Result_____wasm_bindgen_ea3c40fd249d112d___JsError___true_);
            return ret;
        },
        __wbindgen_generic_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("MLGraph")], shim_idx: 169, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_ea3c40fd249d112d___convert__closures_____invoke___rustnn_64f72139cf386bf8___backends__webnn__api_generated__gen_MlGraph__MlGraph__core_f0fd674eaa06beef___result__Result_____wasm_bindgen_ea3c40fd249d112d___JsError___true_);
            return ret;
        },
        __wbindgen_generic_0000000000000003: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_generic_0000000000000004: function(arg0) {
            // Cast intrinsic for `I64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_generic_0000000000000005: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000006: function(arg0) {
            // Cast intrinsic for `U64 -> Externref`.
            const ret = BigInt.asUintN(64, arg0);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./rustnn_webnn_browser_demo_bg.js": import0,
    };
}

function wasm_bindgen_ea3c40fd249d112d___convert__closures_____invoke___wasm_bindgen_ea3c40fd249d112d___JsValue__core_f0fd674eaa06beef___result__Result_____wasm_bindgen_ea3c40fd249d112d___JsError___true_(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_ea3c40fd249d112d___convert__closures_____invoke___wasm_bindgen_ea3c40fd249d112d___JsValue__core_f0fd674eaa06beef___result__Result_____wasm_bindgen_ea3c40fd249d112d___JsError___true_(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_ea3c40fd249d112d___convert__closures_____invoke___rustnn_64f72139cf386bf8___backends__webnn__api_generated__gen_MlGraph__MlGraph__core_f0fd674eaa06beef___result__Result_____wasm_bindgen_ea3c40fd249d112d___JsError___true_(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_ea3c40fd249d112d___convert__closures_____invoke___rustnn_64f72139cf386bf8___backends__webnn__api_generated__gen_MlGraph__MlGraph__core_f0fd674eaa06beef___result__Result_____wasm_bindgen_ea3c40fd249d112d___JsError___true_(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_ea3c40fd249d112d___convert__closures_____invoke___js_sys_fbacb6b82fe0334d___Function_fn_wasm_bindgen_ea3c40fd249d112d___JsValue_____wasm_bindgen_ea3c40fd249d112d___sys__Undefined___js_sys_fbacb6b82fe0334d___Function_fn_wasm_bindgen_ea3c40fd249d112d___JsValue_____wasm_bindgen_ea3c40fd249d112d___sys__Undefined_______true_(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen_ea3c40fd249d112d___convert__closures_____invoke___js_sys_fbacb6b82fe0334d___Function_fn_wasm_bindgen_ea3c40fd249d112d___JsValue_____wasm_bindgen_ea3c40fd249d112d___sys__Undefined___js_sys_fbacb6b82fe0334d___Function_fn_wasm_bindgen_ea3c40fd249d112d___JsValue_____wasm_bindgen_ea3c40fd249d112d___sys__Undefined_______true_(arg0, arg1, arg2, arg3);
}


const __wbindgen_enum_MlConv2dFilterOperandLayout = ["oihw", "hwio", "ohwi", "ihwo"];


const __wbindgen_enum_MlConvTranspose2dFilterOperandLayout = ["iohw", "hwoi", "ohwi"];


const __wbindgen_enum_MlGruWeightLayout = ["zrn", "rzn"];


const __wbindgen_enum_MlInputOperandLayout = ["nchw", "nhwc"];


const __wbindgen_enum_MlInterpolationMode = ["nearest-neighbor", "linear"];


const __wbindgen_enum_MlLstmWeightLayout = ["iofg", "ifgo"];


const __wbindgen_enum_MlOperandDataType = ["float32", "float16", "int32", "uint32", "int64", "uint64", "int8", "uint8"];


const __wbindgen_enum_MlPaddingMode = ["constant", "edge", "reflection"];


const __wbindgen_enum_MlRecurrentNetworkDirection = ["forward", "backward", "both"];


const __wbindgen_enum_MlRoundingType = ["floor", "ceil"];

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => wasm.__wbindgen_destroy_closure(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayJsValueViewFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            wasm.__wbindgen_destroy_closure(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('rustnn_webnn_browser_demo_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
