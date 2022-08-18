use serde_json::json;
use crate::data;
use super::step_customization::SourceStepCustomization;
/// Struct for a step in the route doc
#[derive(Debug)]
pub enum SourceStep {
    /// Enum for invalid step structure. Member is the error message and source as string
    Error(String, String),
    /// Enum for simple (single-line) step
    Simple(String),
    /// Enum for step with raw-value customization 
    Extended(String, serde_json::Value),
    /// Enum for step with typed customization, after validation during bundling
    ExtendedSafe(String, Box<SourceStepCustomization>)
}

impl SourceStep {
    /// Parse from json. Result can be Error, Simple, Extended
    pub fn from(value: &serde_json::Value) -> Self {
        if let Some(str_value) = data::cast_to_str(value) {
            return SourceStep::Simple(str_value);
        }
        if let Some(obj_value) = value.as_object() {
            if obj_value.len() != 1 {
                return SourceStep::Error(
                    "Customized step must only have 1 key. Did you indent correctly?".to_string(),
                    value.to_string()
                );
            }
            if let Some((k,v)) = obj_value.into_iter().next() {
                // There's only one key
                return SourceStep::Extended(String::from(k), v.clone());
            }
        }
        // error cases
        if value.is_null() {
            return SourceStep::Error(
                "Step is null. Did you forget to type the step after \"-\"?".to_string(),
                value.to_string()
            );
        }
        SourceStep::Error(String::from("Can't recognize"), value.to_string())
    }
    /// Make a copy of self
    pub fn deep_clone(&self) -> Self {
        match self {
            SourceStep::Error(step_string, source) => SourceStep::Error(String::from(step_string), String::from(source)),
            SourceStep::Simple(step_string) => SourceStep::Simple(String::from(step_string)),
            SourceStep::Extended(step_string, customization) => {
                SourceStep::Extended(String::from(step_string), customization.clone())
            },
            SourceStep::ExtendedSafe(step_string, customization) => {
                SourceStep::ExtendedSafe(String::from(step_string), Box::new(customization.deep_clone()))
            }
        }
    }
    /// Write to json
    pub fn to_json(&self) -> serde_json::Value {
        match self {
            SourceStep::Error(step_string, _) => json!(step_string),
            SourceStep::Simple(step_string) => json!(step_string),
            SourceStep::Extended(step_string, customization) => {
                json!({
                    step_string: customization
                })
            },
            SourceStep::ExtendedSafe(step_string, customization) => {
                json!({
                    step_string: customization.to_json()
                })
            }
        }
    }
}
