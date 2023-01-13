use celer::api;
use crate::cio;
use crate::cio::ErrorState;

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
    let mut errors = ErrorState::new();
    let unbundled_route = cio::bundle::load_unbundled_route(&mut errors);
    fail_build_on_error(&errors);

    if config.yaml {
        cio::file::write_yaml_file(&unbundled_route, "source.yaml", &mut errors);
    }else{
        cio::file::write_json_file(&unbundled_route, "source.json", config.debug, &mut errors);
    }
    fail_build_on_error(&errors);
}

fn bundle(config: Config) {
    let mut errors = ErrorState::new();
    let unbundled_route = cio::bundle::load_unbundled_route(&mut errors);
    fail_build_on_error(&errors);

    let mut bundler_errors = Vec::new();
    let source_object = api::bundle(&unbundled_route, &mut bundler_errors);
    cio::bundle::add_bundle_errors(&bundler_errors, &mut errors);
    show_and_continue_on_error("bundle", &mut errors);

    if config.yaml {
        cio::bundle::write_bundle_yaml(&source_object, &mut errors);
    }else{
        cio::bundle::write_bundle_json(&source_object, config.debug, &mut errors);
    }

    fail_build_on_error(&errors);
}

fn fail_build_on_error(errors: &ErrorState) {
    if !errors.is_empty() {
        println!("The build has failed because of the following {}", errors.x_error_s());
        println!("{}", errors.report());
        panic!("BUILD FAILED");
    }
}

fn show_and_continue_on_error(step_name: &str, errors: &mut ErrorState) {
    if !errors.is_empty() {
        println!("{}", errors.report());

        let message_string = format!("{} {} generated, see output above", errors.x_error_s(), errors.was_verb());
        errors.clear();
        errors.add(format!("build step: {step_name}"), message_string);
    }
}
