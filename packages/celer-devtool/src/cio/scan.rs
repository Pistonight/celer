use std::fs;
use std::path::PathBuf;

use super::ErrorState;

/// Scan for celer files with main_path as the main file and scan for modules in module_path
pub fn scan_for_celer_files(main_path: &str, module_path: &str, out_paths: &mut Vec<PathBuf>, out_errors: &mut ErrorState) {
    // Add main.celer if it is a directory
    let main_path = PathBuf::from(main_path);
    let main_path = if main_path.is_dir() {
        main_path.join("main.celer")
    } else {
        main_path
    };

    if !main_path.exists() {
        out_errors.add(format!("{}", main_path.display()), "Cannot find the main file");
        return
    }

    scan_path(PathBuf::from(module_path), out_paths, out_errors);

    if !out_paths.contains(&main_path) {
        out_paths.push(main_path);
    }
}

/// Scan the path for modules. If the path is a directory, scan all files and subdirectories.
fn scan_path(path: PathBuf, out_paths: &mut Vec<PathBuf>, out_errors: &mut ErrorState) {
    if path.is_dir() {
        scan_dir(path, out_paths, out_errors);
    } else if path.is_file() && super::file::is_related_module(&path) {
        out_paths.push(path);
    }
}


fn scan_dir(path: PathBuf, out_paths: &mut Vec<PathBuf>, out_errors: &mut ErrorState) {
    let entries = match fs::read_dir(&path) {
        Ok(entries) => entries,
        Err(e) => {
            out_errors.add(format!("{}", path.display()), format!("Unable to read directory: {e}"));
            return;
        }
    };

    for entry in entries {
        let entry = match entry {
            Ok(entry) => entry,
            Err(e) => {
                out_errors.add(format!("{}", path.display()), format!("Unable to read directory entry: {e}"));
                continue;
            }
        };
        scan_path(entry.path(), out_paths, out_errors);
    }

}
