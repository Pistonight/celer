use std::collections::HashMap;

pub struct DevServerDisplay {
    current_display: String
}

impl DevServerDisplay {
    pub fn new() -> Self {
        DevServerDisplay {
            current_display: String::new()
        }
    }
    pub fn update(&mut self, project: &str, last_update: &str, errors: &HashMap<String, Vec<String>>) {
        let mut new_display = String::new();
        new_display.push_str("======== Celer Dev Server ========\n");
        new_display.push_str("Watching project ");
        new_display.push_str(project);
        new_display.push('\n');
        new_display.push_str("Last update: ");
        new_display.push_str(last_update);
        new_display.push('\n');

        if errors.is_empty() {
            new_display.push_str("No issue found\n");
        }else{
            let mut num_errors = 0;
            for (path, path_errors) in errors {
                num_errors += path_errors.len();
                new_display.push_str("Error(s) in ");
                new_display.push_str(path);
                new_display.push_str(":\n");
                for e in path_errors {
                    new_display.push_str("    ");
                    new_display.push_str(e);
                    new_display.push('\n');
                }
            }
            new_display.push_str(&format!("{} error(s)\n", num_errors));
        }
        new_display.push('\n');
        new_display.push_str("Open https://celer.itntpiston.app/#/dev in your browser\n");
        
        if !self.current_display.eq(&new_display) {
            self.current_display = new_display;
            // clear screen
            print!("{esc}[2J{esc}[1;1H", esc = 27 as char);
            print!("{}", self.current_display);
        }
    }
}
