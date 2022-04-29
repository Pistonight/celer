pub const VERSION: &str = "1.1.0";
use std::env;
use std::process;

// Celer Command Module
mod ccmd;
// Celer Dev Server
mod cds;
// Celer File IO
mod cfio;
mod commands;


#[cfg(not(debug_assertions))]
fn ship_panic(panic_info: &std::panic::PanicInfo) {
    if let Some(s) = panic_info.payload().downcast_ref::<&str>() {
        println!("ERROR: {}", s);
        println!("An unexpected error has occured. There is likely an error message above.");
    }else{
        println!("An unexpected error has occured.");
    }
    process::exit(1)
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
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_help();
        process::exit(1);
    }
    let command = &args[1];
    match command.as_str() {
        "new" => ccmd::new(),
        "build" => {
            println!("This feature is still being developed. To access bundle.json, please run dev server, and download bundle.json from the web app (Options > Download bundle.json)");
        },
        "dev" => cds::start(),
        "version" => println!("{}", VERSION),
        _ => print_help(),
    }
    // for a in &args[1..] {
    //     println!("{:?}", a);
    // }
    
}

fn print_help() {
    println!("Celer Dev Tool v{}", VERSION);
    println!();
    println!("Usage: celer[EXE] <command>");
    println!();
    println!("Commands:");
    println!("new       Make a new project in the current directory");
    println!("build     [WIP] Build the route and emit bundle.json");
    println!("dev       Start dev server");
    //println!("spec      Display .celer file specification");
    println!("version   Display version");
    println!("help      Display this");
}

// celer new - make a new project (interactive)
// celer dev - start dev server
// celer build - build the route (bundle.json)
// --debug also output the intermediate data (bundle.src.celer, bundle.asm.json if --object is set)
// --object also output the processed output (bundle.obj.json)
// --readable make the json outputs readable
// celer release - make the html file for release (interactive)


//dev and build uses celer lib. 
// the dev server stores objects in memory and send them to web app for hot replacement
