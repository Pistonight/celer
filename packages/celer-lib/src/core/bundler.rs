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
    pub fn bundle(route: &[SourceSection], modules: HashMap<String, serde_json::Value>) -> Result<Vec<SourceSection>, String> {
        let mut bundler = Bundler {
            module_sources: modules,
            module_cache: HashMap::new(),
            errors: Vec::new()
        };
        bundler.bundle_route(route)
    }

    fn make_attached_error(&mut self, module: &String, message: &str) -> String {
        self.make_exception(module, message, "(^!) Bundler Error")
    }

    fn make_attached_warning(&mut self, module: &String, message: &str) -> String {
        self.make_exception(module, message, "(^?) Bundler Warning")
    }

    // fn make_unattached_error(&self, module: &String, message: &str) -> String {
    //     self.make_exception(module, message, "(^=) Bundler Error")
    // }
    fn make_exception(&mut self, module: &String, message: &str, head: &str) -> String {
        let message_string = format!("{}: {}", head, message);
        self.errors.push(BundlerException {
            module: String::from(module),
            message: message_string.clone()
        });
        message_string
    }

    fn bundle_route(&mut self, route: &[SourceSection]) -> Result<Vec<SourceSection>, String> {
        route.iter().map(|x|self.bundle_section(x)).collect()
    }

    fn bundle_section(&mut self, section: &SourceSection) -> Result<SourceSection, String> {
        match section {
            SourceSection::Named(name, unbundled_module) => {
                let mut dfs = vec![String::from("_route"), format!("_section_{}", name)];
                let result = self.bundle_unnamed_module(unbundled_module, &mut dfs);
                match result {
                    Ok(bundled) => Ok(SourceSection::Named(String::from(name), bundled)),
                    Err(message) => Err(message)
                }
            },
            SourceSection::Unnamed(unbundled_module) => {
                let mut dfs = vec![String::from("_route")];
                let result = self.bundle_unnamed_module(unbundled_module, &mut dfs);
                match result {
                    Ok(bundled) => Ok(SourceSection::Unnamed(bundled)),
                    Err(message) => Err(message)
                }
            }
        }
    }
    
    fn bundle_module(&mut self, name: &String, unbundled_module: &SourceModule, dfs_parents: &mut Vec<String>) -> 
        Result<SourceModule, String> {
            // Check if module name is already cached
            if let Some(cached_module) = self.module_cache.get_mut(name) {
                return Ok(cached_module.deep_clone());
            }


        // Before bundling, check if module is already being bundled (circular dependency)
        for parent in dfs_parents.iter() {
            if name.eq(parent) {
                return Err(format!("Circular Dependency Found: Trace: {:?} -> {}", dfs_parents, name))
            }
        }
        dfs_parents.push(String::from(name));

        let result = self.bundle_unnamed_module(unbundled_module, dfs_parents);
        dfs_parents.pop();
        match result {
            Err(message) => Err(message),
            Ok(bundled_module) => {
                let clone = bundled_module.deep_clone();
               // let mut module_cache_mut: &'s mut HashMap<String, SourceModule> = &mut ;
               self.module_cache.insert(String::from(name), bundled_module);
                // If bundling is successful
                Ok(clone)
            }
        }
        
    }

    /// Bundle a module
    /// 
    /// Each step in the module is bundled and merged
    fn bundle_unnamed_module(&mut self, unbundled_module: &SourceModule, dfs_parents: &mut Vec<String>) -> Result<SourceModule, String> {
        let mut bundled_steps = Vec::new();
        match unbundled_module {
            SourceModule::SingleStep(step) => {
                let result = self.bundle_step(step, &mut bundled_steps, dfs_parents);
                if let Err(message) = result {
                    return Err(message);
                }
            },
            SourceModule::MultiStep(steps) => {
                for s in steps {
                    let result = self.bundle_step(s, &mut bundled_steps, dfs_parents);
                    if let Err(message) = result {
                        return Err(message);
                    }
                }
            }
        }

        Ok(
            if bundled_steps.len() > 1 {
                SourceModule::MultiStep(bundled_steps)
            } else {
                SourceModule::SingleStep(bundled_steps.remove(0))
            }
        )
        
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
    fn bundle_step(&mut self, step: &SourceStep, out_arr: &mut Vec<SourceStep>, dfs_parents: &mut Vec<String>) -> Result<(), String> {
        let parent_name = dfs_parents.get(dfs_parents.len()-1).unwrap();

        match step {
            SourceStep::Error(message, source) => {
                out_arr.push(SourceStep::Simple(String::from(source)));
                let error = self.make_attached_error(parent_name, message);
                out_arr.push(SourceStep::Simple(error));
                Ok(())
            },
            SourceStep::Simple(step_string) => {
                if let Some(module_name) = try_get_use_name_from_step(step_string) {
                    if let Some(source) = self.module_sources.get(&module_name) {
                        let unbundled_module = SourceModule::from(source);
                        return match self.bundle_module(&module_name, &unbundled_module, dfs_parents) {
                            Ok(bundled_module) => {
                                match bundled_module{
                                    SourceModule::SingleStep(module_step) => {
                                        out_arr.push(module_step);
                                    },
                                    SourceModule::MultiStep(steps) => {
                                        for s in steps{
                                            out_arr.push(s);
                                        }
                                    }
                                }
                                Ok(())
                            },
                            Err(message) => Err(message)
                        }
                    }else{
                        let error = self.make_attached_error(parent_name, &format!("Cannot find module: {}", &module_name));
                        out_arr.push(SourceStep::Simple(error));
                    }
                }else{
                    out_arr.push(step.deep_clone());
                }
                Ok(())
            },
            SourceStep::Extended(step_string, customization) => {
                let mut errors = Vec::new();
                if let Some(valid_customization) = SourceStepCustomization::from(customization, &mut errors) {
                    out_arr.push(SourceStep::ExtendedSafe(String::from(step_string), valid_customization));
                    for e in errors {
                        let error = self.make_attached_warning(parent_name, &e);
                        out_arr.push(SourceStep::Simple(error));
                    }
                }else{
                    out_arr.push(SourceStep::Simple(String::from(step_string)));
                    for e in errors {
                        let error = self.make_attached_error(parent_name, &e);
                        out_arr.push(SourceStep::Simple(error));
                    }
                }
                
                Ok(())
            },
            SourceStep::ExtendedSafe(_,_)=>{
                panic!("Unexpected error: unbundled module cannot have ExtendedSafe");
            }
        }
    }

    
}

/// Get the module name from __use__ steps.
/// 
/// Returns None if the step does not start with __use__
fn try_get_use_name_from_step(step: &str) -> Option<String> {
    if let Some(module_name) = step.strip_prefix("__use__") {
        return Some(String::from(module_name.trim()));
    }

    None
}
