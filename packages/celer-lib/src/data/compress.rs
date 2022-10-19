use std::io;
use std::io::{Read, Write};
use flate2::write::GzEncoder;
use flate2::bufread::GzDecoder;
use flate2::Compression;

pub fn compress_str(input: &str) -> io::Result<Vec<u8>> {
    let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
    encoder.write(&input.as_bytes())?;
    encoder.finish()
}

pub fn decompress_str(input: &[u8]) -> io::Result<String> {
    let mut decoder = GzDecoder::new(input);
    let mut string = String::new();
    decoder.read_to_string(&mut string)?;
    Ok(string)
}