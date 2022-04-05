use std::env;
use std::process;

mod v;
fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_help();
        process::exit(1);
    }
    let command = &args[1];
    match command.as_str() {
        "version" => {
            println!("{}", v::VERSION)
        }
        _ => print_help()
    }
    // for a in &args[1..] {
    //     println!("{:?}", a);
    // }
    
}

fn print_help() {
    println!("Celer CLI v{}", v::VERSION);
    println!();
    println!("Usage: celer <command> <flags>");
    println!();
    println!("Commands:");
    println!("version   Display version");
    println!("help      Display this");
}

// celer new - make a new project (interactive)
// celer dev - start dev server
// celer build - build the route (bundle.json)
// --debug also output the intermediate data (bundle.src.celer, bundle.asm.json)
// --object also output the processed output (bundle.obj.json)
// --readable make the json outputs readable
// celer release - make the html file for release (interactive)


//dev and build uses celer lib. 
// the dev server stores objects in memory and send them to web app for hot replacement
