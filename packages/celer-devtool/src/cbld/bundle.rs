use std::path::PathBuf;
use std::time::UNIX_EPOCH;
use std::{fs, time::SystemTime};
use serde_json::json;
use celer::{api, core};
use crate::cio::{self, file, ErrorState};
use crate::ccmd;

/// Context used by cbld and cds for interfacing with the bundle process
pub struct BundleContext {
    /// The config
    config: ccmd::arg::BundleConfig,
    /// The last modified time
    last_modified: SystemTime,
    /// The unbundled json
    unbundle: serde_json::Value,
    /// Flag for whether bundle is valid
    is_bundled: bool,
    /// The bundled object
    bundle: core::SourceObject,
    /// The errors
    errors: ErrorState,
    /// Flag for dirty state (i.e. if update should be sent to clients)
    dirty: bool
}

impl BundleContext {
    /// Create a new BundleContext
    /// BundleContext can be reused across bundle attempts,
    /// the dev server reuses the same context when reloading the route
    pub fn new(project_name: &str, config: ccmd::arg::BundleConfig) -> Self {
        let mut metadata = core::Metadata::new();
        metadata.name = String::from(project_name);
        Self {
            config,
            unbundle: json!(null),
            is_bundled: false,
            bundle: core::SourceObject::new(metadata, vec![]),
            errors: ErrorState::new(),
            dirty: true,
            last_modified: UNIX_EPOCH
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
    /// Loads the route files and bundle them if needed
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
        let mut unbundled_route = match self.load_route_files(self.unbundle.is_null(), &mut new_errors) {
            Some(v) => v,
            None => return // not changed, skip update
        };

        if !new_errors.is_empty(){
            unbundled_route = json!(null)
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
        let mut source_object = api::bundle(&self.unbundle, &mut bundler_errors);

        for error in &bundler_errors {
            self.errors.add("bundle emitted", format!("In {} {}: {}", error.location_type(), error.location_name(), error.message()))
        }

        super::icon::load_local_icons(&mut source_object, &self.config.module_path, &mut self.errors);

        self.is_bundled = true;
        self.bundle = source_object;
    }

    /// Scan for files, add errors to self.errors and return the loaded json
    /// The return value will either be None, incidating the files have not been updated since last load,
    /// or be a mapping, even if some module(s) fail to load
    fn load_route_files(&mut self, force_update: bool, errors: &mut ErrorState) -> Option<serde_json::Value> {
        let mut updated = false;
        let mut paths: Vec<PathBuf> = Vec::new();

        cio::scan_for_celer_files(&self.config.main_module, &self.config.module_path, &mut paths, errors);

        // Check if any file has been updated
        for p in &paths {
            fs::metadata(p).map(|m| {
                m.modified().map(|t| {
                    if t > self.last_modified {
                        updated = true;
                        self.last_modified = t;
                    }
                }).unwrap_or(()); // ignore error
            }).unwrap_or(()); // ignore error;
        }

        if force_update {
            updated = true;
        }

        if !updated {
            return None;
        }

        // Load the files
        let mut combined_json = json!({});
        for p in paths {
            if cio::file::is_celer_module(&p) {
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
        }

        Some(combined_json)
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

    /// Get mutable error
    pub fn get_error_mut(&mut self) -> &mut ErrorState {
        &mut self.errors
    }

    /// Output source.json
    /// Attempts to load the bundle if needed
    pub fn write_source(&mut self) {
        match self.config.format {
            ccmd::arg::Format::Json => self.write_source_json(),
            ccmd::arg::Format::Yaml => self.write_source_yaml(),
            _ => panic!("Output target \"source\" does not support the {:?} format", self.config.format)
        }
    }
    fn write_source_json(&mut self) {
        self.try_load_and_bundle_if_need();
        let pretty = self.config.debug;
        file::write_json_file(&self.unbundle, &self.resolve_output_file_name("source.json"), pretty, &mut self.errors);
    }

    fn write_source_yaml(&mut self) {
        self.try_load_and_bundle_if_need();
        file::write_yaml_file(&self.unbundle, &self.resolve_output_file_name("source.yaml"), &mut self.errors);
    }

    /// Output bundle.json
    /// Attempts to load the bundle if needed
    pub fn write_bundle(&mut self) {
        match self.config.format {
            ccmd::arg::Format::Json => self.write_bundle_json(),
            ccmd::arg::Format::Yaml => self.write_bundle_yaml(),
            ccmd::arg::Format::Gzip => self.write_bundle_gzip(),
        }
    }
    fn write_bundle_json(&mut self) {
        self.try_load_and_bundle_if_need();
        let pretty = self.config.debug;
        file::write_json_file(&self.bundle.to_json(), &self.resolve_output_file_name("bundle.json"), pretty, &mut self.errors);
    }

    fn write_bundle_yaml(&mut self) {
        self.try_load_and_bundle_if_need();
        file::write_yaml_file(&self.bundle.to_json(), &self.resolve_output_file_name("bundle.yaml"), &mut self.errors);
    }

    fn write_bundle_gzip(&mut self) {
        self.try_load_and_bundle_if_need();
        let bytes = match self.bundle.to_compressed_json(){
            Err(_) => {
                self.errors.add("gzip bundle", "Failed to gzip bundle");
                return;
            }
            Ok(x) => x
        };
        file::write_file(&bytes, &self.resolve_output_file_name("bundle.json.gz"), &mut self.errors);
    }

    pub fn resolve_output_file_name(&self, file_name: &str) -> String {
        let output_path = PathBuf::from(self.config.output_path.clone());
        if output_path.is_dir() {
            output_path.join(file_name).to_str().unwrap().to_string()
        } else {
            output_path.to_str().unwrap().to_string()
        }
    }
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
