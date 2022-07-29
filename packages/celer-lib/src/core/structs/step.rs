use std::collections::HashMap;
use crate::data;

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
    ExtendedSafe(String, SourceStepCustomization)
}

impl SourceStep {
    /// Parse from json. Result can be Error, Simple, Extended
    pub fn from(value: &serde_json::Value) -> Self {
        if let Some(str_value) = data::cast_to_str(value) {
            return SourceStep::Simple(String::from(str_value));
        }
        if let Some(obj_value) = value.as_object() {
            if obj_value.len() != 1 {
                return SourceStep::Error(
                    format!("Customized step must only have 1 key. Did you indent correctly?"),
                    value.to_string()
                );
            }
            for (k,v) in obj_value {
                // There's only one key
                return SourceStep::Extended(String::from(k), v.clone());
            }
        }
        // error cases
        if value.is_null() {
            return SourceStep::Error(
                format!("Step is null. Did you forget to type the step after \"-\"?"),
                value.to_string()
            );
        }
        return SourceStep::Error(String::from("Can't recognize"), value.to_string());
    }
    /// Make a copy of self
    pub fn deep_clone(&self) -> Self {
        match self {
            SourceStep::Error(step_string, source) => SourceStep::Error(String::from(step_string), String::from(source)),
            SourceStep::Simple(step_string) => SourceStep::Simple(String::from(step_string)),
            SourceStep::Extended(step_string, customization) => {
                panic!("Not Implemented")
            },
            SourceStep::ExtendedSafe(step_string, customization) => {
                panic!("Not Implemented")
            }
        }
    }
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

impl SourceStepCustomization {
    pub fn from(value: &serde_json::Value, out_errors: &mut Vec<SourceStep>) -> Option<Self> {
        panic!("Not Implemented")
    }
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