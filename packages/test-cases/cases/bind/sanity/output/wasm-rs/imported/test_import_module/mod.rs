use serde::{Serialize, Deserialize};
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
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
pub struct TestImportModule {}

impl TestImportModule {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn new() -> TestImportModule {
        TestImportModule {}
    }

    pub fn imported_method(input: &InputImportedMethod) -> Result<Option<TestImportObject>, String> {
        let uri = TestImportModule::URI;
        let args = serialize_imported_method_args(input).map_err(|e| e.to_string())?;
        let result = subinvoke::wrap_subinvoke(
            uri,
            "importedMethod",
            args,
        )?;
        deserialize_imported_method_result(result.as_slice()).map_err(|e| e.to_string())
    }

    pub fn another_method(input: &InputAnotherMethod) -> Result<i32, String> {
        let uri = TestImportModule::URI;
        let args = serialize_another_method_args(input).map_err(|e| e.to_string())?;
        let result = subinvoke::wrap_subinvoke(
            uri,
            "anotherMethod",
            args,
        )?;
        deserialize_another_method_result(result.as_slice()).map_err(|e| e.to_string())
    }
}
