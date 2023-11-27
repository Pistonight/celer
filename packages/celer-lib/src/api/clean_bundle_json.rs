use serde_json::json;
use crate::core;

/// Ensure input is a valid JSON representation of SourceObject
/// This is fast because the bundler is not invoked
pub fn clean_bundle_json(input: &mut serde_json::Value) {
    // Clean metadata
    let input_metadata_json = &input["_project"];
    input["_project"] = json!(core::Metadata::from(input_metadata_json));
    // Clean config
    let input_config_json = &input["_config"];
    let mut _ignored_errors = vec![];
    let output_config = core::Config::from(input_config_json, &mut _ignored_errors)
        .unwrap_or_default();
    input["_config"] = output_config.to_json();
    // Clean route
    if !&input["_route"].is_array() {
        input["_route"] = json!([]);
    }
}

// ===TESTS===
#[cfg(test)]
mod tests {
    use crate::core;
    use serde_json::json;
    #[test]
    pub fn should_fill_metadata() {
        let mut input = json!({
            "_project": {}
        });
        super::clean_bundle_json(&mut input);
        assert_eq!(input["_project"], json!(core::Metadata::new()))
    }
    #[test]
    pub fn should_add_metadata() {
        let mut input = json!({});
        super::clean_bundle_json(&mut input);
        assert_eq!(input["_project"], json!(core::Metadata::new()))
    }
    #[test]
    pub fn should_clean_metadata() {
        let mut input = json!({
            "_project": {
                "name": "Test",
                "something_else": "value"
            }
        });
        super::clean_bundle_json(&mut input);
        let mut expected = core::Metadata::new();
        expected.name = String::from("Test");
        assert_eq!(input["_project"], json!(expected))
    }
    #[test]
    pub fn should_fill_config() {
        let mut input = json!({
            "_config": {}
        });
        super::clean_bundle_json(&mut input);
        assert_eq!(input["_config"], json!({}))
    }
    #[test]
    pub fn should_add_config() {
        let mut input = json!({});
        super::clean_bundle_json(&mut input);
        assert_eq!(input["_config"], json!({}))
    }
    #[test]
    pub fn should_clean_config() {
        let mut input = json!({
            "_config": {
                "something_else": "Test",
                "split-format": "invalid",
                "icons": {
                    "test-key": "Test Value"
                }
            }
        });
        super::clean_bundle_json(&mut input);
        assert_eq!(input["_config"], json!({
            "icons": {
                "test-key": "Test Value"
            }
        }))
    }
    #[test]
    pub fn should_clean_route() {
        let mut input = json!({
            "_route": "invalid"
        });
        super::clean_bundle_json(&mut input);
        assert_eq!(input["_route"], json!([]))
    }
    #[test]
    pub fn should_not_touch_route_if_array() {
        let mut input = json!({
            "_route": ["value1", "value2"]
        });
        super::clean_bundle_json(&mut input);
        assert_eq!(input["_route"], json!(["value1", "value2"]))
    }
}
