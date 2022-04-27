
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Metadata {
    pub name: String,
    pub version: String,
    pub authors: Vec<String>,
    pub url: String,
    pub description: String
}

// use std::collections::HashMap;
// // data structure that represents the source files.
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct SourceObject {
    #[serde( rename = "_project")]
    pub project: Metadata,
}

// impl SourceObject {
//     pub fn new() -> SourceObject {
//         SourceObject {
//             project: RouteMetadata {
//                 name: String::new(),
//                 version: String::new(),
//                 authors: Vec::new(),
//                 url: String::new(),
//                 description: String::new()
//             },
//             route: Vec::new(),
//         }
//     }
// }


// pub enum SourceSection {
//     Unnamed(SourceModule),
//     Named(String, SourceModule)
// }

// pub enum SourceModule {
//     SingleStep(SourceStep),
//     MultiStep(Vec<SourceStep>)
// }

// pub enum SourceStep {
//     Simple(String),
//     Extended(String, SourceStepCustomization)
// }

// pub struct SourceStepCustomization {
//     text: Option<String>,
//     icon: Option<String>,
//     comment: Option<String>,
//     notes: Option<String>,
//     line_color: Option<String>,
//     hide_icon_on_map: bool,
//     split_type: Option<String>,
//     var_change: HashMap<String, i32>,
//     time_override: i32,
//     commands: Option<Vec<String>>,
//     coord: Option<Vec<i32>>,
//     movements: Option<Vec<Movement>>,
//     fury: Option<i32>,
//     gale: Option<i32>

// }

// pub struct Movement {
//     to: Vec<i32>,
//     away: bool,
//     warp: bool
// }

// // Intermediate step. Strings and presets parsed and processed. Data is standardized to make the job of the route engine easier
// pub struct RouteAssembly {

// }

// // Processed Route Assembly ready to be consumed by the render engine
// pub enum RouteObject {

// }
