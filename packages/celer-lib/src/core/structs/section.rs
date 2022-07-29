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
                let error = format!("Section must only have 1 key. Did you indent correctly?");
                return SourceSection::Unnamed(SourceModule::SingleStep(SourceStep::Error(error, value.to_string())));
            }
            for (k,v) in obj_value {
                // There's only one key
                return SourceSection::Named(String::from(k), SourceModule::from(v));
            }
        }
        
        return SourceSection::Unnamed(SourceModule::from(value));
    }
}