#![allow(clippy::unused_unit)] // This warning is within wasm_bindgen and we can't fix it
use wasm_bindgen::prelude::wasm_bindgen;
// WASM API

#[wasm_bindgen(js_name="wasmLibVersion")]
pub fn lib_version() -> String {
    String::from(crate::VERSION)
}
