use crate::cio::ErrorState;

pub mod bundle;
mod config;
pub use config::{Config, get_subcommand};

/// Entry point for celer build
pub fn run(config: Config) {
    match config.target.as_str() {
        config::T_BUNDLE => bundle(config),
        config::T_MERGE => merge(config),
        _ => panic!("Unknown target {}", config.target)
    }
}

fn merge(config: Config) {
    let mut bundle_context = bundle::BundleContext::new("");
    match config.format {
        config::Format::Json => bundle_context.write_source_json(config.debug),
        config::Format::Yaml => bundle_context.write_source_yaml(),
        _ => panic!("The {} target does not support the {:?} format", config.target, config.format)
    }
    
    fail_build_on_error(&bundle_context.get_error());
}

fn bundle(config: Config) {
    let mut bundle_context = bundle::BundleContext::new("");
    match config.format {
        config::Format::Json => bundle_context.write_bundle_json(config.debug),
        config::Format::Yaml => bundle_context.write_bundle_yaml(),
        config::Format::Binary => bundle_context.write_bundle_bin(),
        // _ => panic!("The {} target does not support the {:?} format", config.target, config.format)
    }
    
    fail_build_on_error(&bundle_context.get_error());
}

fn fail_build_on_error(errors: &ErrorState) {
    if !errors.is_empty() {
        println!("The build has failed because of the following {}", errors.x_error_s());
        println!("{}", errors.report());
        panic!("BUILD FAILED");
    }
}

// fn show_and_continue_on_error(step_name: &str, errors: &mut ErrorState) {
//     if !errors.is_empty() {
//         println!("{}", errors.report());

//         let message_string = format!("{} {} generated, see output above", errors.x_error_s(), errors.was_verb());
//         errors.clear();
//         errors.add(format!("build step: {step_name}"), message_string);
//     }
// }
