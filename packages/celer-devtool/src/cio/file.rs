use std::fs::File;
use std::io::Write;
use std::path::{Path, PathBuf};
use super::ErrorState;

pub fn write_json_file(value: &serde_json::Value, file_name: &str, pretty: bool, out_errors: &mut ErrorState) {
    let json_str = match if pretty {
        serde_json::to_string_pretty(value)
    }else{
        serde_json::to_string(value)
    } {
        Err(why) =>{
            out_errors.add(file_name, format!("Cannot parse JSON object: {why}"));
            return;
        },
        Ok(value) => value
    };

    write_string_file(json_str, file_name, out_errors);
}

pub fn write_yaml_file(value: &serde_json::Value, file_name: &str, out_errors: &mut ErrorState) {
    let yaml_str = match serde_yaml::to_string(value) {
        Err(why) =>{
            out_errors.add(file_name, format!("Cannot parse JSON object: {why}"));
            return;
        },
        Ok(value) => value
    };
    write_string_file(yaml_str, file_name, out_errors);
}

pub fn write_string_file(content: String, file_name: &str, out_errors: &mut ErrorState) {
    write_file(content.as_bytes(), file_name, out_errors)
}

pub fn write_file(content: &[u8], file_name: &str, out_errors: &mut ErrorState) {
    let path = Path::new(file_name);

    let mut file = match File::create(path) {
        Err(why) => {
            out_errors.add(file_name, format!("Cannot open {file_name} for writing: {why}"));
            return;
        },
        Ok(file) => file,
    };

    if let Err(why) = file.write_all(content) {
        out_errors.add(file_name, format!("Cannot write to {file_name}: {why}"));
    }
}

pub fn is_celer_module(file_name: &PathBuf) -> bool {
    let file_name = file_name.file_name().and_then(|x| x.to_str()).unwrap_or("");
    file_name.ends_with(".celer") || file_name.ends_with(".yaml")
}

pub fn is_related_module(file_name: &PathBuf) -> bool {
    let file_name = file_name.file_name().and_then(|x| x.to_str()).unwrap_or("");
    file_name.ends_with(".celer") || file_name.ends_with(".yaml") || file_name.ends_with(".png")
}