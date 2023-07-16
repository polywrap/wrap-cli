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
pub struct TestImportAnotherObject {
    pub prop: String,
}

impl TestImportAnotherObject {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn new() -> TestImportAnotherObject {
        TestImportAnotherObject {
            prop: String::new(),
        }
    }
}
