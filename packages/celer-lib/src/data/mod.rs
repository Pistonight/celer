
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

// Convert json value to string in a JS-like manner
pub fn cast_to_str(value: &serde_json::Value) -> Option<String> {
    if value.is_null() {
        return Some(String::from("null"));
    }
    if let Some(bool_value) = value.as_bool() {
        return Some(String::from(if bool_value {"true"} else {"false"}));
    }
    if let Some(f64_value) = value.as_f64() {
        return Some(f64_value.to_string());
    }
    if let Some(i64_value) = value.as_i64() {
        return Some(i64_value.to_string());
    }
    if let Some(str_value) = value.as_str() {
        return Some(String::from(str_value));
    }
    None
}

// Convert json value to bool in a JS-like manner
pub fn cast_to_bool(value: &serde_json::Value) -> bool {
    if value.is_null() {
        return false;
    }
    if let Some(bool_value) = value.as_bool() {
        return bool_value;
    }
    if let Some(f64_value) = value.as_f64() {
        return f64_value == 0.0;
    }
    if let Some(i64_value) = value.as_i64() {
        return i64_value == 0;
    }
    if let Some(str_value) = value.as_str() {
        return str_value.eq("");
    }

    false
}

pub fn to_str_vec(value: &serde_json::Value) -> Vec<String> {
    let mut output = vec![];
    if let Some(arr_value) = value.as_array() {
        for element in arr_value {
            if let Some(str_value) = cast_to_str(element) {
                output.push(str_value);
            }
        }
    }

    output
}
