use serde_json::json;
use crate::data;

/// Engine configuration
#[derive(Debug)]
pub struct EngineConfig {
    /// Errors to ignore
    ignore: Vec<String>,
    /// Errors to warn
    warn: Vec<String>,
    /// Errors to error
    error: Vec<String>
}

impl EngineConfig {
    pub fn from(value: &serde_json::Value) -> Self {
        Self {
            ignore: match value.get("ignore") {
                Some(arr) => data::to_str_vec(arr),
                None => vec![]
            },
            warn: match value.get("warn") {
                Some(arr) => data::to_str_vec(arr),
                None => vec![]
            },
            error: match value.get("error") {
                Some(arr) => data::to_str_vec(arr),
                None => vec![]
            }
        }
    }

    pub fn to_json(&self) -> serde_json::Value {
        let mut obj = json!({});
        if !self.ignore.is_empty() {
            obj["ignore"] = json!(self.ignore);
        }
        if !self.warn.is_empty() {
            obj["warn"] = json!(self.warn);
        }
        if !self.error.is_empty() {
            obj["error"] = json!(self.error);
        }
        obj
    }
}
