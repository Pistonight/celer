use std::io::{self, Read, Write};
use flate2::Compression;
use flate2::bufread::GzDecoder;
use flate2::write::GzEncoder;

pub fn compress_str(input: &str) -> io::Result<Vec<u8>> {
    let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(input.as_bytes())?;
    encoder.finish()
}

pub fn decompress_str(input: &[u8]) -> io::Result<String> {
    let mut decoder = GzDecoder::new(input);
    let mut string = String::new();
    decoder.read_to_string(&mut string)?;
    Ok(string)
}
