use std::path::PathBuf;
use serde_json::json;
use celer::{api, core};
use crate::cio::{self, file, ErrorState};

/// Context used by cbld and cds for interfacing with the bundle process
pub struct BundleContext {
    /// The unbundled json
    unbundle: serde_json::Value,
    /// Flag for whether bundle is valid
    is_bundled: bool,
    /// The bundled object
    bundle: core::SourceObject,
    /// The errors
    errors: ErrorState,
    /// Flag for dirty state (i.e. changed)
    dirty: bool
}

impl BundleContext {
    /// Create a new BundleContext
    /// BundleContext can be reused across bundle attempts,
    /// the dev server reuses the same context when reloading the route
    pub fn new(project_name: &str) -> Self {
        let mut metadata = core::Metadata::new();
        metadata.name = String::from(project_name);
        Self {
            unbundle: json!(null),
            is_bundled: false,
            bundle: core::SourceObject::new(metadata, vec![]),
            errors: ErrorState::new(),
            dirty: true,
        }
    }

    /// Get project name
    /// This does not trigger a load/reload or rebundle
    /// If called before route is first loaded, it will be the default value
    pub fn get_project_name(&self) -> &str {
        &self.bundle.metadata.name
    }

    /// Return if the unbundled route files are loaded without errors
    pub fn is_loaded(&self) -> bool {
        !self.unbundle.is_null()
    }

    /// Return if the unbundled route files are bundled without errors
    pub fn is_bundled(&self) -> bool {
        self.is_bundled
    }

    pub fn clear_dirty(&mut self) {
        self.dirty = false
    }

    /// Get unbundled route.
    /// Loads the route files if they are not loaded. However, the bundler is not invoked
    /// Also does not reload the route files if they are changed
    /// Returns null if it fails to load the route files, and it will reattempt the load on the next call
    /// The second return value is the dirty flag (i.e. bundle has changed since the last clear_dirty() call)
    pub fn get_bundle(&mut self) -> (&serde_json::Value, &core::SourceObject, bool) {
        self.try_load_and_bundle_if_need();
        (&self.unbundle, &self.bundle, self.dirty)
    }

    /// Clear the loaded and bundled objects, which will trigger a fresh load on the next get_bundled_json() call
    /// Project name is not cleared
    pub fn reset(&mut self) {
        self.is_bundled = false;
    }

    fn try_load_and_bundle_if_need(&mut self) {
        if !self.is_loaded() || !self.is_bundled(){
            self.try_load_and_bundle();
        }
    }

    /// Reload the route, and bundle if it has changed
    /// If error(s) occur when loading the route files, the bundle step will be skipped
    /// However, the metadata will still be attempted to load
    fn try_load_and_bundle(&mut self) {
        let mut new_errors = ErrorState::new();
        let mut unbundled_route = load_route_files(&mut new_errors);

        if !new_errors.is_empty(){
            unbundled_route = json!(null)
        }

        if self.unbundle == unbundled_route{
            // not changed, skip update
            return;
        }

        self.unbundle = unbundled_route;
        self.errors = new_errors;
        self.dirty = true;
        self.is_bundled = false;

        if !self.errors.is_empty(){
            // Skip bundle if error, but still try to get the metadata
            if let Some(metadata_value) = &self.unbundle.get("_project") {
                self.bundle.metadata = core::Metadata::from(metadata_value);
            }
            return;
        }

        let mut bundler_errors = vec![];
        let source_object = api::bundle(&self.unbundle, &mut bundler_errors);
        add_bundle_errors(&bundler_errors, &mut self.errors);
        self.is_bundled = true;
        self.bundle = source_object;
    }

    /// Get error string or specified no error string
    pub fn get_error_str_or(&self, default: &str) -> String {
        if self.errors.is_empty() {
            String::from(default)
        }else{
            self.errors.report()
        }
    }

    /// Get error
    pub fn get_error(&self) -> &ErrorState {
        &self.errors
    }

    /// Output source.json
    /// /// Attempts to load the bundle if needed
    pub fn write_source_json(&mut self, pretty: bool) {
        self.try_load_and_bundle_if_need();
        file::write_json_file(&self.unbundle, "source.json", pretty, &mut self.errors);
    }

    pub fn write_source_yaml(&mut self) {
        self.try_load_and_bundle_if_need();
        file::write_yaml_file(&self.unbundle, "source.yaml", &mut self.errors);
    }

    /// Output bundle.json
    /// Attempts to load the bundle if needed
    pub fn write_bundle_json(&mut self, pretty: bool) {
        self.try_load_and_bundle_if_need();
        file::write_json_file(&self.bundle.to_json(), "bundle.json", pretty, &mut self.errors);
    }

    pub fn write_bundle_yaml(&mut self) {
        self.try_load_and_bundle_if_need();
        file::write_yaml_file(&self.bundle.to_json(), "bundle.yaml", &mut self.errors);
    }

    pub fn write_bundle_gzip(&mut self) {
        self.try_load_and_bundle_if_need();
        let bytes = match self.bundle.to_compressed_json(){
            Err(_) => {
                self.errors.add("bundle.json.gz", "Failed to gzip bundle");
                return;
            }
            Ok(x) => x
        };
        file::write_file(&bytes, "bundle.json.gz", &mut self.errors);
    }
}

/// Load route files, add errors to self.errors and return the loaded json
/// The return value will always be a mapping, even if some module(s) fail to load
fn load_route_files(errors: &mut ErrorState) -> serde_json::Value {

    let mut paths: Vec<PathBuf> = Vec::new();

    cio::scan_for_celer_files(&mut paths, errors);

    let mut combined_json = json!({});
    for p in paths {
        let file_content = match std::fs::read_to_string(&p) {
            Ok(v) => v,
            Err(e) => {
                errors.add(format!("{}", p.display()), format!("Cannot read file: {}", e));
                continue
            }
        };
        let file_json: serde_json::Value = match load_yaml_object(&file_content) {
            Ok(file_json) => file_json,
            Err(e) => {
                errors.add(format!("{}", p.display()), format!("Error loading object: {}", e));
                continue
            }
        };
        for (k, v) in file_json.as_object().unwrap() {
            combined_json[k.to_string()] = v.clone();
        }
    }

    combined_json
}

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

fn add_bundle_errors(bundle_errors: &[core::BundlerError], out_errors: &mut ErrorState) {
    for error in bundle_errors {
        out_errors.add("bundle emitted", format!("In {} {}: {}", error.location_type(), error.location_name(), error.message()))
    }
}
