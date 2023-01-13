use std::collections::HashMap;
use serde_json::json;
use crate::data;

mod engine;
use engine::EngineConfig;


#[derive(Debug)]
pub struct Config {
    pub split_format: Option<ConfigMap<String>>,
    pub engine: Option<EngineConfig>
}

impl Config {
    pub fn new() -> Self {
        Config {
            split_format: None,
            engine: None,
        }
    }
    pub fn from(value: &serde_json::Value) -> Self {
        let mut config = Config::new();
        if !value.is_object() {
            return config;
        }

        if let Some(value_split_format) = value.get("split-format"){
            config.split_format = Some(ConfigMap::<String>::from(value_split_format));
        }

        if let Some(value_engine) = value.get("engine"){
            config.engine = Some(EngineConfig::from(value_engine));
        }

        config
    }
    pub fn to_json(&self) -> serde_json::Value {
        let mut obj = json!({});
        if let Some(split_format) = &self.split_format {
            obj["split-format"] = split_format.to_json();
        }
        if let Some(engine) = &self.engine {
            obj["engine"] = engine.to_json();
        }
        obj
    }
}

impl Default for Config {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(Debug)]
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
}
