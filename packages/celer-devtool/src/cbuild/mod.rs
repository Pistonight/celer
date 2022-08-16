use std::collections::HashMap;

use crate::cio;
use celer::api;
mod config;
pub use config::{Config, get_subcommand};

/// Entry point for celer build
pub fn run(config: Config) {
    match config.target.as_str() {
        config::T_BUNDLE => bundle(config),
        _ => panic!("Unknown target {}", config.target)
    }
    ;
}

fn merge(config: Config) {
    let mut errors = HashMap::new();
    let (unbundled_route, _) = cio::load_unbundled_route(&mut errors);
}

fn bundle(config: Config) {
    let mut errors = HashMap::new();
    let (unbundled_route, _) = cio::load_unbundled_route(&mut errors);
    fail_build_on_error(&errors);

    let source_object = api::bundle(&unbundled_route);
    cio::write_bundle_json(&source_object, config.debug, &mut errors);
    fail_build_on_error(&errors);
}

fn fail_build_on_error(errors: &HashMap<String, Vec<String>>) {
    if !errors.is_empty() {
        println!("{}", cio::get_error_string(&errors));
        println!();
        panic!("BUILD FAILED");
    }
}
