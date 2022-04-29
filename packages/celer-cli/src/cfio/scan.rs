use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

pub fn scan_for_celer_files(out_paths: &mut Vec<PathBuf>, out_errors: &mut HashMap<String, Vec<String>>) -> u32 {
    let current_dir = Path::new(".");
    scan_dir(current_dir.to_path_buf(), out_paths, out_errors)
}

fn scan_dir(path: PathBuf, out_paths: &mut Vec<PathBuf>, out_errors: &mut HashMap<String, Vec<String>>) -> u32 {
    let entries = match fs::read_dir(&path) {
        Ok(entries) => entries,
        Err(e) => {
            super::add_error(format!("{}", path.display()), format!("Unable to read directory: {}", e), out_errors);
            return 0;
        }
    };

    let mut count = 0;

    for entry in entries {
        let entry = match entry {
            Ok(entry) => entry,
            Err(e) => {
                super::add_error(format!("{}", path.display()), format!("Unable to read directory entry: {}", e), out_errors);
                continue;
            }
        };
        let sub_path = entry.path();

        let metadata = match fs::metadata(&sub_path) {
            Ok(metadata) => metadata,
            Err(e) => {
                super::add_error(format!("{}", sub_path.display()), format!("Unable to read metadata: {}", e), out_errors);
                continue;
            }
        };
        if metadata.is_dir() {
            count += scan_dir(sub_path, out_paths, out_errors);
        }else if metadata.is_file() {
            count += scan_file(sub_path, out_paths);
        }
    }

    count
}

fn scan_file(path: PathBuf, out_paths: &mut Vec<PathBuf>) -> u32 {
    if let Some(file_name) = path.file_name() {
        if let Some(file_name_str) = file_name.to_str() {
            if file_name_str.ends_with(".celer") || file_name_str.ends_with(".yaml"){
                out_paths.push(path);
                return 1;
            }
            return 0;
        }
    }
    println!("error: cfio: Unable to access file {}", path.display());
    0
}
