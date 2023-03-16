use std::sync::{Arc, atomic::{AtomicBool, Ordering}};
use std::thread;
use std::time::Duration;
use chrono::{DateTime, Local};
use crate::cbld::bundle;
mod client;
mod config;
mod delay;
mod display;
mod server;
use delay::DelayMgr;
use display::DevServerDisplay;
use server::DevServer;
pub use config::{Config, get_subcommand};

/// Entry point for cds
pub fn start(config: Config) {
    println!("Starting dev server...");
    let mut thread = DevServerThread::new(config);

    while thread.main_loop() {}

    thread.stop();

    println!("Dev server stopped");
}

/// Set Ctrl C interrupt handler for stopping
fn set_interrupt(running: Arc<AtomicBool>) {
    if let Err(e) = ctrlc::set_handler(move || {
        println!("Shutting down dev server");
        running.store(false, Ordering::SeqCst)
    }) {
        println!("warn: cds: Cannot set interrupt handler: {e}");
        println!("Server may not shut down gracefully when interrupted");
        thread::sleep(Duration::from_secs(1));
    }
}

struct DevServerThread {
    /// Underlying wrapper for TcpListener, for communicating with clients
    server: DevServer,

    config: Config,
    running: Arc<AtomicBool>,
    delay_mgr: DelayMgr,
    display: DevServerDisplay,

    last_update: Option<DateTime<Local>>,
    bundle_context: bundle::BundleContext,
}

impl DevServerThread {
    /// Create and bind to port
    pub fn new(config: Config) -> Self {
        let server = match DevServer::new(config.port) {
            Err(e) => panic!("error: cds: Error starting dev server: {e}"),
            Ok(server) => server
        };

        let running = Arc::new(AtomicBool::new(true));

        set_interrupt(running.clone());

        let current_dir = match std::env::current_dir(){
            Ok(p) => format!("{}", p.display()),
            _ => String::from("")
        };

        Self {
            server,
            config,
            running,
            delay_mgr: DelayMgr::new(),
            display: DevServerDisplay::new(),
            last_update: None,
            bundle_context: bundle::BundleContext::new(&current_dir)
        }

    }

    pub fn stop(&mut self) {
        self.server.stop();
    }

    /// Main loop
    /// Returns true if loop should continue
    pub fn main_loop(&mut self) -> bool{
        let new_clients = self.server.query_clients();
        self.bundle_context.reset();
        let (source, _unused_bundle, changed) = self.bundle_context.get_bundle();

        // if clients changed, update regardless of file change    
        if changed || new_clients {
            // send update
            let source_str = serde_json::to_string(&source).unwrap();
            let new_update_count = self.server.send(&source_str);
            if new_update_count > 0 {
                self.last_update = Option::Some(Local::now());
            }

            // Write updated bundle.json if changed
            if changed && self.config.emit_bundle {
                self.bundle_context.write_bundle_json(self.config.debug);
            }

            self.bundle_context.clear_dirty();

            self.delay_mgr.reset();
        }else{
            // If no change, let the server update less often
            self.delay_mgr.slack();
        }

        let last_update_str = match self.last_update {
            Some(time) => format!("{}", time.format("%Y-%m-%d %H:%M:%S")),
            None => String::from("never"),
        };
        
        self.display.update(self.config.port, &last_update_str, &self.bundle_context);
        
        for _ in 0..self.delay_mgr.get_delay() {
            if !self.running.load(Ordering::SeqCst) {
                return false
            }
            thread::sleep(Duration::from_secs(1));
        }

        self.running.load(Ordering::SeqCst)
    }

}
