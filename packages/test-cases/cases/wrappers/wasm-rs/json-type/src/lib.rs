pub mod wrap;
pub use wrap::*;
use polywrap_wasm_rs::JSON;
use serde_json::*;

pub fn stringify(input: InputStringify) -> String {
    let mut new_string = String::from("");
    for object in &input.values {
        new_string.push_str(&object.to_string());
    }
    new_string
}

pub fn parse(input: InputParse) -> JSON::Value { JSON::from_str(&input.value).unwrap() }

pub fn stringify_object(input: InputStringifyObject) -> String {
    let mut new_string = String::from(&input.object.json_a.to_string());
    new_string.push_str(&input.object.json_b.to_string());
    new_string
}

pub fn method_j_s_o_n(input: InputMethodJSON) -> JSON::Value {
    json!({
        "valueA": input.value_a,
        "valueB": input.value_b,
        "valueC": input.value_c
    })
}