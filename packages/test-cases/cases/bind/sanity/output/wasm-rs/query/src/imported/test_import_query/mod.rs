pub mod serialization;
use crate::subinvoke;
use crate::TestImportObject;
use serde::{Deserialize, Serialize};
pub use serialization::{
    deserialize_another_method_result, deserialize_imported_method_result,
    serialize_another_method_args, serialize_imported_method_args, InputAnotherMethod,
    InputImportedMethod,
};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TestImportQuery;

impl TestImportQuery {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn imported_method(input: &InputImportedMethod) -> TestImportObject {
        let uri = Self::URI;
        let args = serialize_imported_method_args(input);
        let result = subinvoke::w3_subinvoke(
            uri.to_string(),
            "query".to_string(),
            "imported_method".to_string(),
            args,
        )
        .unwrap_or_default();
        deserialize_imported_method_result(result.as_slice())
    }

    pub fn another_method(input: &InputAnotherMethod) -> i64 {
        let uri = Self::URI;
        let args = serialize_another_method_args(input);
        let result = subinvoke::w3_subinvoke(
            uri.to_string(),
            "query".to_string(),
            "another_method".to_string(),
            args,
        )
        .unwrap_or_default();
        deserialize_another_method_result(result.as_slice())
    }
}
