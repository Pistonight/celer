pub const VERSION: &str = "2.0.0";
// use std::env;

// Celer Command Module
mod ccmd;
// Celer Dev Server
mod cds;
// Celer File IO
mod cfio;

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
    // Setup command arg parser
    let matches = clap::Command::new("celer")
        .about("Celer Devtool")
        .version(VERSION)
        .subcommand_required(true)
        .arg_required_else_help(true)
        // new command
        .subcommand(
            clap::Command::new("new")
                .about("Create a new celer project")
        )
        // version command
        .subcommand(
            clap::Command::new("version")
                .about("Show devtool version")
                .short_flag('v')
                .long_flag("version")
        )
        // dev command
        .subcommand(
            clap::Command::new("dev")
                .about("Start dev server")
                .arg(
                    clap::Arg::new("port")
                        .short('p')
                        .long("port")
                        .help("Specify the port to use. Default is 2222")
                        .action(clap::ArgAction::Set)
                        .number_of_values(1)
                )
        );

    match matches.get_matches().subcommand() {
        Some(("version", _)) => println!("{}", VERSION),
        Some(("new", _)) => ccmd::new(),
        Some(("dev", dev_matches)) => {
            let port = match dev_matches.get_one::<String>("port") {
                Some(value) => {
                    match value.parse::<u16>() {
                        Ok(u16_value) => u16_value,
                        Err(e) => {
                            std::panic!("cannot parse port: {e}: {value}")
                        }
                    }
                },
                None => cds::DEFAULT_PORT
            };

            cds::start(port, true);
        }
        _ => panic!()
    }

    // let args: Vec<String> = env::args().collect();
    // if args.len() < 2 {
    //     print_help();
    //     process::exit(1);
    // }
    // let command = &args[1];
    // match command.as_str() {
    //     "new" => ccmd::new(),
    //     "build" => {
    //         println!("This feature is still being developed. To access bundle.json, please run dev server, and download bundle.json from the web app (Options > Download bundle.json)");
    //     },
    //     "dev" => cds::start(2222),
    //     "version" => println!("{}", VERSION),
    //     _ => print_help(),
    // }
    // for a in &args[1..] {
    //     println!("{:?}", a);
    // }
    
}

// fn print_help() {
//     println!("Celer Dev Tool v{}", VERSION);
//     println!();
//     println!("Usage: celer[EXE] <command>");
//     println!();
//     println!("Commands:");
//     println!("new       Make a new project in the current directory");
//     println!("build     [WIP] Build the route and emit bundle.json");
//     println!("dev       Start dev server");
//     //println!("spec      Display .celer file specification");
//     println!("version   Display version");
//     println!("help      Display this");
// }

// celer new - make a new project (interactive)
// celer dev - start dev server
// celer build - build the route (bundle.json)
// --debug also output the intermediate data (bundle.src.celer, bundle.asm.json if --object is set)
// --object also output the processed output (bundle.obj.json)
// --readable make the json outputs readable
// celer release - make the html file for release (interactive)


//dev and build uses celer lib. 
// the dev server stores objects in memory and send them to web app for hot replacement
