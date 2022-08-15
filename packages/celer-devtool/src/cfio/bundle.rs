use std::collections::HashMap;
use std::path::PathBuf;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use celer::core;
use serde_json::json;

pub fn load_unbundled_route() -> (serde_json::Value, core::Metadata, HashMap<String, Vec<String>>) {
    let mut paths: Vec<PathBuf> = Vec::new();
    let mut errors: HashMap<String, Vec<String>> = HashMap::new();

    super::scan_for_celer_files(&mut paths, &mut errors);

    let mut combined_json = json!({});
    for p in paths {
        let file_content = match std::fs::read_to_string(&p) {
            Ok(v) => v,
            Err(e) => {
                super::add_error(format!("{}", p.display()), format!("Cannot read file: {}", e), &mut errors);
                continue
            }
        };
        let file_json: serde_json::Value = match super::load_yaml_object(&file_content) {
            Ok(file_json) => file_json,
            Err(e) => {
                super::add_error(format!("{}", p.display()), format!("Error loading object: {}", e), &mut errors);
                continue
            }
        };
        for (k, v) in file_json.as_object().unwrap() {
            combined_json[k.to_string()] = v.clone();
        }
    }

    let source_metadata = match combined_json.get("_project") {
        Some(metadata_value) => core::Metadata::from(metadata_value),
        None => core::Metadata::new()
    };

    (combined_json, source_metadata, errors)

}

pub fn write_bundle_json(bundle: &core::SourceObject, out_errors: &mut HashMap<String, Vec<String>>) {
    let json_str = serde_json::to_string(&bundle.to_json()).unwrap();
    let path = Path::new("bundle.json");

    let mut file = match File::create(&path) {
        Err(why) => {
            super::add_error("bundle.json".to_string(), format!("Cannot open bundle.json for writing: {why}"), out_errors);
            return;
        },
        Ok(file) => file,
    };

    if let Err(why) = file.write_all(json_str.as_bytes()) {
        super::add_error("bundle.json".to_string(), format!("Cannot write to bundle.json: {why}"), out_errors);
    }
}
