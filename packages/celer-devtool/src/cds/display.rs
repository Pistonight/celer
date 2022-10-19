use std::fmt::Write;
use crate::cbld::bundle;

pub struct DevServerDisplay {
    current_display: String
}

impl DevServerDisplay {
    pub fn new() -> Self {
        DevServerDisplay {
            current_display: String::new()
        }
    }
    pub fn update(&mut self, port: u16, last_update: &str, bundle_context: &bundle::BundleContext) {
        let mut new_display = String::new();
        new_display.push_str("======== Celer Dev Server ========\n");
        if port != super::config::DEFAULT_PORT {
            writeln!(new_display, "Port: {port}").unwrap();
        }
        
        writeln!(new_display, "Watching project {}", bundle_context.get_project_name()).unwrap();
        writeln!(new_display, "Last update: {}", last_update).unwrap();

        new_display.push_str(&bundle_context.get_error_str_or("No issue found\n"));
        new_display.push('\n');
        if port != super::config::DEFAULT_PORT {
            writeln!(new_display, "Open https://celer.itntpiston.app/#/dev/{port} in your browser").unwrap();
        }else{
            new_display.push_str("Open https://celer.itntpiston.app/#/dev in your browser\n");
        }

        if !self.current_display.eq(&new_display) {
            self.current_display = new_display;
            // clear screen
            print!("{esc}[2J{esc}[1;1H", esc = 27 as char);
            print!("{}", self.current_display);
        }
    }
}
