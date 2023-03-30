use crate::cbld;

pub const DEBUG: &str = "debug";

/// Flag to enable debug mode
pub fn debug_flag() -> clap::Arg<'static> {
    clap::Arg::new(DEBUG)
        .short('D')
        .long(DEBUG)
        .help("Use debug configuration. This usually means that output will be prettified, instead of minimized")
        .action(clap::ArgAction::SetTrue)
}

/// Flag to set output format to YAML
pub fn yaml_flag() -> clap::Arg<'static> {
    clap::Arg::new("yaml")
        .short('y')
        .long("yaml")
        .help("Output in YAML format instead of JSON.")
        .conflicts_with_all(&[DEBUG, "gzip"])
        .action(clap::ArgAction::SetTrue)
}

/// Flag to set output format to gzipped JSON
pub fn gzip_flag() -> clap::Arg<'static> {
    clap::Arg::new("gzip")
        .short('z')
        .long("gzip")
        .help("Output in gzipped json format.")
        .conflicts_with_all(&[DEBUG, "yaml"])
        .action(clap::ArgAction::SetTrue)
}

/// Flag to specify the main module
pub fn main_module_flag() -> clap::Arg<'static> {
    clap::Arg::new("main")
        .short('M')
        .long("main")
        .help("The main file to use (default is main.celer)")
        .action(clap::ArgAction::Set)
        .number_of_values(1)
        .default_value("main.celer")
}

/// Flag to specify the module path
pub fn module_path_flag() -> clap::Arg<'static> {
    clap::Arg::new("module-path")
        .short('m')
        .long("module-path")
        .help("The path to recursively scan for celer files (default is \".\" i.e. current directory)")
        .action(clap::ArgAction::Set)
        .number_of_values(1)
        .default_value(".")
}

/// Flag to specify the output path
pub fn output_flag() -> clap::Arg<'static> {
    clap::Arg::new("output")
        .short('o')
        .long("output")
        .help("The output path (directory or file). Default file name is used for if a directory is specified.")
        .action(clap::ArgAction::Set)
        .number_of_values(1)
        .default_value(".")
}

pub fn has_flag(args: &clap::ArgMatches, flag: &str) -> bool {
    *args.get_one::<bool>(flag).unwrap()
}

/// Output format
#[derive(Debug, Clone)]
pub enum Format {
    Json,
    Yaml,
    Gzip
}

/// Configuration of celer build
#[derive(Debug, Clone)]
pub struct BundleConfig {
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
    /// The output path
    pub output_path: String,
}

impl BundleConfig {
    pub fn from(args: &clap::ArgMatches) -> Self {
        let target = args.get_one::<String>("target").unwrap();
        Self::from_with_target(args, target)
    }

    pub fn from_with_target(args: &clap::ArgMatches, target: &str) -> Self {
        let debug = has_flag(args, DEBUG);

        let mut format = Format::Json;
        if has_flag(args, "yaml"){
            format = Format::Yaml;
        }else if has_flag(args, "gzip"){
            format = Format::Gzip;
        }

        let main_module = args.get_one::<String>("main").unwrap().to_string();
        let module_path = args.get_one::<String>("module-path").unwrap().to_string();
        let output_path = args.get_one::<String>("output").unwrap().to_string();

        Self {
            debug,
            target: target.to_string(),
            format,
            main_module,
            module_path,
            output_path,
        }
    }
}


/// Configuration of dev server
#[derive(Debug)]
pub struct DevServerConfig {
    /// Port
    pub port: u16,
    /// Should bundle be emitted
    pub emit_bundle: bool,
    /// Config for bundler
    pub bundle_config: BundleConfig
}

impl DevServerConfig {
    pub fn from(args: &clap::ArgMatches) -> Self {
        let port = *args.get_one::<u16>("port").unwrap();

        let emit_bundle = !*args.get_one::<bool>("no-emit-bundle").unwrap();
        let bundle_config = BundleConfig::from_with_target(args, cbld::T_BUNDLE);

        Self {
            port,
            emit_bundle,
            bundle_config,
        }
    }
}