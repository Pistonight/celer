use std::collections::HashMap;
use crate::data;
use serde_json::json;
/// Struct for a step in the route doc
#[derive(Debug)]
pub enum SourceStep {
    /// Enum for invalid step structure. Member is the error message and source as string
    Error(String, String),
    /// Enum for simple (single-line) step
    Simple(String),
    /// Enum for step with raw-value customization 
    Extended(String, serde_json::Value),
    /// Enum for step with typed customization, after validation during bundling
    ExtendedSafe(String, SourceStepCustomization)
}

impl SourceStep {
    /// Parse from json. Result can be Error, Simple, Extended
    pub fn from(value: &serde_json::Value) -> Self {
        if let Some(str_value) = data::cast_to_str(value) {
            return SourceStep::Simple(String::from(str_value));
        }
        if let Some(obj_value) = value.as_object() {
            if obj_value.len() != 1 {
                return SourceStep::Error(
                    format!("Customized step must only have 1 key. Did you indent correctly?"),
                    value.to_string()
                );
            }
            for (k,v) in obj_value {
                // There's only one key
                return SourceStep::Extended(String::from(k), v.clone());
            }
        }
        // error cases
        if value.is_null() {
            return SourceStep::Error(
                format!("Step is null. Did you forget to type the step after \"-\"?"),
                value.to_string()
            );
        }
        return SourceStep::Error(String::from("Can't recognize"), value.to_string());
    }
    /// Make a copy of self
    pub fn deep_clone(&self) -> Self {
        match self {
            SourceStep::Error(step_string, source) => SourceStep::Error(String::from(step_string), String::from(source)),
            SourceStep::Simple(step_string) => SourceStep::Simple(String::from(step_string)),
            SourceStep::Extended(step_string, customization) => {
                SourceStep::Extended(String::from(step_string), customization.clone())
            },
            SourceStep::ExtendedSafe(step_string, customization) => {
                SourceStep::ExtendedSafe(String::from(step_string), customization.deep_clone())
            }
        }
    }
    /// Write to json
    pub fn to_json(&self) -> serde_json::Value {
        match self {
            SourceStep::Error(step_string, _) => json!(step_string),
            SourceStep::Simple(step_string) => json!(step_string),
            SourceStep::Extended(step_string, customization) => {
                json!({
                    step_string: customization
                })
            },
            SourceStep::ExtendedSafe(step_string, customization) => {
                json!({
                    step_string: customization.to_json()
                })
            }
        }
    }
}

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
    coord: Option<Vec<f64>>,
    movements: Option<Vec<Movement>>,
    fury: Option<i64>,
    gale: Option<i64>
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
        let mut obj_value = match value.as_object_mut() {
            Some(v) => v,
            None => {
                out_errors.push(String::from("Step customization must be an object."));
                return None;
            }
        };

        let mut customization = SourceStepCustomization::new();
        // Validate each attribute
        if let Some(value_text) = obj_value.remove("text") {
            if let Some(str_value) = data::cast_to_str(&value_text) {
                customization.text = Some(String::from(str_value));
            }else{
                SourceStepCustomization::add_str_error(out_errors, "text");
            }
        }
        if let Some(value_comment) = obj_value.remove("comment") {
            if let Some(str_value) = data::cast_to_str(&value_comment) {
                customization.comment = Some(String::from(str_value));
            }else{
                SourceStepCustomization::add_str_error(out_errors, "comment");
            }
        }
        if let Some(value_notes) = obj_value.remove("notes") {
            if let Some(str_value) = data::cast_to_str(&value_notes) {
                customization.notes = Some(String::from(str_value));
            }else{
                SourceStepCustomization::add_str_error(out_errors, "notes");
            }
        }
        if let Some(value_line_color) = obj_value.remove("line-color") {
            if let Some(str_value) = data::cast_to_str(&value_line_color) {
                customization.line_color = Some(String::from(str_value));
            }else{
                SourceStepCustomization::add_str_error(out_errors, "line-color");
            }
        }
        if let Some(value_split_type) = obj_value.remove("split-type") {
            if let Some(str_value) = data::cast_to_str(&value_split_type) {
                customization.split_type = Some(String::from(str_value));
            }else{
                SourceStepCustomization::add_str_error(out_errors, "split-type");
            }
        }
        if let Some(value_icon) = obj_value.remove("icon") {
            if let Some(str_value) = data::cast_to_str(&value_icon) {
                customization.icon = Some(String::from(str_value));
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
            customization.coord = SourceStepCustomization::validate_coord_array(&value_coord, out_errors);
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
                        vec_commands.push(String::from(str_value));
                    }else{
                        out_errors.push(format!("{:?} is not a valid command", v));
                    }
                }
                customization.commands = Some(vec_commands);
            }else{
                SourceStepCustomization::add_arr_error(out_errors, "commands");
            }
        }
        return Some(customization);
    }

    fn validate_var_change(inmap: &serde_json::Map<String, serde_json::Value>, outmap: &mut HashMap<String, i64>, out_errors: &mut Vec<String>) {
        for (k,v) in inmap {
            if let Some(i64_value) = v.as_i64() {
                outmap.insert(String::from(k), i64_value);
            }else{
                out_errors.push(format!("Variable \"{}\" in var-change is ignored because it is not an integer", k))
            }
        }
    }

    fn validate_coord_array(value: &serde_json::Value, out_errors: &mut Vec<String>) -> Option<Vec<f64>> {
        if let Some(vec_value) = value.as_array() {
            if vec_value.len() == 2 || vec_value.len() == 3 {
                let mut vec_new = Vec::new();
                for v in vec_value {
                    if let Some(f64_value) = v.as_f64() {
                        vec_new.push(f64_value);
                    }else{
                        out_errors.push(format!("Invalid coordinate value."));
                        return None;
                    }
                }
                Some(vec_new);
            }
        }

        out_errors.push(format!("Coordinates are ignored because the value is not valid. It must be an array with either 2 or 3 coordinates"));
        None
    }

    fn add_str_error(out_errors: &mut Vec<String>, property: &str) {
        out_errors.push(format!("\"{}\" property must be a string or convertible to string. Try wrap the content in quotes (\")", property));
    }
    fn add_i64_error(out_errors: &mut Vec<String>, property: &str) {
        out_errors.push(format!("\"{}\" property must be an integer", property));
    }
    fn add_obj_error(out_errors: &mut Vec<String>, property: &str) {
        out_errors.push(format!("\"{}\" property must be an object. Did you indent correctly?", property));
    }
    fn add_arr_error(out_errors: &mut Vec<String>, property: &str) {
        out_errors.push(format!("\"{}\" property must be an array.", property));
    }

    pub fn to_json(&self) -> serde_json::Value {
        let mut obj = json!({});
        if let Some(text) = self.text {
            obj["text"] = json!(text);
        }
        if let Some(icon) = self.icon {
            obj["icon"] = json!(icon);
        }
        if let Some(comment) = self.comment {
            obj["comment"] = json!(comment);
        }
        if let Some(notes) = self.notes {
            obj["notes"] = json!(notes);
        }
        if let Some(line_color) = self.line_color {
            obj["line-color"] = json!(line_color);
        }
        if let Some(hide_icon_on_map) = self.hide_icon_on_map {
            if hide_icon_on_map {
                obj["hide-icon-on-map"] = json!(true);
            }
        }
        if let Some(split_type) = self.split_type {
            obj["split-type"] = json!(split_type);
        }
        if let Some(var_change) = self.var_change {
            let var_change_obj = json!({});
            for (k,v) in var_change {
                var_change_obj[k] = json!(v);
            }
            obj["var-change"] = var_change_obj;
        }
        if let Some(time_override) = self.time_override {
            obj["time-override"] = json!(time_override);
        }
        if let Some(commands) = self.commands {
            obj["commands"] = json!(commands);
        }
        if let Some(coord) = self.coord {
            obj["coord"] = json!(coord);
        }
        if let Some(movements) = self.movements {
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

        if let Some(coord_array) = SourceStepCustomization::validate_coord_array(&obj_value["to"], out_errors){
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

        return Some(movement);
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