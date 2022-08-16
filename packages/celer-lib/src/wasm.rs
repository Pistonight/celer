#![allow(clippy::unused_unit)] // This warning is within wasm_bindgen and we can't fix it
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;
// WASM API

#[wasm_bindgen(js_name="wasmLibVersion")]
pub fn lib_version() -> String {
    super::api::lib_version()
}

#[wasm_bindgen(js_name="wasmBundle")]
pub fn bundle(source: &JsValue) -> JsValue {
    let source_json = source.into_serde().unwrap();
    let bundled_json = super::api::bundle(&source_json).to_json();

    JsValue::from_serde(&bundled_json).unwrap()
}
