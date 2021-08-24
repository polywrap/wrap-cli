use polywrap_wasm_rs::subinvoke;
use serde::{
    Deserialize,
    Serialize,
};
pub mod serialization;
pub use serialization::{
    deserialize_imported_method_result,
    serialize_imported_method_args,
    InputImportedMethod,
    deserialize_another_method_result,
    serialize_another_method_args,
    InputAnotherMethod,
};

use crate::TestImportObject;
use crate::TestImportEnum;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TestImportQuery;

impl TestImportQuery {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn imported_method(input: &InputImportedMethod) -> Option<Box<TestImportObject>> {
        let uri = TestImportQuery::URI;
        let args = serialize_imported_method_args(input);
        let result = subinvoke::w3_subinvoke(
            uri.to_string(),
            "query".to_string(),
            "imported_method".to_string(),
            args,
        );
        deserialize_imported_method_result(result.as_slice())
    }

    pub fn another_method(input: &InputAnotherMethod) -> i32 {
        let uri = TestImportQuery::URI;
        let args = serialize_another_method_args(input);
        let result = subinvoke::w3_subinvoke(
            uri.to_string(),
            "query".to_string(),
            "another_method".to_string(),
            args,
        );
        deserialize_another_method_result(result.as_slice())
    }
}
