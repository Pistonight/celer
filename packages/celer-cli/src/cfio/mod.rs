use std::io;

mod scan;
pub use scan::scan_for_celer_files;

pub fn cfio_error_msg(e: io::Error) -> String {
    format!("cfio: {}", e)
}