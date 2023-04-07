mod cbld;   // Celer Build
mod ccmd;   // Celer Command Module
mod cds;    // Celer Dev Server
mod cio;    // Celer IO

pub const VERSION: &str = "2.3.0";

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

    //Setup command arg parser
    let matches = clap::Command::new("celer-devtool")
        .bin_name("celer")
        .about("Celer Devtool")
        .version(VERSION)
        .long_version(const_format::formatcp!("{VERSION} (lib {})", celer::VERSION))
        .subcommand_required(true)
        .arg_required_else_help(true)
        // new command
        .subcommand(
            clap::Command::new("new")
                .about("Create a new celer project")
        )
        // dev command
        .subcommand(
            clap::Command::new("dev")
                .about("Start dev server")
                .arg(
                    clap::Arg::new("port")
                        .short('p')
                        .long("port")
                        .help(const_format::formatcp!("Specify the port to use. Default is {}", cds::DEFAULT_PORT))
                        .value_parser(clap::value_parser!(u16))
                        .action(clap::ArgAction::Set)
                        .number_of_values(1)
                        .default_value(const_format::formatcp!("{}", cds::DEFAULT_PORT))
                )
                .arg(ccmd::arg::debug_flag())
                .arg(ccmd::arg::main_module_flag())
                .arg(ccmd::arg::module_path_flag())
                .arg(ccmd::arg::output_flag())
                .arg(ccmd::arg::yaml_flag())
                .arg(ccmd::arg::gzip_flag())
                .arg(
                    clap::Arg::new("no-emit-bundle")
                        .short('n')
                        .long("no-emit-bundle")
                        .help("Do not emit bundle on file update")
                        .conflicts_with_all(&[ccmd::arg::DEBUG, "yaml", "gzip"])
                        .action(clap::ArgAction::SetTrue)
                )
        )
        // build command
        .subcommand(
            clap::Command::new("build")
                .about("Build project")
                .arg(ccmd::arg::debug_flag())
                .arg(ccmd::arg::main_module_flag())
                .arg(ccmd::arg::module_path_flag())
                .arg(ccmd::arg::output_flag())
                .arg(ccmd::arg::yaml_flag())
                .arg(ccmd::arg::gzip_flag())
                .arg(
                    clap::Arg::new("target")
                        .short('t')
                        .long("target")
                        .help(const_format::formatcp!("Specify the build target. Possible values: {} (default), {}", cbld::BUILD_TARGETS[0], cbld::BUILD_TARGETS[1]))
                        .value_parser(cbld::BUILD_TARGETS)
                        .action(clap::ArgAction::Set)
                        .number_of_values(1)
                        .default_value(cbld::BUILD_TARGETS[0])
                )
        );

    match matches.get_matches().subcommand() {
        Some(("new", _)) => ccmd::new(),
        Some(("dev", matches)) => {
            let config = ccmd::arg::DevServerConfig::from(matches);
            cds::start(config);
        },
        Some(("build", matches)) => {
            let config = ccmd::arg::BundleConfig::from(matches);
            cbld::run(config);
        }
        _ => {}
    }

}
