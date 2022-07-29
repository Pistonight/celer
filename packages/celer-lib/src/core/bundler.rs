use std::collections::HashMap;
use super::structs::{SourceStep, SourceStepCustomization, SourceModule, SourceSection};

pub struct Bundler {
    module_sources: HashMap<String, serde_json::Value>,
    module_cache: HashMap<String, SourceModule>,
    errors: Vec<BundlerException>,
}

pub struct BundlerException {
    pub module: String,
    pub message: String
}

impl Bundler {
    pub fn bundle(route: &Vec<SourceSection>, modules: HashMap<String, serde_json::Value>) -> Result<Vec<SourceSection>, String> {
        let bundler = Bundler {
            module_sources: modules,
            module_cache: HashMap::new(),
            errors: Vec::new()
        };
        // TODO check circular dependency
        bundler.bundle_route(route)
    }
    fn bundle_route(&self, route: &Vec<SourceSection>) -> Vec<SourceSection> {
        route.iter().map(|x|self.bundle_section(&x)).collect()
    }

    fn make_attached_error(&self, module: &String, message: &str) -> String {
        self.make_exception(module, message, "(^!) Bundler Error")
    }

    // fn make_unattached_error(&self, module: &String, message: &str) -> String {
    //     self.make_exception(module, message, "(^=) Bundler Error")
    // }
    fn make_exception(&self, module: &String, message: &str, head: &str) -> String {
        let message_string = format!("{}: {}", head, message);
        self.errors.push(BundlerException {
            module: String::from(module),
            message: message_string
        });
        return message_string;
    }

    fn bundle_section(&self, section: &SourceSection) -> SourceSection {
        match section {
            SourceSection::Named(name, unbundled_module) => {
                let bundled = self.bundle_unnamed_module(unbundled_module, name);
                SourceSection::Named(String::from(name), bundled)
            },
            SourceSection::Unnamed(unbundled_module) => {
                let bundled = self.bundle_unnamed_module(unbundled_module, &String::from("main"));
                SourceSection::Unnamed(bundled)
            }
        }
    }
    
    fn bundle_module(&self, name: &String, unbundled_module: &SourceModule) -> &SourceModule {
        // Check if the module name is already cached
        if let Some(cached_module) = self.module_cache.get(name) {
            return cached_module;
        }

        let bundled_module = self.bundle_unnamed_module(unbundled_module, name);
        self.module_cache.insert(String::from(name), bundled_module);
        
        return &bundled_module
    }

    /// Bundle a module
    /// 
    /// Each step in the module is bundled and merged
    fn bundle_unnamed_module(&self, unbundled_module: &SourceModule, parent_name: &String) -> SourceModule {
        let mut bundled_steps = Vec::new();
        match unbundled_module {
            SourceModule::SingleStep(step) => {
                self.bundle_step(step, &mut bundled_steps, parent_name);
            },
            SourceModule::MultiStep(steps) => {
                for s in steps {
                    self.bundle_step(s, &mut bundled_steps, parent_name);
                }
            }
        }
        if bundled_steps.len() > 1 {
            SourceModule::MultiStep(bundled_steps)
        } else {
            SourceModule::SingleStep(bundled_steps[0])
        }
    }

    /// Bundle a step
    /// 
    /// If the step is single-line, the single line will be added to out_arr
    /// 
    /// If the step is a __use__, copies of the lines in the module will be added.
    /// If the module cannot be found, an error message is added.
    /// 
    /// If the step is extended, it is processed accordingly and error messages might be added.
    /// The original step will only be added if no error is generated
    fn bundle_step(&self, step: &SourceStep, out_arr: &Vec<SourceStep>, parent_name: &String) {
        match step {
            SourceStep::Error(message, source) => {
                out_arr.push(SourceStep::Simple(String::from(source)));
                let error = self.make_attached_error(parent_name, &message);
                out_arr.push(SourceStep::Simple(error))
            },
            SourceStep::Simple(step_string) => {
                if let Some(module_name) = Bundler::try_get_use_name_from_step(&step_string) {
                    if let Some(source) = self.module_sources.get(&module_name) {
                        match self.bundle_module(&module_name, &SourceModule::from(source)) {
                            SourceModule::SingleStep(module_step) => {
                                out_arr.push(module_step.deep_clone());
                            },
                            SourceModule::MultiStep(steps) => {
                                for s in steps{
                                    out_arr.push(s.deep_clone());
                                }
                            }
                        }
                    }else{
                        let error = self.make_attached_error(parent_name, &format!("Cannot find module: {}", &module_name));
                        out_arr.push(SourceStep::Simple(error));
                    }
                }else{
                    out_arr.push(step.deep_clone());
                }
                
            },
            SourceStep::Extended(step_string, customization) => {
                let mut errors = Vec::new();
                if let Some(valid_customization) = SourceStepCustomization::from(customization, &mut errors) {
                    out_arr.push(SourceStep::ExtendedSafe(String::from(step_string), valid_customization));
                }
                for e in errors {
                    out_arr.push(e);
                }
            },
            SourceStep::ExtendedSafe(_,_)=>{
                panic!("Unexpected error: unbundled module cannot have ExtendedSafe");
            }
        }
    }

    /// Get the module name from __use__ steps.
    /// 
    /// Returns None if the step does not start with __use__
    fn try_get_use_name_from_step(step: &String) -> Option<String> {
        if let Some(module_name) = step.strip_prefix("__use__") {
            return Some(String::from(module_name.trim()));
        }

        return None;
    }
}