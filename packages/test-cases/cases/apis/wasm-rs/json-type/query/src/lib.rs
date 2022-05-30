pub mod w3;
pub use w3::*;
use web3api_wasm_rs::JSON;
use serde_json::*;

pub fn from_json(input: InputFromJson) -> Pair {
    serde_json::from_value::<Pair>(input.json).unwrap()
}

pub fn to_json(input: InputToJson) -> JSON::Value {
    JSON::to_value(&input.pair).unwrap()
}
