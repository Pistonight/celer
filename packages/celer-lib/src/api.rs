use crate::core;
// COMMON API

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
pub fn bundle(source: &serde_json::Value) -> core::SourceObject {
    core::SourceObject::from(source)
}
