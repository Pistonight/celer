use std::collections::HashMap;
use serde_json::json;
use crate::data;
use super::step_movement::Movement;
use super::step_movement::validate_coord_array;


#[derive(Debug)]
pub struct SourceStepCustomization {
    text: Option<String>,
    icon: Option<String>,
    comment: Option<String>,
    notes: Option<String>,
    line_color: Option<String>,
    hide_icon_on_map: Option<bool>,
    split_type: Option<String>,
    var_change: Option<HashMap<String, i64>>,
    time_override: Option<i64>,
    commands: Option<Vec<String>>,
    suppress: Option<Vec<String>>,
    coord: Option<Vec<f64>>,
    movements: Option<Vec<Movement>>,
    fury: Option<i64>,
    gale: Option<i64>
}
impl Default for SourceStepCustomization {
    fn default() -> Self {
        Self::new()
    }
}
impl SourceStepCustomization {
    pub fn new() -> Self {
        SourceStepCustomization {
            text: None,
            icon: None,
            comment: None,
            notes: None,
            line_color: None,
            hide_icon_on_map: None,
            split_type: None,
            var_change: None,
            time_override: None,
            commands: None,
            suppress: None,
            coord: None,
            movements: None,
            fury: None,
            gale: None
        }
    }

    pub fn deep_clone(&self) -> Self {
        let mut out_ignore = vec![];
        SourceStepCustomization::from(&self.to_json(), &mut out_ignore).unwrap()
    }

    pub fn from(value: &serde_json::Value, out_errors: &mut Vec<String>) -> Option<Self> {
        if value.is_null() {
            out_errors.push(String::from("Step customization cannot be null. Did you put an extra \":\" there?"));
            return None;
        }
        let obj_value_immut = match value.as_object() {
            Some(v) => v,
            None => {
                out_errors.push(format!("Step customization must be an object, but received: {value}"));
                return None;
            }
        };

        let mut obj_value = obj_value_immut.clone();

        let mut customization = SourceStepCustomization::new();
        // Validate each attribute
        if let Some(value_text) = obj_value.remove("text") {
            if let Some(str_value) = data::cast_to_str(&value_text) {
                customization.text = Some(str_value);
            }else{
                SourceStepCustomization::add_str_error(out_errors, "text");
            }
        }
        if let Some(value_comment) = obj_value.remove("comment") {
            if let Some(str_value) = data::cast_to_str(&value_comment) {
                customization.comment = Some(str_value);
            }else{
                SourceStepCustomization::add_str_error(out_errors, "comment");
            }
        }
        if let Some(value_notes) = obj_value.remove("notes") {
            if let Some(str_value) = data::cast_to_str(&value_notes) {
                customization.notes = Some(str_value);
            }else{
                SourceStepCustomization::add_str_error(out_errors, "notes");
            }
        }
        if let Some(value_line_color) = obj_value.remove("line-color") {
            if let Some(str_value) = data::cast_to_str(&value_line_color) {
                customization.line_color = Some(str_value);
            }else{
                SourceStepCustomization::add_str_error(out_errors, "line-color");
            }
        }
        if let Some(value_split_type) = obj_value.remove("split-type") {
            if let Some(str_value) = data::cast_to_str(&value_split_type) {
                customization.split_type = Some(str_value);
            }else{
                SourceStepCustomization::add_str_error(out_errors, "split-type");
            }
        }
        if let Some(value_icon) = obj_value.remove("icon") {
            if let Some(str_value) = data::cast_to_str(&value_icon) {
                customization.icon = Some(str_value);
            }else{
                SourceStepCustomization::add_str_error(out_errors, "icon");
            }
        }
        if let Some(value_fury) = obj_value.remove("fury") {
            if let Some(i64_value) = value_fury.as_i64() {
                customization.fury = Some(i64_value);
            }else{
                SourceStepCustomization::add_i64_error(out_errors, "fury");
            }
        }
        if let Some(value_gale) = obj_value.remove("gale") {
            if let Some(i64_value) = value_gale.as_i64() {
                customization.gale = Some(i64_value);
            }else{
                SourceStepCustomization::add_i64_error(out_errors, "gale");
            }
        }
        if let Some(value_time_override) = obj_value.remove("time-override") {
            if let Some(i64_value) = value_time_override.as_i64() {
                customization.time_override = Some(i64_value);
            }else{
                SourceStepCustomization::add_i64_error(out_errors, "time-override");
            }
        }
        if let Some(value_hide_icon_on_map) = obj_value.remove("hide-icon-on-map") {
            customization.hide_icon_on_map = Some(data::cast_to_bool(&value_hide_icon_on_map));
        }
        if let Some(value_var_change) = obj_value.remove("var-change") {
            if let Some(obj_value) = value_var_change.as_object() {
                let mut outmap = HashMap::new();
                SourceStepCustomization::validate_var_change(obj_value, &mut outmap, out_errors);
                customization.var_change = Some(outmap);
            }else{
                SourceStepCustomization::add_obj_error(out_errors, "var-change");
            }
        }
        if let Some(value_coord) = obj_value.remove("coord") {
            customization.coord = validate_coord_array(&value_coord, out_errors);
        }
        if let Some(value_movements) = obj_value.remove("movements") {
            if let Some(vec_value) = value_movements.as_array() {
                let mut vec_movements = Vec::new();
                for v in vec_value {
                    if let Some(movement) = Movement::from(v, out_errors) {
                        vec_movements.push(movement);
                    }
                }
                customization.movements = Some(vec_movements);
            }else{
                SourceStepCustomization::add_arr_error(out_errors, "movements");
            }
        }
        if let Some(value_commands) = obj_value.remove("commands") {
            if let Some(vec_value) = value_commands.as_array() {
                let mut vec_commands = Vec::new();
                for v in vec_value {
                    if let Some(str_value) = data::cast_to_str(v) {
                        vec_commands.push(str_value);
                    }else{
                        out_errors.push(format!("{v:?} is not a valid command"));
                    }
                }
                customization.commands = Some(vec_commands);
            }else{
                SourceStepCustomization::add_arr_error(out_errors, "commands");
            }
        }
        if let Some(value_suppress) = obj_value.remove("suppress") {
            if let Some(vec_value) = value_suppress.as_array() {
                let mut vec_suppress = Vec::new();
                for v in vec_value {
                    if let Some(str_value) = data::cast_to_str(v) {
                        vec_suppress.push(str_value);
                    }else{
                        out_errors.push(format!("{v:?} is not a valid error to suppress"));
                    }
                }
                customization.suppress = Some(vec_suppress);
            }else{
                SourceStepCustomization::add_arr_error(out_errors, "suppress");
            }
        }

        // invalid attributes
        for k in obj_value.keys() {
            if k.eq("notes") {
                out_errors.push("Invalid attribute \"notes\", did you mean \"note\"?".to_string());
            }else if k.eq("movement") {
                out_errors.push("Invalid attribute \"movement\", did you mean \"movements\"?".to_string());
            }else{
                out_errors.push(format!("Invalid attribute \"{k}\""))
            }
        }
        Some(customization)
    }

    fn validate_var_change(inmap: &serde_json::Map<String, serde_json::Value>, outmap: &mut HashMap<String, i64>, out_errors: &mut Vec<String>) {
        for (k,v) in inmap {
            if let Some(i64_value) = v.as_i64() {
                outmap.insert(String::from(k), i64_value);
            }else{
                out_errors.push(format!("Variable \"{k}\" in var-change is ignored because it is not an integer"))
            }
        }
    }

    fn add_str_error(out_errors: &mut Vec<String>, property: &str) {
        out_errors.push(format!("\"{property}\" property must be a string or convertible to string. Try wrap the content in quotes (\")"));
    }
    fn add_i64_error(out_errors: &mut Vec<String>, property: &str) {
        out_errors.push(format!("\"{property}\" property must be an integer"));
    }
    fn add_obj_error(out_errors: &mut Vec<String>, property: &str) {
        out_errors.push(format!("\"{property}\" property must be an object. Did you indent correctly?"));
    }
    fn add_arr_error(out_errors: &mut Vec<String>, property: &str) {
        out_errors.push(format!("\"{property}\" property must be an array."));
    }

    pub fn to_json(&self) -> serde_json::Value {
        let mut obj = json!({});
        if let Some(text) = &self.text {
            obj["text"] = json!(text);
        }
        if let Some(icon) = &self.icon {
            obj["icon"] = json!(icon);
        }
        if let Some(comment) = &self.comment {
            obj["comment"] = json!(comment);
        }
        if let Some(notes) = &self.notes {
            obj["notes"] = json!(notes);
        }
        if let Some(line_color) = &self.line_color {
            obj["line-color"] = json!(line_color);
        }
        if let Some(hide_icon_on_map) = self.hide_icon_on_map {
            if hide_icon_on_map {
                obj["hide-icon-on-map"] = json!(true);
            }
        }
        if let Some(split_type) = &self.split_type {
            obj["split-type"] = json!(split_type);
        }
        if let Some(var_change) = &self.var_change {
            let mut var_change_obj = json!({});
            for (k,v) in var_change {
                var_change_obj[k] = json!(v);
            }
            obj["var-change"] = var_change_obj;
        }
        if let Some(time_override) = self.time_override {
            obj["time-override"] = json!(time_override);
        }
        if let Some(commands) = &self.commands {
            obj["commands"] = json!(commands);
        }
        if let Some(suppress) = &self.suppress {
            obj["suppress"] = json!(suppress);
        }
        if let Some(coord) = &self.coord {
            obj["coord"] = json!(coord);
        }
        if let Some(movements) = &self.movements {
            let mut vec = Vec::new();
            for m in movements {
                vec.push(m.to_json());
            }
            obj["movements"] = json!(vec);
        }
        if let Some(fury) = self.fury {
            obj["fury"] = json!(fury);
        }
        if let Some(gale) = self.gale {
            obj["gale"] = json!(gale);
        }

        obj
    }
}
