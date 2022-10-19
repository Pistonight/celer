use base64;

pub fn bytes_to_b64(input: &[u8]) -> String {
    base64::encode(input)
}

pub fn b64_to_bytes(input: &str) -> Option<Vec<u8>> {
    match base64::decode(input) {
        Ok(value) => Some(value),
        _ => None
    }
}