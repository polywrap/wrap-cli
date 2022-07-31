pub mod wrap;
pub use wrap::*;
use polywrap_wasm_rs::JSON;
use serde_json::*;

pub fn stringify(args: ArgsStringify) -> String {
    let mut new_string = String::from("");
    for object in &args.values {
        new_string.push_str(&object.to_string());
    }
    new_string
}

pub fn parse(args: ArgsParse) -> JSON::Value { JSON::from_str(&args.value).unwrap() }

pub fn stringify_object(args: ArgsStringifyObject) -> String {
    let mut new_string = String::from(&args.object.json_a.to_string());
    new_string.push_str(&args.object.json_b.to_string());
    new_string
}

pub fn method_j_s_o_n(args: ArgsMethodJSON) -> JSON::Value {
    json!({
        "valueA": args.value_a,
        "valueB": args.value_b,
        "valueC": args.value_c
    })
}