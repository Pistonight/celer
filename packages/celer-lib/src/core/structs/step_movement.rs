
use serde_json::json;
use crate::data;

#[derive(Debug)]
pub struct Movement {
    to: Vec<f64>,
    away: MovementFlag,
}

impl Movement {
    pub fn new() -> Self {
        Movement {
            to: vec![0.0,0.0],
            away: MovementFlag::Normal
        }
    }

    pub fn from(value: &serde_json::Value, out_errors: &mut Vec<String>) -> Option<Self> {
        let mut movement = Movement::new();
        if !value.is_object() {
            out_errors.push(String::from("\"movements\" must contain coordinates with \"to\". Did you mean to use \"coord\"?"));
            return None;
        }
        let obj_value = value.as_object().unwrap();
        if !obj_value.contains_key("to") {
            out_errors.push(String::from("\"movements\" is missing the required \"to\" attribute."));
            return None;
        }

        if let Some(coord_array) = validate_coord_array(&obj_value["to"], out_errors){
            movement.to = coord_array;
        }else{
            return None;
        }

        let away = data::cast_to_bool(&obj_value["away"]);
        let warp = data::cast_to_bool(&obj_value["warp"]);
        if away {
            movement.away = MovementFlag::Away;
        } else if warp {
            movement.away = MovementFlag::Warp;
        }

        Some(movement)
    }

    pub fn to_json(&self) -> serde_json::Value {
        match self.away {
            MovementFlag::Normal => json!({"to": self.to}),
            MovementFlag::Away => json!({"to": self.to, "away": true}),
            MovementFlag::Warp => json!({"to": self.to, "warp": true}),
        }
    } 
}

#[derive(Debug)]
pub enum MovementFlag {
    Normal,
    Away,
    Warp
}

pub fn validate_coord_array(value: &serde_json::Value, out_errors: &mut Vec<String>) -> Option<Vec<f64>> {
    if let Some(vec_value) = value.as_array() {
        if vec_value.len() == 2 || vec_value.len() == 3 {
            let mut vec_new = Vec::new();
            for v in vec_value {
                if let Some(f64_value) = v.as_f64() {
                    vec_new.push(f64_value);
                }else{
                    out_errors.push("Invalid coordinate value.".to_string());
                    return None;
                }
            }
            return Some(vec_new);
        }
    }

    out_errors.push("Coordinates are ignored because the value is not valid. It must be an array with either 2 or 3 coordinates".to_string());
    None
}

// ===TESTS===
#[cfg(test)]
mod tests {
    mod test_validate_coord_array {
        use super::super::validate_coord_array;
        use serde_json::json;
        #[test]
        fn none_if_not_array(){
            let mut out_errors = vec![];
            let result = validate_coord_array(&json!(1), &mut out_errors);
            assert_eq!(result, None);
            assert_eq!(out_errors.len(), 1)
        }

        #[test]
        fn none_if_less_than_2_element(){
            let mut out_errors = vec![];
            let result = validate_coord_array(&json!([1]), &mut out_errors);
            assert_eq!(result, None);
            assert_eq!(out_errors.len(), 1)
        }

        #[test]
        fn none_if_more_than_3_element(){
            let mut out_errors = vec![];
            let result = validate_coord_array(&json!([1,2,3,4]), &mut out_errors);
            assert_eq!(result, None);
            assert_eq!(out_errors.len(), 1)
        }

        #[test]
        fn none_if_element_not_f64(){
            let mut out_errors = vec![];
            let result = validate_coord_array(&json!(["test","test"]), &mut out_errors);
            assert_eq!(result, None);
            assert_eq!(out_errors.len(), 1)
        }

        #[test]
        fn ok_if_2_element(){
            let mut out_errors = vec![];
            let result = validate_coord_array(&json!([1,2]), &mut out_errors);
            assert_eq!(result, Some(vec![1.0,2.0]));
            assert_eq!(out_errors.len(), 0)
        }

        #[test]
        fn ok_if_3_element(){
            let mut out_errors = vec![];
            let result = validate_coord_array(&json!([1,2,3]), &mut out_errors);
            assert_eq!(result, Some(vec![1.0,2.0,3.0]));
            assert_eq!(out_errors.len(), 0)
        }
    }
    #[test]
    fn it_works(){
        assert_eq!(2+2,4)
    }
}
