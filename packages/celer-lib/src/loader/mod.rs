extern crate yaml_rust;
use yaml_rust::{YamlLoader, YamlEmitter};

pub fn load_yaml(s: String) -> Option<crate::core::SourceObject> {
    match YamlLoader::load_from_str(s) {
        Ok(docs) => Some(convert_yaml_to_source(docs[0])),
        Err(error) => {
            println!("{:?}", error);
            None
        }
    }
}

fn convert_yaml_to_source(doc: yaml::Yaml) -> crate::core::SourceObject {
}
