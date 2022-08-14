use serde_json::json;
use super::module::SourceModule;
use super::step::SourceStep;


/// Struct to represent a section
#[derive(Debug)]
pub enum SourceSection {
    Unnamed(SourceModule),
    Named(String, SourceModule)
}

impl SourceSection {
    pub fn from(value: &serde_json::Value) -> Self {
        if let Some(obj_value) = value.as_object() {
            if obj_value.len() != 1 {
                let error = "Section must only have 1 key. Did you indent correctly?".to_string();
                return SourceSection::Unnamed(SourceModule::SingleStep(SourceStep::Error(error, value.to_string())));
            }
            if let Some((k,v)) = obj_value.into_iter().next() {
                // There's only one key
                return SourceSection::Named(String::from(k), SourceModule::from(v));
            }
        }
        
        SourceSection::Unnamed(SourceModule::from(value))
    }

    pub fn to_json(&self) -> serde_json::Value {
        match self {
            SourceSection::Unnamed(module) => module.to_json(),
            SourceSection::Named(name, module) => {
                json!({
                    name: module.to_json()
                })
            }
        }
    }
}
