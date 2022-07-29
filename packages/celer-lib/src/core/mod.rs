mod structs;
use structs::{Config, Metadata, SourceSection};

mod bundler;
use bundler::Bundler;
use std::collections::HashMap;

/// data structure that represents the bundled source files.
#[derive(Debug)]
pub struct SourceObject {
    /// Metadata
    pub project: Metadata,
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
    /// Convert and bundle json source into SourceObject
    pub fn from(value: &serde_json::Value) -> SourceObject{
        if !value.is_object() {
            return SourceObject {
                project: Metadata::new(),
                config: Config::new(),
                route: Vec::new(),
                global_error: Some(String::from("Input is not an object (mapping)"))
            };
        }
        let metadata = Metadata::from(&value["_project"]);
        let config = Config::from(&value["_config"]);
        let route = value["_route"];
        if let Some(obj_route) = route.as_array() {
            let mut modules = HashMap::new();
            for (k,v) in value.as_object().unwrap() {
                modules.insert(String::from(k), v.clone());
            }
            let sections = obj_route.iter().map(|x|SourceSection::from(x)).collect();
            return match Bundler::bundle(&sections, modules) {
                Ok(bundled_sections) => SourceObject {
                    project: metadata,
                    config: config,
                    route: bundled_sections,
                    global_error: None
                },
                Err(message) => SourceObject {
                    project: metadata,
                    config: config,
                    route: Vec::new(),
                    global_error: Some(message)
                }
            };
        }

        SourceObject {
            project: metadata,
            config: config,
            route: Vec::new(),
            global_error: Some(String::from("Missing _route property or _route is not an array"))
        }
    }
}






// // Intermediate step. Strings and presets parsed and processed. Data is standardized to make the job of the route engine easier
// pub struct RouteAssembly {

// }

// // Processed Route Assembly ready to be consumed by the render engine
// pub enum RouteObject {

// }

// bundle workflow: arbitrary files > attempt to parse yaml > attempt to convert untyped json to rust objects > run bundle > bundled object (> bundle.json)
// compile workflow: unsafe bundle.json > attempt to parse bundle.json > bundled object > run compile > compiled object
// compute workflow: compiled object > run compute engine > doc object
