use serde_json::json;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
// WASM API

#[wasm_bindgen(js_name="wasmLibVersion")]
pub fn lib_version() -> String {
    super::api::lib_version()
}

/// Bundle the route
/// The input will be validated, and output.bundle will always be a valid SourceObject
/// Input: unbundled source
/// Output: {
///     "bundle": SourceObject
///     "errors": BundlerError[] // empty if no error
/// }
#[wasm_bindgen(js_name="wasmBundle")]
pub fn bundle(source: &JsValue) -> JsValue {
    let source_json = source.into_serde().unwrap();
    let mut errors = Vec::new();
    let bundled_json = crate::api::bundle(&source_json, &mut errors).to_json();

    JsValue::from_serde(&json!({
        "bundle": bundled_json,
        "errors": errors
    })).unwrap()
}

/// Ensure config object is valid.
/// Input and output are both RouteConfig
#[wasm_bindgen(js_name="wasmEnsureRouteConfig")]
pub fn ensure_config(input_config: &JsValue) -> JsValue {
    let input_config_json = input_config.into_serde().unwrap();
    let mut _ignored_errors = vec![];
    let output_config = crate::core::Config::from(&input_config_json, &mut _ignored_errors)
        .or(Some(crate::core::Config::new())).unwrap();
    let output_config_json = output_config.to_json();

    JsValue::from_serde(&output_config_json).unwrap()
}

/// Ensure metadata object is valid.
/// Input and output are both RouteMetadata
#[wasm_bindgen(js_name="wasmEnsureRouteMetadata")]
pub fn ensure_metadata(input_metadata: &JsValue) -> JsValue {
    let input_metadata_json = input_metadata.into_serde().unwrap();
    let output_metadata = crate::core::Metadata::from(&input_metadata_json);

    JsValue::from_serde(&output_metadata).unwrap()
}

/// Decompress data from bytes and convert to bundle
/// The input will be validated, and output will always be a valid SourceObject or undefined
/// Input: Uint8Array
/// Output: SourceObject | undefined
#[wasm_bindgen(js_name="wasmBundleFromGzip")]
pub fn bundle_from_gzip(bytes: &[u8]) -> JsValue {
    if let Ok(str_value) = crate::data::decompress_str(&bytes) {
        if let Ok(mut json_value) = serde_json::from_str(&str_value) {
            let clean_bundle = crate::api::clean_bundle_json(&mut json_value);
            return JsValue::from_serde(&clean_bundle).unwrap()
        }
    }

    JsValue::undefined()
}

/// Decode and Decompress from base64
/// The input will be validated, and output will always be a valid SourceObject or undefined
/// Input: string
/// Output: SourceObject | undefined
#[wasm_bindgen(js_name="wasmBundleFromBase64")]
pub fn bundle_from_base64(input: String) -> JsValue {
    if let Some(bytes) = crate::data::b64_to_bytes(&input) {
        return bundle_from_gzip(&bytes);
    }

    JsValue::undefined()
}

/// Ensure input is a valid JSON representation of SourceObject
/// Calls api::clean_bundle_json
#[wasm_bindgen(js_name="wasmCleanBundleJson")]
pub fn clean_bundle_json(input: &JsValue) -> JsValue {
    let mut input_json = input.into_serde().unwrap();
    crate::api::clean_bundle_json(&mut input_json);

    JsValue::from_serde(&input_json).unwrap()
}