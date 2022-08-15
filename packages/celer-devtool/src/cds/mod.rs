use std::sync::{Arc, atomic::{AtomicBool, Ordering}};
use std::thread;
use std::time::Duration;

use chrono::{DateTime, Local};
use celer::core;

use crate::cfio;
mod client;
mod delay;
mod server;
mod display;
/*import-validate-exempt*/use delay::DelayMgr;
/*import-validate-exempt*/use display::DevServerDisplay;
/*import-validate-exempt*/use server::DevServer;

pub const DEFAULT_PORT: u16 = 2222;

/// Entry point for cds
pub fn start(port: u16, emit_bundle: bool) {
    println!("Starting dev server...");
    match DevServer::new(port) {
        Err(e) => panic!("error: cds: Error starting dev server: {}", e),
        Ok(mut server) => run(&mut server, emit_bundle)
    }

    println!("Dev server stopped");
}

fn run(server: &mut DevServer, emit_bundle: bool) {
    let running = Arc::new(AtomicBool::new(true));

    set_interrupt(running.clone());
    // start dev server
    let mut last_update: Option<DateTime<Local>> = None;
    //let mut update_success_count = 0;

    let mut delay_mgr = DelayMgr::new();
    let mut display = DevServerDisplay::new();

    println!("Initializing route...");
    let (mut bundle, mut metadata, mut errors) = cfio::load_unbundled_route();
    // write bundle.json if needed
    if emit_bundle{ 
        let source_object = core::SourceObject::from(&bundle);
        cfio::write_bundle_json(&source_object, &mut errors);
    }
    loop {
        let new_clients = server.query_clients();

        let (new_bundle, new_metadata, new_errors) = cfio::load_unbundled_route();
        let bundle_changed = !new_bundle.eq(&bundle);
        if bundle_changed {
            bundle = new_bundle;
            metadata = new_metadata;
            errors = new_errors;
        }
        // if clients changed, then update regardless of file change    
        if bundle_changed || new_clients {
            // send update
            let bundle_str = serde_json::to_string(&bundle).unwrap();
            let new_update_count = server.send(&bundle_str);
            if new_update_count > 0 {
                last_update = Option::Some(Local::now());
            }

            // write bundle.json if needed
            if emit_bundle{ 
                let source_object = core::SourceObject::from(&bundle);
                cfio::write_bundle_json(&source_object, &mut errors);
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
        
        display.update(server.port, project, &last_update_str, &errors);
        
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


