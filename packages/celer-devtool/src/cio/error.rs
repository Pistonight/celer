use std::collections::HashMap;
use std::fmt::Write;

type ErrorMap = HashMap<String, Vec<String>>;

pub struct ErrorState {
    underlying_map: ErrorMap
}

impl ErrorState {
    pub fn new() -> Self {
        Self {
            underlying_map: HashMap::new()
        }
    }

    pub fn add(&mut self, path: String, error: String) {
        match self.underlying_map.get_mut(&path) {
            Some(vec) => {
                vec.push(error);
            },
            None => {
                let vec = vec![error];
                self.underlying_map.insert(path, vec);
            }
        }
    }

    pub fn report(&self) -> String {
        let mut out_string = String::new();
        let mut num_errors = 0;
        for (path, path_errors) in &self.underlying_map {
            let new_errors =  path_errors.len();
            num_errors += new_errors;
            writeln!(out_string, "{} in {}:", x_error_s(new_errors), path).unwrap();
            for e in path_errors {
                writeln!(out_string, "    {}", e).unwrap();
            }
            out_string.push('\n')
        }
        writeln!(out_string, "{} total", x_error_s(num_errors)).unwrap();

        out_string
    }

    pub fn is_empty(&self) -> bool {
        self.underlying_map.is_empty()
    }

    pub fn clear(&mut self) {
        self.underlying_map.clear()
    }

    pub fn len(&self) -> usize {
        let mut num_errors = 0;
        for path_errors in self.underlying_map.values() {
            num_errors += path_errors.len();
        }
        num_errors
    }

    pub fn x_error_s(&self) -> String {
        x_error_s(self.len())
    }

    pub fn was_verb(&self) -> &'static str {
        if self.len() < 2 { "was" } else { "were" }
    }
}

fn x_error_s(i: usize) -> String {
    match i {
        0 => "No error".to_string(),
        1 => "1 error".to_string(),
        x => format!("{x} errors")
    }
}
