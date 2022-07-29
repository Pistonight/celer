use crate::data;

use std::collections::HashMap;
#[derive(Debug)]
pub struct Config {
    pub split_format: Option<ConfigMap<String>>
}

impl Config {
    pub fn new() -> Self {
        Config {
            split_format: None
        }
    }
    pub fn from(value: &serde_json::Value) -> Self {
        let mut config = Config::new();
        if value.is_null() {
            return config;
        }

        if let Some(value_split_format) = value.get("split-format"){
            config.split_format = Some(ConfigMap::from(value_split_format));
        }

        return config;
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
                    map.insert(String::from(key), String::from(str_value));
                }
            }
        }

        ConfigMap {
            underlying_map: map
        }
    }
}