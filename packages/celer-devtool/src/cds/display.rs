use std::fmt::Write;
use crate::cio::ErrorState;

pub struct DevServerDisplay {
    current_display: String
}

impl DevServerDisplay {
    pub fn new() -> Self {
        DevServerDisplay {
            current_display: String::new()
        }
    }
    pub fn update(&mut self, port: u16, project: &str, last_update: &str, errors: &ErrorState) {
        let mut new_display = String::new();
        new_display.push_str("======== Celer Dev Server ========\n");
        if port != super::config::DEFAULT_PORT {
            writeln!(new_display, "Port: {port}").unwrap();
        }

        writeln!(new_display, "Watching project {project}").unwrap();
        writeln!(new_display, "Last update: {last_update}").unwrap();

        if errors.is_empty() {
            new_display.push_str("No issue found\n");
        }else{
            new_display.push_str(&errors.report());
        }
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
