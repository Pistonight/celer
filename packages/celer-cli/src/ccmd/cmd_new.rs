use std::io;
use std::io::Write; 
extern crate yaml_rust;
use yaml_rust::yaml::Yaml;
use yaml_rust::YamlEmitter;
use linked_hash_map::LinkedHashMap;
use std::fs::File;
use std::path::Path;

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

    let mut metadata = LinkedHashMap::new();
    metadata.insert(Yaml::String(String::from("name")), Yaml::String(String::from(project_name.trim_end())));
    metadata.insert(Yaml::String(String::from("description")), Yaml::String(String::from(description.trim_end())));
    metadata.insert(Yaml::String(String::from("version")), Yaml::String(String::from("1.0.0")));
    let authors_vec: Vec<Yaml> = authors.as_str().split(",").map(|x| Yaml::String(String::from(x.trim().trim_end()))).collect();
    metadata.insert(Yaml::String(String::from("authors")), Yaml::Array(authors_vec));
    metadata.insert(Yaml::String(String::from("url")), Yaml::String(String::from(url.trim_end())));

    let mut project = LinkedHashMap::new();
    project.insert(Yaml::String(String::from("Project")), Yaml::Hash(metadata));

    let doc = Yaml::Hash(project);
    let mut out_str = String::new();
    let mut emitter = YamlEmitter::new(&mut out_str);
    emitter.dump(&doc).unwrap();
    println!("{}", out_str); 

    let path = Path::new("main.celer");
    let display = path.display();

    // Open a file in write-only mode, returns `io::Result<File>`
    let mut file = match File::create(&path) {
        Err(why) => panic!("couldn't create {}: {}", display, why),
        Ok(file) => file,
    };

    // Write the `LOREM_IPSUM` string to `file`, returns `io::Result<()>`
    match file.write_all(out_str.as_bytes()) {
        Err(why) => panic!("couldn't write to {}: {}", display, why),
        Ok(_) => println!("successfully wrote to {}", display),
    }
}