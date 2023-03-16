use crate::core;

mod clean_bundle_json;
pub use clean_bundle_json::clean_bundle_json;

/// Get the version of celer-lib
pub fn lib_version() -> String {
    String::from(crate::VERSION)
}

/// Create a new route, filled with dummy data and a hello world example
pub fn new_route(metadata: core::Metadata) -> core::SourceObject {
    // Create a hello world route
    let route = vec![
        core::SourceSection::Unnamed(core::SourceModule::SingleStep(core::SourceStep::Simple("(==) Welcome to celer!".to_string()))),
        core::SourceSection::Named(
            "Hello World".to_string(),
            core::SourceModule::MultiStep(vec![
                core::SourceStep::Simple("My first line".to_string())
            ])
        )
    ];
    core::SourceObject::new(metadata, route)
}

/// Bundle the unbundled json
/// The output bundle will always be valid, even if the input source has errors
pub fn bundle(source: &serde_json::Value, out_bundler_errors: &mut Vec<core::BundlerError>) -> core::SourceObject {
    let bundle = core::SourceObject::from(source, out_bundler_errors);
    if let Some(global_error) = &bundle.global_error {
        out_bundler_errors.push(core::BundlerError::make_global(global_error));
    }

    bundle
}
