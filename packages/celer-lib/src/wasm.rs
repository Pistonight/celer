/* Import Validation Exempt */#![allow(clippy::unused_unit)] 
/* Import Validation Exempt */// ^ This warning is within wasm_bindgen and we can't fix it
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
    let bundled_json = super::api::bundle(&source_json, &mut errors).to_json();

    JsValue::from_serde(&json!({
        "bundle": bundled_json,
        "errors": errors
    })).unwrap()
}
