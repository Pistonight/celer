
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Metadata {
    pub name: String,
    pub version: String,
    pub authors: Vec<String>,
    pub url: String,
    pub description: String
}

#[derive(Debug)]
pub struct Config {
    pub split_format: SplitTypeConfig
}

#[derive(Debug)]
pub struct SplitTypeConfig {
    pub config_type: ConfigType,
    pub none: Option<String>,
    pub shrine: Option<String>,
    pub tower: Option<String>,
    pub warp: Option<String>,
    pub memory: Option<String>,
    pub korok: Option<String>,
    pub hinox: Option<String>,
    pub talus: Option<String>,
    pub molduga: Option<String>,
    pub user_defined: Option<String>
}

use std::collections::HashMap;
// data structure that represents the source files.
#[derive(Debug)]
pub struct SourceObject {
    pub project: Metadata,
    pub route: Vec<SourceSection>,
    pub config: Config
}

impl SourceObject {
    pub fn new() -> SourceObject {
        SourceObject {
            project: Metadata {
                name: String::new(),
                version: String::new(),
                authors: Vec::new(),
                url: String::new(),
                description: String::new()
            },
            route: Vec::new(),
            config: Config {
                split_format: SplitTypeConfig {
                    config_type: ConfigType::Str,
                    none: Option::None,
                    shrine: Option::None,
                    tower: Option::None,
                    warp: Option::None,
                    memory: Option::None,
                    korok: Option::None,
                    hinox: Option::None,
                    talus: Option::None,
                    molduga: Option::None,
                    user_defined: Option::None,
                }
            }
        }
    }
}

#[derive(Debug)]
pub enum SourceSection {
    Unnamed(SourceModule),
    Named(String, SourceModule)
}

#[derive(Debug)]
pub enum SourceModule {
    SingleStep(SourceStep),
    MultiStep(Vec<SourceStep>)
}

#[derive(Debug)]
pub enum SourceStep {
    Simple(String),
    Extended(String, SourceStepCustomization)
}

#[derive(Debug)]
pub struct SourceStepCustomization {
    text: Option<String>,
    icon: Option<String>,
    comment: Option<String>,
    notes: Option<String>,
    line_color: Option<String>,
    hide_icon_on_map: bool,
    split_type: Option<String>,
    var_change: HashMap<String, i32>,
    time_override: i32,
    commands: Option<Vec<String>>,
    coord: Option<Vec<i32>>,
    movements: Option<Vec<Movement>>,
    fury: Option<i32>,
    gale: Option<i32>

}

#[derive(Debug)]
pub struct Movement {
    to: Vec<f32>,
    away: MovementFlag,
}

#[derive(Debug)]
pub enum MovementFlag {
    Normal,
    Away,
    Warp
}

#[derive(Debug)]
pub enum ConfigType {
    Str,
    Num,
    Bool
}

fn bundle_route_script(source: SourceObject, sections: HashMap<String, SourceModule>) -> SourceObject {
    // scan dependency
    // make sure no circular dependency
    // bundle each section

}

fn bundle_sections(sections: Vec<SourceSection>, cache: HashMap<String, SourceModule>, unbundledSections: HashMap<String, SourceModule>) -> Vec<SourceSection> {
    
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
