// data structure that represents the source files.
pub struct SourceObject {
    compiler_version: String,
    project: RouteMetadata,
    route: Vec<SourceSection>
}

pub struct RouteMetadata {
    project: String,
    version: String,
    authors: Vec<String>,
    url: String,
    description: String
}

pub enum SourceSection {
    Unnamed(SourceModule),
    Named(String, SourceModule)
}

pub enum SourceModule {
    SingleStep(SourceStep),
    MultiStep(Vec<SourceStep>)
}

pub enum SourceStep {
    Simple(String),
    Extended(String, SourceStepCustomization)
}

pub struct SourceStepCustomization {
    
}

// Intermediate step. Strings and presets parsed and processed. Data is standardized to make the job of the route engine easier
pub enum RouteAssembly {

}

// Processed Route Assembly ready to be consumed by the render engine
pub enum RouteObject {

}
