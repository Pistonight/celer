use std::fs::File;
use std::io::{self, Write};
use std::path::Path;
use serde_json::json;
use celer::{api, core};

pub fn new() {
    println!("Enter optional values for the following properties to create a new project. You can change them later in main.celer");

    let mut project_name = String::new();
    print!("Project Name: ");
    io::stdout().flush().unwrap();
    io::stdin().read_line(&mut project_name).unwrap();

    let mut description = String::new();
    print!("Description: ");
    io::stdout().flush().unwrap();
    io::stdin().read_line(&mut description).unwrap();

    let mut authors = String::new();
    print!("Authors (separate multiple with comma (,)): ");
    io::stdout().flush().unwrap();
    io::stdin().read_line(&mut authors).unwrap();

    let mut url = String::new();
    print!("Project Url: ");
    io::stdout().flush().unwrap();
    io::stdin().read_line(&mut url).unwrap();


    let authors_vec: Vec<String> = authors.as_str().split(',').map(|x| String::from(x.trim().trim_end())).collect();
    let source_metadata_json = json!({
        "name": String::from(project_name.trim().trim_end()),
        "description": String::from(description.trim().trim_end()),
        "authors": authors_vec,
        "url": String::from(url.trim().trim_end()),
        "version": String::from("0.1.0")
    });
    let source_metadata = core::Metadata::from(&source_metadata_json);
    let source_object = api::new_route(source_metadata);

    let source_object_str = serde_yaml::to_string(&source_object.to_json()).unwrap();

    let path = Path::new("main.celer");
    let display = path.display();

    let mut file = match File::create(path) {
        Err(why) => panic!("couldn't create {display}: {why}"),
        Ok(file) => file,
    };

    match file.write_all(source_object_str.as_bytes()) {
        Err(why) => panic!("couldn't write to {display}: {why}"),
        Ok(_) => println!("successfully created {display}"),
    }
}
