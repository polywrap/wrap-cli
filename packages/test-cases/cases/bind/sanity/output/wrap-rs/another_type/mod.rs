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
use crate::CustomType;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AnotherType {
    pub prop: Option<String>,
    pub circular: Option<CustomType>,
    #[serde(rename = "const")]
    pub _const: Option<String>,
}

impl AnotherType {
    pub fn new() -> AnotherType {
        AnotherType {
            prop: None,
            circular: None,
            _const: None,
        }
    }
}
