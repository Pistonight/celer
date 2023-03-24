use crate::cio::ErrorState;

mod config;
mod icon;

pub mod bundle;
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
    let mut bundle_context = bundle::BundleContext::new("", &config.main_module, &config.module_path);
    match config.format {
        config::Format::Json => bundle_context.write_source_json(config.debug),
        config::Format::Yaml => bundle_context.write_source_yaml(),
        _ => panic!("The {} target does not support the {:?} format", config.target, config.format)
    }

    fail_build_on_error(bundle_context.get_error());
}

fn bundle(config: Config) {
    let mut bundle_context = bundle::BundleContext::new("", &config.main_module, &config.module_path);
    match config.format {
        config::Format::Json => bundle_context.write_bundle_json(config.debug),
        config::Format::Yaml => bundle_context.write_bundle_yaml(),
        config::Format::Gzip => bundle_context.write_bundle_gzip(),
    }

    fail_build_on_error(bundle_context.get_error());
}

fn fail_build_on_error(errors: &ErrorState) {
    if !errors.is_empty() {
        println!("The build has failed because of the following {}", errors.x_error_s());
        println!("{}", errors.report());
        panic!("BUILD FAILED");
    }
}
