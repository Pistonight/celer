use std::env;
use std::fs;
use std::path;

pub fn scan_for_celer_files<P, E>(callback: P, error: E) 
    where P: Fn(path::PathBuf) -> (),
          E: Fn(&str) -> ()
{
    let current_dir = path::Path::new(".");
    scan_dir(current_dir.to_path_buf(), &callback, &error);
}

fn scan_dir<P, E>(path: path::PathBuf, callback: &P, error: &E)
    where P: Fn(path::PathBuf) -> (),
          E: Fn(&str) -> ()
{
    let entries: fs::ReadDir = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            error(&super::cfio_error_msg(e));
            return;
        }
    };

    for entry in entries {
        let entry: fs::DirEntry = match entry {
            Ok(entry) => entry,
            Err(e) => {
                error(&super::cfio_error_msg(e));
                continue;
            }
        };
        let path = entry.path();

        let metadata = match fs::metadata(&path) {
            Ok(metadata) => metadata,
            Err(e) => {
                error(&super::cfio_error_msg(e));
                continue;
            }
        };
        if metadata.is_dir() {
            scan_dir(path, callback, error);
        }else if metadata.is_file() {
            scan_file(path, callback, error);
        }
    }

    //Ok(())
}

fn scan_file<P, E>(path: path::PathBuf, callback: &P, error: &E)
    where P: Fn(path::PathBuf) -> (),
          E: Fn(&str) -> ()

{
    if let Some(file_name) = path.file_name() {
        if let Some(file_name_str) = file_name.to_str() {
            if file_name_str.ends_with(".celer") || file_name_str.ends_with(".yaml"){
                callback(path);
            }
            return;
        }
    }
    error(&format!("cfio: Failed to scan file {}", path.display()));
}
