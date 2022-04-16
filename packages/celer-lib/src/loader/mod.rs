extern crate yaml_rust;
use yaml_rust::{YamlLoader, YamlEmitter};

pub fn load_yaml(s: String) -> Result<crate::core::SourceObject, Error> {
    match YamlLoader::load_from_str(s) {
        Ok(docs) => Ok(convert_yaml_to_source(docs[0])),
        Err(error) => Err(error)
    }
}

fn convert_yaml_to_source(doc: yaml::Yaml) -> crate::core::SourceObject {
}
