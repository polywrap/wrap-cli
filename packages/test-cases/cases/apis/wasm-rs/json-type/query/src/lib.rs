pub mod w3;
use polywrap_wasm_rs::JSON;
pub use w3::*;

pub fn parse(input: InputParse) -> JSON::Value {
    JSON::to_value(input.value).expect("Failed to parse String to JSON::Value")
}

pub fn stringify(input: InputStringify) -> String {
    let mut tmp_str = String::new();
    for i in 0..input.values.len() {
        let value = &input.values[i];
        tmp_str.push_str(&value.to_string());
    }
    tmp_str
}

pub fn stringify_object(input: InputStringifyObject) -> String {
    let mut tmp_str = String::new();
    tmp_str.push_str(&input.object.json_a.to_string());
    tmp_str.push_str(&input.object.json_b.to_string());
    tmp_str
}

pub fn method_json(input: InputMethodJson) -> JSON::Value {
    let mut map = JSON::Map::new();
    let _ = map.insert("valueA".to_string(), JSON::to_value(input.value_a).unwrap());
    let _ = map.insert("valueB".to_string(), JSON::to_value(input.value_b).unwrap());
    let _ = map.insert("valueC".to_string(), JSON::to_value(input.value_c).unwrap());
    JSON::Value::Object(map)
}
