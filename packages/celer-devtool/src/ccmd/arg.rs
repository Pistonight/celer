pub const DEBUG: &str = "debug";

pub fn debug_flag() -> clap::Arg<'static> {
    clap::Arg::new(DEBUG)
        .short('D')
        .long(DEBUG)
        .help("Use debug configuration. This usually means that output will be prettified, instead of minimized")
        .action(clap::ArgAction::SetTrue)
}

pub fn has_flag(args: &clap::ArgMatches, flag: &str) -> bool {
    *args.get_one::<bool>(flag).unwrap()
}
