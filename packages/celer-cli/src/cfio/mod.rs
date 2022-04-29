use std::collections::HashMap;

mod scan;
pub use scan::scan_for_celer_files;

pub fn load_yaml_object(yaml_str: &str) -> Result<serde_json::Value, String> {
    let yaml_result: serde_yaml::Result<serde_json::Value> = serde_yaml::from_str(yaml_str);
    match yaml_result{
        Ok(value) => {
            if value.is_object() {
                return Ok(value);
            }
            Err(String::from("Yaml must be an object"))
        },
        Err(e) => {
            Err(format!("Yaml load error: {}", e))
        }
    }
}

pub fn add_error(path: String, error: String, out_errors: &mut HashMap<String, Vec<String>>) {
    match out_errors.get_mut(&path) {
        Some(vec) => {
            vec.push(error);
        },
        None => {
            let vec = vec![error];
            out_errors.insert(path, vec);
        }
    }
}
