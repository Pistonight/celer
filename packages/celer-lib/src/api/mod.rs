#![allow(clippy::unused_unit)] // This warning is within wasm_bindgen and we can't fix it
use wasm_bindgen::prelude::wasm_bindgen;
// WASM API

#[wasm_bindgen(js_name="wasmLibVersion")]
pub fn lib_version() -> String {
    String::from(crate::VERSION)
}

// pub fn some_function() {}

// (preprocess) convert + bundle to source object: Source Object -> export as json
// (build) compile source (process strings and presets) to Route Assembly -> export as json
// (execute) engine takes in route object and emit Route Object -> export as json
// (postprocess) (web app only) take route lines and calculate map icons/paths, export as lss, etc 
