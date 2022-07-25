
pub struct Icon {
    data: Vec<u8>
}

impl Icon {
    pub fn from_bytes(bytes: Vec<u8>) -> Self {
        Icon {
            data: bytes
        }
    }

    pub fn from_base64(base64_str: String) -> Option<Self> {
        match base64::decode(base64_str) {
            Ok(bytes) => Some(Icon::from_bytes(bytes)),
            _ => None
        }
    }

    pub fn bytes(&self) -> &Vec<u8> {
        &self.data
    }

    pub fn livesplit_cdata_str(&self) -> String {
        String::from("No Impl")
    }

    pub fn web_base64_str(&self) -> String {
        String::from("No Impl")
    }
}

