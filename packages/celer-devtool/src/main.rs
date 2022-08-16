pub const VERSION: &str = "2.0.0";
// use std::env;

// Celer Command Module
mod ccmd;
// Celer Dev Server
mod cds;
// Celer IO
mod cio;
// Celer Build 
mod cbuild;

#[cfg(not(debug_assertions))]
fn ship_panic(panic_info: &std::panic::PanicInfo) {
    let msg = panic_message::panic_info_message(panic_info);
    println!("ERROR: {msg}");
    std::process::exit(1)
}
#[cfg(not(debug_assertions))]
fn init() {
    // Ship Init
    std::panic::set_hook(Box::new(ship_panic));
}
#[cfg(debug_assertions)]
fn init() {
    // Debug Init
}

fn main() {
    init();
    // Common args
    
    // Setup command arg parser
    let matches = clap::Command::new("celer-devtool")
        .bin_name("celer")
        .about("Celer Devtool")
        .version(VERSION)
        .subcommand_required(true)
        .arg_required_else_help(true)
        // new command
        .subcommand(
            clap::Command::new("new")
                .about("Create a new celer project")
        )
        // dev command
        .subcommand(cds::get_subcommand())
        // build command
        .subcommand(cbuild::get_subcommand());

    match matches.get_matches().subcommand() {
        Some(("new", _)) => ccmd::new(),
        Some(("dev", matches)) => {
            let config = cds::Config::from(matches);
            cds::start(config);
        },
        Some(("build", matches)) => {
            let config = cbuild::Config::from(matches);
            cbuild::run(config);
        }
        _ => {}
    }
    
}

