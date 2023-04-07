use std::collections::HashMap;
use serde_json::json;
use crate::data;

mod engine;
use engine::EngineConfig;


#[derive(Debug)]
pub struct Config {
    pub split_format: Option<ConfigMap<String>>,
    pub engine: Option<EngineConfig>,
    pub icons: Option<ConfigMap<String>>
}

impl Config {
    pub fn new() -> Self {
        Config {
            split_format: None,
            engine: None,
            icons: None
        }
    }

    pub fn from(value: &serde_json::Value, out_errors: &mut Vec<String>) -> Option<Self> {
        let mut config = Config::new();
        if value.is_null(){
            return Some(config);
        }

        if let Some(value_engine) = value.get("engine"){
            config.engine = Some(EngineConfig::from(value_engine));
        }

        let obj_value_immut = match value.as_object() {
            Some(v) => v,
            None => {
                out_errors.push(format!("Config should be an object, but received: {value}"));
                return None;
            }
        };

        let mut obj_value = obj_value_immut.clone();

        // Query each valid config key
        if let Some(value_split_format) = obj_value.remove("split-format") {
            if value_split_format.is_object() {
                config.split_format = Some(ConfigMap::from(&value_split_format));
            }else{
                out_errors.push("Config \"split-format\" should be a mapping. Check your formatting.".to_string());
            }
        }

        if let Some(value_icons) = obj_value.remove("icons") {
            if value_icons.is_object() {
                config.icons = Some(ConfigMap::from(&value_icons));
            }else{
                out_errors.push("Config \"icons\" should be a mapping. Check your formatting.".to_string());
            }
        }

        for k in obj_value.keys() {
            if k.eq("icon") {
                out_errors.push("Invalid config \"icon\", did you mean \"icons\"?".to_string());
            }else{
                out_errors.push(format!("Invalid config \"{k}\""))
            }
        }

        Some(config)
    }
    pub fn to_json(&self) -> serde_json::Value {
        let mut obj = json!({});
        if let Some(split_format) = &self.split_format {
            obj["split-format"] = split_format.to_json();
        }
        if let Some(engine) = &self.engine {
            obj["engine"] = engine.to_json();
        }
        if let Some(icons) = &self.icons {
            obj["icons"] = icons.to_json();
        }
        obj
    }
}

impl Default for Config {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(Debug, PartialEq)]
pub struct ConfigMap<T> {
    underlying_map: HashMap<String, T>,
}

impl ConfigMap<String> {
    pub fn from(value: &serde_json::Value) -> Self {
        let mut map = HashMap::new();
        if let Some(map_value) = value.as_object() {
            for (key, value) in map_value {
                if let Some(str_value) = data::cast_to_str(value) {
                    map.insert(String::from(key), str_value);
                }
            }
        }

        ConfigMap {
            underlying_map: map
        }
    }

    pub fn to_json(&self) -> serde_json::Value {
        let mut obj = json!({});
        for (k,v) in &self.underlying_map {
            obj[k] = json!(v);
        }
        obj
    }

    pub fn underlying(&self) -> &HashMap<String, String> {
        &self.underlying_map
    }

    pub fn underlying_mut(&mut self) -> &mut HashMap<String, String> {
        &mut self.underlying_map
    }

}

// ===TESTS===
#[cfg(test)]
mod tests {
    mod test_config_from_json {
        use super::super::{Config, ConfigMap};
        use serde_json::json;
        #[test]
        fn error_if_not_obj() {
            let mut out_errors = vec![];
            let config = Config::from(&json!("object"), &mut out_errors);
            assert!(config.is_none());
            assert_eq!(out_errors.len(), 1);
        }
        #[test]
        fn ok_if_null() {
            let mut out_errors = vec![];
            let config = Config::from(&json!(null), &mut out_errors).unwrap();
            assert!(config.split_format.is_none());
            assert!(config.icons.is_none());
            assert_eq!(out_errors.len(), 0);
        }
        #[test]
        fn ok_if_empty_obj() {
            let mut out_errors = vec![];
            let config = Config::from(&json!({}), &mut out_errors).unwrap();
            assert!(config.split_format.is_none());
            assert!(config.icons.is_none());
            assert_eq!(out_errors.len(), 0);
        }
        #[test]
        fn warn_if_invalid_key() {
            let mut out_errors = vec![];
            let config = Config::from(&json!({"invalid": "123"}), &mut out_errors).unwrap();
            assert!(config.split_format.is_none());
            assert!(config.icons.is_none());
            assert_eq!(out_errors.len(), 1);
        }
        #[test]
        fn warn_if_multiple_invalid_keys() {
            let mut out_errors = vec![];
            let config = Config::from(&json!({"invalid": "123", "invalid2": "234"}), &mut out_errors).unwrap();
            assert!(config.split_format.is_none());
            assert!(config.icons.is_none());
            assert_eq!(out_errors.len(), 2);
        }
        #[test]
        fn warn_if_invalid_split_formst() {
            let mut out_errors = vec![];
            let config = Config::from(&json!({
                "split-format": "invalid"
            }), &mut out_errors).unwrap();
            assert!(config.split_format.is_none());
            assert!(config.icons.is_none());
            assert_eq!(out_errors.len(), 1);
        }
        #[test]
        fn parses_split_formst() {
            let mut out_errors = vec![];
            let config = Config::from(&json!({
                "split-format": {
                    "test1": "value1",
                    "test2": "value2"
                }
            }), &mut out_errors).unwrap();
            assert_eq!(config.split_format.unwrap(), ConfigMap::from(&json!({
                "test1": "value1",
                "test2": "value2"
            })));
            assert!(config.icons.is_none());
            assert_eq!(out_errors.len(), 0);
        }
        #[test]
        fn warn_if_invalid_icon() {
            let mut out_errors = vec![];
            let config = Config::from(&json!({
                "icons": "invalid"
            }), &mut out_errors).unwrap();
            assert!(config.split_format.is_none());
            assert!(config.icons.is_none());
            assert_eq!(out_errors.len(), 1);
        }
        #[test]
        fn parses_icons() {
            let mut out_errors = vec![];
            let config = Config::from(&json!({
                "icons": {
                    "test1": "value1",
                    "test2": "value2"
                }
            }), &mut out_errors).unwrap();
            assert_eq!(config.icons.unwrap(), ConfigMap::from(&json!({
                "test1": "value1",
                "test2": "value2"
            })));
            assert_eq!(out_errors.len(), 0);
        }
    }

}
