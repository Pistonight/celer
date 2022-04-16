use std::collections::HashMap;
use std::path;
use std::fs;
use celer::core;

pub struct SourceLoader {
    source_object: core::SourceObject,
    modules: HashMap<String, core::SourceModule>,
    //yaml_loader: YamlLoader,
}

impl SourceLoader {
    pub fn new() -> SourceLoader {
        SourceLoader {
            source_object: core::SourceObject::new(),
            modules: HashMap::new()
        }
    }
    pub fn load_file(&mut self, path: &path::PathBuf) {
        let content = fs::read_to_string(path);
        // match yaml_loader.load(content, self.modules) {
            
        // }

    }

    // pub fn bundle(&self) -> core::SourceObject {
        
    // }


}
