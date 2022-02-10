use serde::{Serialize, Deserialize};
use polywrap_wasm_rs::{
    BigInt,
    Read,
    Write,
    JSON,
    subinvoke,
};
pub mod serialization;
pub use serialization::{
    deserialize_imported_method_result,
    serialize_imported_method_args,
    InputImportedMethod,
    deserialize_another_method_result,
    serialize_another_method_args,
    InputAnotherMethod
};

use crate::TestImportObject;
use crate::TestImportEnum;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TestImportQuery {}

impl TestImportQuery {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn new() -> TestImportQuery {
        TestImportQuery {}
    }

    pub fn imported_method(input: &InputImportedMethod) -> Result<Option<TestImportObject>, String> {
        let uri = TestImportQuery::URI;
        let args = serialize_imported_method_args(input)?;
        let result = subinvoke::w3_subinvoke(
            uri,
            "query",
            "imported_method",
            args,
        )?;
        deserialize_imported_method_result(result.as_slice()).map_err(|e| e.to_string())
    }

    pub fn another_method(input: &InputAnotherMethod) -> Result<i32, String> {
        let uri = TestImportQuery::URI;
        let args = serialize_another_method_args(input)?;
        let result = subinvoke::w3_subinvoke(
            uri,
            "query",
            "another_method",
            args,
        )?;
        deserialize_another_method_result(result.as_slice()).map_err(|e| e.to_string())
    }
}
