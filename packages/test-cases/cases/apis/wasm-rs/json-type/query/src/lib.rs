pub mod w3;
use web3api_wasm_rs::JSON;
pub use w3::*;
use std::string::String;

pub fn parse(input: InputParse) -> JSON::Value {
    JSON::from_str(&input.value).unwrap()
}

pub fn stringify(input: InputStringify) -> String {
    let result_vec: Vec<String> = input.values.iter()
    .map(|value| JSON::to_string(&value).unwrap())
    .collect();

    web3api_wasm_rs::w3_debug_log(&format!("{:?}", result_vec));

    result_vec.join("")
}

pub fn stringify_object(input: InputStringifyObject) -> String {
    let mut result = String::new();
    let json_a_str = JSON::to_string(&input.object.json_a).unwrap();
    let json_b_str = JSON::to_string(&input.object.json_b).unwrap();
    
    result.push_str(&json_a_str);
    result.push_str(&json_b_str);

    result
}

pub fn method_j_s_o_n(input: InputMethodJSON) -> JSON::Value {
    let mut map = JSON::Map::new();
    let _ = map.insert("valueA".to_string(), JSON::to_value(input.value_a).unwrap());
    let _ = map.insert("valueB".to_string(), JSON::to_value(input.value_b).unwrap());
    let _ = map.insert("valueC".to_string(), JSON::to_value(input.value_c).unwrap());
    JSON::to_value(map).unwrap()
}
