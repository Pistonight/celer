
mod scan;
pub use scan::scan_for_celer_files;
mod bundle;
pub use bundle::{load_unbundled_route, write_bundle_json};
mod error;
pub use error::{add_error, get_error_string};

fn load_yaml_object(yaml_str: &str) -> Result<serde_json::Value, String> {
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




