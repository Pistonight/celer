use serde_json::json;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;
// WASM API

#[wasm_bindgen(js_name="wasmLibVersion")]
pub fn lib_version() -> String {
    super::api::lib_version()
}

/// Bundle the route
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
    let output_config = crate::core::Config::from(&input_config_json);
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
