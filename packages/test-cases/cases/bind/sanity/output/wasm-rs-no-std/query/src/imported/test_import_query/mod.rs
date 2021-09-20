use alloc::{
    boxed::Box,
    collections::BTreeMap,
    format,
    str::FromStr,
    string::{String, ToString},
    vec,
    vec::Vec,
};
use polywrap_wasm_rs::subinvoke;
pub mod serialization;
pub use serialization::{
    deserialize_another_method_result, deserialize_imported_method_result,
    serialize_another_method_args, serialize_imported_method_args, InputAnotherMethod,
    InputImportedMethod,
};

use crate::TestImportEnum;
use crate::TestImportObject;

#[derive(Clone, Debug)]
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
