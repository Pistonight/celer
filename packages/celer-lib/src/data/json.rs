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
        return f64_value != 0.0;
    }
    if let Some(i64_value) = value.as_i64() {
        return i64_value != 0;
    }
    if let Some(str_value) = value.as_str() {
        return !str_value.eq("");
    }

    false
}
