pub mod w3;
use web3api_wasm_rs::JSON;
pub use w3::*;
use std::string::String;

pub fn from_json(input: InputFromJson) -> Pair {
    Pair::deserialize(&input.json)
}

pub fn to_json(input: InputToJson) -> JSON::Value {
    JSON::to_value(&input.pair)
}
