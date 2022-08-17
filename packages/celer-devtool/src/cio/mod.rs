mod error; // Formatting error
mod scan;  // route scan
pub mod bundle; // Loading bundle
pub mod file;
pub use error::{add_error, get_error_string, ErrorMap};
pub use scan::scan_for_celer_files;





