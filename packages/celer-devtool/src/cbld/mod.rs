use crate::cio::ErrorState;
use crate::ccmd;

mod icon;

pub mod bundle;

// Build Targets
pub const T_BUNDLE: &str = "bundle";
pub const T_MERGE: &str = "merge";
pub const BUILD_TARGETS: [&str; 2] = [T_BUNDLE, T_MERGE];

/// Entry point for celer build
pub fn run(config: ccmd::arg::BundleConfig) {
    match config.target.as_str() {
        T_BUNDLE => bundle(config),
        T_MERGE => merge(config),
        _ => panic!("Unknown target {}", config.target)
    }
}

fn merge(config: ccmd::arg::BundleConfig) {
    let mut bundle_context = bundle::BundleContext::new("", config);
    bundle_context.write_source();

    fail_build_on_error(bundle_context.get_error());
}

fn bundle(config: ccmd::arg::BundleConfig) {
    let mut bundle_context = bundle::BundleContext::new("", config);
    bundle_context.write_bundle();

    fail_build_on_error(bundle_context.get_error());
}

fn fail_build_on_error(errors: &ErrorState) {
    if !errors.is_empty() {
        println!("The build has failed because of the following {}", errors.x_error_s());
        println!("{}", errors.report());
        panic!("BUILD FAILED");
    }
}
