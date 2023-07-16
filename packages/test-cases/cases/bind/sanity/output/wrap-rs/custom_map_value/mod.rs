use serde::{Serialize, Deserialize};
use polywrap_msgpack_serde::{
    wrappers::polywrap_json::JSONString,
    wrappers::polywrap_bigint::BigIntWrapper
};
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
    JSON
};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CustomMapValue {
    pub foo: String,
}

impl CustomMapValue {
    pub fn new() -> CustomMapValue {
        CustomMapValue {
            foo: String::new(),
        }
    }
}
