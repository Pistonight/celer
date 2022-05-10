pub const VERSION: &str = "1.0.0";

mod api; 
mod core;
mod data;
pub use crate::core::Metadata;
pub use crate::core::SourceObject;
 
pub use crate::api::lib_version;
pub use crate::data::Icon;
