

pub fn build() {

    super::cfio::scan_for_celer_files(|p| {
        println!("File: {}", p.display());
    }, |e| {
        println!("error: {}", e);
    });


}

