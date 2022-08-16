use std::collections::HashMap;
use std::path::PathBuf;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use celer::core;
use serde_json::json;

pub fn load_unbundled_route(out_errors: &mut HashMap<String, Vec<String>>) -> (serde_json::Value, core::Metadata) {
    let mut paths: Vec<PathBuf> = Vec::new();

    super::scan_for_celer_files(&mut paths, out_errors);

    let mut combined_json = json!({});
    for p in paths {
        let file_content = match std::fs::read_to_string(&p) {
            Ok(v) => v,
            Err(e) => {
                super::add_error(format!("{}", p.display()), format!("Cannot read file: {}", e), out_errors);
                continue
            }
        };
        let file_json: serde_json::Value = match super::load_yaml_object(&file_content) {
            Ok(file_json) => file_json,
            Err(e) => {
                super::add_error(format!("{}", p.display()), format!("Error loading object: {}", e), out_errors);
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

    (combined_json, source_metadata)

}

pub fn write_bundle_json(bundle: &core::SourceObject, pretty: bool, out_errors: &mut HashMap<String, Vec<String>>) {
    write_json_file(&bundle.to_json(), "bundle.json", pretty, out_errors);
}

pub fn write_json_file(value: &serde_json::Value, file_name: &str, pretty: bool, out_errors: &mut HashMap<String, Vec<String>>) {
    let json_str = match if pretty {
        serde_json::to_string_pretty(value)
    }else{
        serde_json::to_string(value)
    } {
        Err(why) =>{
            super::add_error(file_name.to_string(), format!("Cannot parse JSON object: {why}"), out_errors);
            return;
        },
        Ok(value) => value
    };

    write_file(json_str, file_name, out_errors);
}

pub fn write_yaml_file(value: &serde_json::Value, file_name: &str, out_errors: &mut HashMap<String, Vec<String>>) {
    let yaml_str = match serde_yaml::to_string(value) {
        Err(why) =>{
            super::add_error(file_name.to_string(), format!("Cannot parse JSON object: {why}"), out_errors);
            return;
        },
        Ok(value) => value
    };
    write_file(yaml_str, file_name, out_errors);
}

pub fn write_file(content: String, file_name: &str, out_errors: &mut HashMap<String, Vec<String>>) {
    let path = Path::new(file_name);

    let mut file = match File::create(&path) {
        Err(why) => {
            super::add_error(file_name.to_string(), format!("Cannot open {file_name} for writing: {why}"), out_errors);
            return;
        },
        Ok(file) => file,
    };

    if let Err(why) = file.write_all(content.as_bytes()) {
        super::add_error(file_name.to_string(), format!("Cannot write to {file_name}: {why}"), out_errors);
    }
}
