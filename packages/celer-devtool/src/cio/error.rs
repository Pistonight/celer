use std::collections::HashMap;
use std::fmt::Write;

pub type ErrorMap = HashMap<String, Vec<String>>;

pub fn add_error(path: String, error: String, out_errors: &mut ErrorMap) {
    match out_errors.get_mut(&path) {
        Some(vec) => {
            vec.push(error);
        },
        None => {
            let vec = vec![error];
            out_errors.insert(path, vec);
        }
    }
}

pub fn get_error_string(errors: &ErrorMap) -> String {
    let mut out_string = String::new();
    let mut num_errors = 0;
    for (path, path_errors) in errors {
        num_errors += path_errors.len();
        writeln!(out_string, "Error(s) in {}:", path).unwrap();
        for e in path_errors {
            writeln!(out_string, "    {}", e).unwrap();
        }
    }
    writeln!(out_string, "{} error(s)", num_errors).unwrap();

    out_string
}
