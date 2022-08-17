use std::collections::HashMap;
use celer::api;
use crate::cio;
use crate::cio::ErrorMap;

mod config;
pub use config::{Config, get_subcommand};

/// Entry point for celer build
pub fn run(config: Config) {
    match config.target.as_str() {
        config::T_BUNDLE => bundle(config),
        config::T_MERGE => merge(config),
        _ => panic!("Unknown target {}", config.target)
    }
    ;
}

fn merge(config: Config) {
    let mut errors = HashMap::new();
    let unbundled_route = cio::bundle::load_unbundled_route(&mut errors);
    fail_build_on_error(&errors);
    
    if config.yaml {
        cio::file::write_yaml_file(&unbundled_route, "merged.yaml", &mut errors);
    }else{
        cio::file::write_json_file(&unbundled_route, "merged.json", config.debug, &mut errors);
    }
    fail_build_on_error(&errors);
}

fn bundle(config: Config) {
    let mut errors = HashMap::new();
    let unbundled_route = cio::bundle::load_unbundled_route(&mut errors);
    fail_build_on_error(&errors);

    let source_object = api::bundle(&unbundled_route);
    if config.yaml {
        cio::bundle::write_bundle_yaml(&source_object, &mut errors);
    }else{
        cio::bundle::write_bundle_json(&source_object, config.debug, &mut errors);
    }
    
    fail_build_on_error(&errors);
}

fn fail_build_on_error(errors: &ErrorMap) {
    if !errors.is_empty() {
        println!("{}", cio::get_error_string(&errors));
        println!();
        panic!("BUILD FAILED");
    }
}
