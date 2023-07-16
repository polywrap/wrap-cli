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
pub struct Else {
    #[serde(rename = "else")]
    pub _else: String,
}

impl Else {
    pub fn new() -> Else {
        Else {
            _else: String::new(),
        }
    }
}
