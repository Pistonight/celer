use std::sync::{Arc, atomic::{AtomicBool, Ordering}};
use std::collections::HashMap;
use std::thread;
use std::path::PathBuf;
use std::time::Duration;



use chrono::{DateTime, Local};
use serde_json::{json, Value};

use celer::{Metadata, SourceObject};

use crate::cfio;


mod client;
mod server;
use server::DevServer;
mod delay;
use delay::DelayMgr;
mod display;
use display::DevServerDisplay;

/// Entry point for cds
pub fn start() {
    match DevServer::new(2222) {
        Err(e) => panic!("error: cds: Error starting dev server: {}", e),
        Ok(mut server) => run(&mut server)
    }

    println!("Dev server stopped");
}

fn run(server: &mut DevServer) {
    let running = Arc::new(AtomicBool::new(true));

    set_interrupt(running.clone());
    // start dev server
    let mut last_update: Option<DateTime<Local>> = Option::None;
    //let mut update_success_count = 0;

    let mut delay_mgr = DelayMgr::new();
    let mut display = DevServerDisplay::new();

    let (mut bundle, mut metadata, mut errors) = load_bundle();
    loop {
        let new_clients = server.query_clients();

        let (new_bundle, new_metadata, new_errors) = load_bundle();
        let bundle_changed = !new_bundle.eq(&bundle);
        if bundle_changed {
            bundle = new_bundle;
            metadata = new_metadata;
            errors = new_errors;
        }
        // if clients changed, then update regardless of file change    
        if bundle_changed || new_clients {
            // send update
            let new_update_count = server.send(&bundle);
            if new_update_count > 0 {
                last_update = Option::Some(Local::now());
            }

            delay_mgr.reset();
        }else{
            delay_mgr.slack();
        }

        let project = &metadata.name;

        let last_update_str = match last_update {
            Some(time) => format!("{}", time.format("%Y-%m-%d %H:%M:%S")),
            None => String::from("never"),
        };
        
        display.update(project, &last_update_str, &errors);
        
        for _ in 0..delay_mgr.get_delay() {
            if !running.load(Ordering::SeqCst) {
                break;
            }
            thread::sleep(Duration::from_secs(1));
        }
        if !running.load(Ordering::SeqCst) {
            break;
        }
        
    }

    server.stop();
}
fn set_interrupt(running: Arc<AtomicBool>) {
    if let Err(e) = ctrlc::set_handler(move || {
        println!("Shutting down dev server");
        running.store(false, Ordering::SeqCst)
    }) {
        println!("warn: cds: Cannot set interrupt handler: {}", e);
        println!("Server may not shut down gracefully when interrupted");
        thread::sleep(Duration::from_secs(1));
    }
}

fn load_bundle() -> (String, celer::Metadata, HashMap<String, Vec<String>>) {
    let mut paths: Vec<PathBuf> = Vec::new();
    let mut errors: HashMap<String, Vec<String>> = HashMap::new();

    cfio::scan_for_celer_files(&mut paths, &mut errors);

    let mut combined_json = json!({});
    for p in paths {
        let file_content = match std::fs::read_to_string(&p) {
            Ok(v) => v,
            Err(e) => {
                cfio::add_error(format!("{}", p.display()), format!("Cannot read file: {}", e), &mut errors);
                continue
            }
        };
        let file_json: Value = match cfio::load_yaml_object(&file_content) {
            Ok(file_json) => file_json,
            Err(e) => {
                cfio::add_error(format!("{}", p.display()), format!("Error loading object: {}", e), &mut errors);
                continue
            }
        };
        for (k, v) in file_json.as_object().unwrap() {
            combined_json[k.to_string()] = v.clone();
        }
    }
    

    let json = serde_json::to_string(&combined_json).unwrap();
    //println!("{}", json);
    
    let source_object: SourceObject = match serde_json::from_value(combined_json) {
        Err(_) => {
            SourceObject {
                project: Metadata {
                    authors: vec![],
                    name: String::from("unknown"),
                    url: String::new(),
                    description: String::new(),
                    version: String::new()
                }
            }
        },
        Ok(v) => v
    };

    (json, source_object.project, errors)

}
