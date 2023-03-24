use crate::ccmd::arg;

pub const T_BUNDLE: &str = "bundle";
pub const T_MERGE: &str = "merge";
const TARGETS: [&str; 2] = [T_BUNDLE, T_MERGE];

pub fn get_subcommand() -> clap::Command<'static> {
    clap::Command::new("build")
        .about("Build project")
        .arg(arg::debug_flag())
        .arg(arg::main_module_flag())
        .arg(arg::module_path_flag())
        .arg(
            clap::Arg::new("target")
                .short('t')
                .long("target")
                .help(const_format::formatcp!("Specify the build target. Possible values: {} (default), {}", TARGETS[0], TARGETS[1]))
                .value_parser(TARGETS)
                .action(clap::ArgAction::Set)
                .number_of_values(1)
                .default_value(TARGETS[0])
        )
        .arg(
            clap::Arg::new("yaml")
                .short('y')
                .long("yaml")
                .help("Output in YAML format instead of JSON. Output file names will be *.yaml")
                .conflicts_with(arg::DEBUG)
                .conflicts_with("gzip")
                .action(clap::ArgAction::SetTrue)
        )
        .arg(
            clap::Arg::new("gzip")
                .short('z')
                .long("gzip")
                .help("Output in gzipped json format. Output file names will be *.json.gz")
                .conflicts_with(arg::DEBUG)
                .conflicts_with("yaml")
                .action(clap::ArgAction::SetTrue)
        )

}

/// Output format
#[derive(Debug)]
pub enum Format {
    Json,
    Yaml,
    Gzip
}

/// Configuration of celer build
#[derive(Debug)]
pub struct Config {
    /// If output files should be in debug (pretty) mode
    pub debug: bool,
    /// The build target
    pub target: String,
    /// Output format
    pub format: Format,
    /// The main module
    pub main_module: String,
    /// The module path
    pub module_path: String,
}

impl Config {
    pub fn from(args: &clap::ArgMatches) -> Self {
        let debug = arg::has_flag(args, arg::DEBUG);
        let target = args.get_one::<String>("target").unwrap().to_string();

        let mut format = Format::Json;
        if arg::has_flag(args, "yaml"){
            format = Format::Yaml;
        }else if arg::has_flag(args, "gzip"){
            format = Format::Gzip;
        }

        let main_module = args.get_one::<String>("main").unwrap().to_string();
        let module_path = args.get_one::<String>("module-path").unwrap().to_string();

        Self {
            debug,
            target,
            format,
            main_module,
            module_path,
        }
    }
}
