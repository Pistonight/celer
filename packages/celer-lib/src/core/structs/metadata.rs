use crate::data;

/// Struct that represents the Metadata of celer route
///
/// Metadata is a required part of the source bundle.
/// Any missing or error values will be filled with a default value by the bundler
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Metadata {
    /// Name of the route/category/project
    pub name: String,
    /// Version
    pub version: String,
    /// Authors
    pub authors: Vec<String>,
    /// A url, usually for source code in a repository
    pub url: String,
    /// Description of the route/category/project
    pub description: String
}

impl Metadata {
    /// Create a new metadata struct with default values
    pub fn new() -> Self {
        Metadata {
            name: String::from("Unknown Project"),
            version: String::from("Unknown"),
            authors: Vec::new(),
            url: String::from(""),
            description: String::from("No Description")
        }
    }
    /// Convert json value safely into Metadata, fill error values with default
    pub fn from(value: &serde_json::Value) -> Self {
        let mut meta = Metadata::new();
        if value.is_null() {
            return meta;
        }

        if let Some(value_name) = value.get("name") {
            if let Some(str_value) = data::cast_to_str(value_name) {
                meta.name = str_value;
            }
        }

        if let Some(value_version) = value.get("version") {
            if let Some(str_value) = data::cast_to_str(value_version) {
                meta.version = str_value;
            }
        }

        if let Some(value_authors) = value.get("authors") {
            if let Some(vec_value) = value_authors.as_array() {
                for author_value in vec_value {
                    if let Some(str_value) = data::cast_to_str(author_value){
                        meta.authors.push(str_value);
                    }
                }
            }
        }

        if let Some(value_url) = value.get("url") {
            if let Some(str_value) = data::cast_to_str(value_url) {
                meta.url = str_value;
            }
        }

        if let Some(value_description) = value.get("description") {
            if let Some(str_value) = data::cast_to_str(value_description) {
                meta.description = str_value;
            }
        }

        meta
    }
}

impl Default for Metadata {
    fn default() -> Self {
        Self::new()
    }
}
