use crate::ccmd;

pub const DEFAULT_PORT: u16 = 2222;

pub fn get_subcommand() -> clap::Command<'static> {
    clap::Command::new("dev")
        .about("Start dev server")
        .arg(
            clap::Arg::new("port")
                .short('p')
                .long("port")
                .help(const_format::formatcp!("Specify the port to use. Default is {}", DEFAULT_PORT))
                .value_parser(clap::value_parser!(u16))
                .action(clap::ArgAction::Set)
                .number_of_values(1)
                .default_value(const_format::formatcp!("{}", DEFAULT_PORT))
        )
        .arg(ccmd::arg::debug_flag())
        .arg(ccmd::arg::main_module_flag())
        .arg(ccmd::arg::module_path_flag())
        .arg(
            clap::Arg::new("no-emit-bundle")
                .short('n')
                .long("no-emit-bundle")
                .help("Do not emit bundle.json on file update")
                .conflicts_with(ccmd::arg::DEBUG)
                .action(clap::ArgAction::SetTrue)
        )
}

/// Configuration of dev server
#[derive(Debug)]
pub struct Config {
    /// Port
    pub port: u16,
    /// If running dev server emits bundle.json on file update
    pub emit_bundle: bool,
    /// If output files should be in debug (pretty) mode
    pub debug: bool,
    /// The main module
    pub main_module: String,
    /// The module path
    pub module_path: String,
}

impl Config {
    pub fn from(args: &clap::ArgMatches) -> Self {
        let port = *args.get_one::<u16>("port").unwrap();

        let emit_bundle = !*args.get_one::<bool>("no-emit-bundle").unwrap();
        let debug = ccmd::arg::has_flag(args, ccmd::arg::DEBUG);
        let main_module = args.get_one::<String>("main").unwrap().to_string();
        let module_path = args.get_one::<String>("module-path").unwrap().to_string();

        Self {
            port,
            emit_bundle,
            debug,
            main_module,
            module_path,
        }
    }
}
