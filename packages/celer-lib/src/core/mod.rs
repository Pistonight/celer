use std::io;
use std::collections::HashMap;
use serde_json::json;
use crate::data;

mod bundler;
mod structs;

use bundler::Bundler;
pub use bundler::BundlerError;
pub use structs::{Config, Metadata, SourceSection, SourceModule, SourceStep};

/// data structure that represents the bundled source files.
#[derive(Debug)]
pub struct SourceObject {
    /// Metadata
    pub metadata: Metadata,
    /// Configuration
    pub config: Config,
    /// Bundled Route
    pub route: Vec<SourceSection>,
    /// Global error.
    /// If this is not None, there is some serious error that causes the bundler to fail
    /// e.g. Circular dependency, _route not present, etc
    pub global_error: Option<String>
}

impl SourceObject {
    /// Generate (unbundled) source object from metadata and route
    pub fn new(metadata: Metadata, route: Vec<SourceSection>) -> Self {
        Self {
            metadata,
            config: Config::new(),
            route,
            global_error: None
        }
    }
    /// Convert and bundle json source into SourceObject
    pub fn from(value: &serde_json::Value, out_bundler_errors: &mut Vec<BundlerError>) -> Self {
        if !value.is_object() {
            return Self {
                metadata: Metadata::new(),
                config: Config::new(),
                route: Vec::new(),
                global_error: Some(String::from("Input is not an object (mapping)"))
            };
        }
        let metadata = Metadata::from(&value["_project"]);

        let mut config_errors = vec![];
        let config = match Config::from(&value["_config"], &mut config_errors) {
            Some(value) => value,
            None => Config::new()
        };

        for err in config_errors {
            out_bundler_errors.push(BundlerError::make_global(&err))
        }

        let route = &value["_route"];
        if let Some(obj_route) = route.as_array() {
            let mut modules = HashMap::new();
            for (k,v) in value.as_object().unwrap() {
                modules.insert(String::from(k), v.clone());
            }
            let sections: Vec<SourceSection> = obj_route.iter().map(SourceSection::from).collect();
            return match Bundler::bundle(&sections, modules, out_bundler_errors) {
                Ok(bundled_sections) => SourceObject {
                    metadata,
                    config,
                    route: bundled_sections,
                    global_error: None
                },
                Err(message) => SourceObject {
                    metadata,
                    config,
                    route: Vec::new(),
                    global_error: Some(message)
                }
            };
        }

        Self {
            metadata,
            config,
            route: Vec::new(),
            global_error: Some(String::from("Missing _route property or _route is not an array"))
        }
    }

    pub fn to_json(&self) -> serde_json::Value {
        let route_obj: Vec<serde_json::Value> = self.route.iter().map(|x|x.to_json()).collect();
        let mut obj = json!({
            "_project": self.metadata,
            "_config": self.config.to_json(),
            "_route": route_obj,
        });
        if let Some(global_error) = &self.global_error {
            obj["_globalError"] = json!(global_error);
        }
        obj
    }

    pub fn to_bytes(&self) -> io::Result<Vec<u8>> {
        let value = self.to_json();
        let string = serde_json::to_string(&value)?;
        data::compress_str(&string)
    }

    pub fn to_b64(&self) -> io::Result<String> {
        let bytes = self.to_bytes()?;
        Ok(data::bytes_to_b64(&bytes))
    }
}



// bundle workflow: arbitrary files > attempt to parse yaml > attempt to convert untyped json to rust objects > run bundle > bundled object (> bundle.json)
// compile workflow: unsafe bundle.json > attempt to parse bundle.json > bundled object > run compile > compiled object
// compute workflow: compiled object > run compute engine > doc object
