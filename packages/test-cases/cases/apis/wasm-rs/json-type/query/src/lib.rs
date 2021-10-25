pub mod w3;
use polywrap_wasm_rs::JSON;
pub use w3::*;

pub fn parse(input: InputParse) -> JSON::Value {
    JSON::to_value(input.value).unwrap()
}

pub fn stringify(input: InputStringify) -> String {
    let mut temp_str = String::new();
    for i in 0..input.values.len() {
        let value = &input.values[i];
        temp_str.push_str(value.as_str().unwrap());
    }
    temp_str
}

pub fn stringify_object(input: InputStringifyObject) -> String {
    let mut temp_str = String::new();
    temp_str.push_str(input.object.json_a.as_str().unwrap());
    temp_str.push_str(input.object.json_b.as_str().unwrap());
    temp_str
}

pub fn method_json(input: InputMethodJson) -> JSON::Value {
    let mut map = JSON::Map::new();
    let _ = map.insert("valueA".to_string(), JSON::to_value(input.value_a).unwrap());
    let _ = map.insert("valueB".to_string(), JSON::to_value(input.value_b).unwrap());
    let _ = map.insert("valueC".to_string(), JSON::to_value(input.value_c).unwrap());
    JSON::Value::Object(map)
}
