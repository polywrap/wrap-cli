pub mod w3;
use polywrap_wasm_rs::JSON;
pub use w3::*;

pub fn parse(input: InputParse) -> JSON::Value {
    JSON::to_value(&input).unwrap()
}

pub fn stringify(input: InputStringify) -> String {
    JSON::to_string(&input).unwrap()
}

pub fn stringify_object(input: InputStringifyObject) -> String {
    JSON::to_string(&input).unwrap()
}

pub fn method_json(input: InputMethodJson) -> JSON::Value {
    let mut map = JSON::Map::new();
    let _ = map.insert("valueA".to_string(), JSON::to_value(input.value_a).unwrap());
    let _ = map.insert("valueB".to_string(), JSON::to_value(input.value_b).unwrap());
    let _ = map.insert("valueC".to_string(), JSON::to_value(input.value_c).unwrap());
    JSON::to_value(map).unwrap()
}
