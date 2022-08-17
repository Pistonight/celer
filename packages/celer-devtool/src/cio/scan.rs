use std::fs;
use std::path::{Path, PathBuf};

use super::ErrorState;

pub fn scan_for_celer_files(out_paths: &mut Vec<PathBuf>, out_errors: &mut ErrorState) -> u32 {
    let current_dir = Path::new(".");
    if find_main(&current_dir.to_path_buf(), out_errors){
        scan_dir(current_dir.to_path_buf(), out_paths, out_errors)
    }else{
        0
    }
}

fn find_main(path: &PathBuf, out_errors: &mut ErrorState) -> bool {
    let entries = match fs::read_dir(&path) {
        Ok(entries) => entries,
        Err(e) => {
            out_errors.add(format!("{}", path.display()), format!("Unable to read directory: {}", e));
            return false;
        }
    };

    for entry in entries {
        let entry = match entry {
            Ok(entry) => entry,
            Err(e) => {
                out_errors.add(format!("{}", path.display()), format!("Unable to read directory entry: {}", e));
                continue;
            }
        };
        if entry.file_name().eq("main.celer") {
            return true;
        }
    }

    out_errors.add(format!("{}", path.display()), "Cannot find main.celer".to_string());
    false
}

fn scan_dir(path: PathBuf, out_paths: &mut Vec<PathBuf>, out_errors: &mut ErrorState) -> u32 {
    let entries = match fs::read_dir(&path) {
        Ok(entries) => entries,
        Err(e) => {
            out_errors.add(format!("{}", path.display()), format!("Unable to read directory: {}", e));
            return 0;
        }
    };

    let mut count = 0;

    for entry in entries {
        let entry = match entry {
            Ok(entry) => entry,
            Err(e) => {
                out_errors.add(format!("{}", path.display()), format!("Unable to read directory entry: {}", e));
                continue;
            }
        };
        let sub_path = entry.path();

        let metadata = match fs::metadata(&sub_path) {
            Ok(metadata) => metadata,
            Err(e) => {
                out_errors.add(format!("{}", sub_path.display()), format!("Unable to read metadata: {}", e));
                continue;
            }
        };
        if metadata.is_dir() {
            count += scan_dir(sub_path, out_paths, out_errors);
        }else if metadata.is_file() {
            count += scan_file(sub_path, out_paths, out_errors);
        }
    }

    count
}

fn scan_file(path: PathBuf, out_paths: &mut Vec<PathBuf>, out_errors: &mut ErrorState) -> u32 {
    if let Some(file_name) = path.file_name() {
        if let Some(file_name_str) = file_name.to_str() {
            if file_name_str.ends_with(".celer") || file_name_str.ends_with(".yaml"){
                out_paths.push(path);
                return 1;
            }
            return 0;
        }
    }
    out_errors.add(format!("{}", path.display()), format!("Unable to access file"));
    0
}
