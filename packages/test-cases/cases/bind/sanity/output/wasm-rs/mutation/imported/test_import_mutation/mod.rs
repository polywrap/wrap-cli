use alloc::{
    boxed::Box,
    collections::BTreeMap,
    format,
    str::FromStr,
    string::{
        String,
        ToString,
    },
    vec,
    vec::Vec,
};
use polywrap_wasm_rs::subinvoke;
pub mod serialization;
use crate::TestImportObject;
pub use serialization::{
    deserialize_another_method_result,
    deserialize_imported_method_result,
    serialize_another_method_args,
    serialize_imported_method_args,
    InputAnotherMethod,
    InputImportedMethod,
};

#[derive(Clone, Debug)]
pub struct TestImportMutation {}

impl TestImportMutation {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn new() -> TestImportMutation {
        TestImportMutation {}
    }

    pub fn imported_method(input: &InputImportedMethod) -> Option<TestImportObject> {
        let uri = TestImportMutation::URI;
        let args = serialize_imported_method_args(input);
        let result = subinvoke::w3_subinvoke(
            uri.to_string(),
            "mutation".to_string(),
            "imported_method".to_string(),
            args,
        ).unwrap();
        deserialize_imported_method_result(result.as_slice())
    }

    pub fn another_method(input: &InputAnotherMethod) -> i32 {
        let uri = TestImportMutation::URI;
        let args = serialize_another_method_args(input);
        let result = subinvoke::w3_subinvoke(
            uri.to_string(),
            "mutation".to_string(),
            "another_method".to_string(),
            args,
        ).unwrap();
        deserialize_another_method_result(result.as_slice())
    }
}