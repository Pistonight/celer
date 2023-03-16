mod compress;
mod encode;
mod json;

pub use compress::compress_str;
pub use compress::decompress_str;
pub use encode::b64_to_bytes;
pub use encode::bytes_to_b64;
pub use json::cast_to_bool;
pub use json::cast_to_str;
pub use json::to_str_vec;
// pub struct Icon {
//     data: Vec<u8>
// }

// impl Icon {
//     pub fn from_bytes(bytes: Vec<u8>) -> Self {
//         Icon {
//             data: bytes
//         }
//     }

//     pub fn from_base64(base64_str: String) -> Option<Self> {
//         match base64::decode(base64_str) {
//             Ok(bytes) => Some(Icon::from_bytes(bytes)),
//             _ => None
//         }
//     }

//     pub fn bytes(&self) -> &Vec<u8> {
//         &self.data
//     }

//     pub fn livesplit_cdata_str(&self) -> String {
//         String::from("No Impl")
//     }

//     pub fn web_base64_str(&self) -> String {
//         String::from("No Impl")
//     }
// }
