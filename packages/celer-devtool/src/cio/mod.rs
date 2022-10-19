mod error;
mod scan;  // route scan
pub mod file;
pub use error::ErrorState;
pub use scan::scan_for_celer_files;
