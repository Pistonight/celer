pub const DEBUG: &str = "debug";

/// Flag to enable debug mode
pub fn debug_flag() -> clap::Arg<'static> {
    clap::Arg::new(DEBUG)
        .short('D')
        .long(DEBUG)
        .help("Use debug configuration. This usually means that output will be prettified, instead of minimized")
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

pub fn has_flag(args: &clap::ArgMatches, flag: &str) -> bool {
    *args.get_one::<bool>(flag).unwrap()
}
