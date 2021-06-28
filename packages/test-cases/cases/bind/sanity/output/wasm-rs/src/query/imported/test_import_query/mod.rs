pub mod serialization;
pub use serialization::{InputAnotherMethod, InputImportedMethod};

pub use serialization::{
    deserialize_another_method_result, deserialize_imported_method_result,
    serialize_another_method_args, serialize_imported_method_args,
};

use super::{TestImportEnum, TestImportObject};
use crate::subinvoke;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TestImportQuery;

impl TestImportQuery {
    pub const URI: String = String::from("testimport.uri.eth");

    pub fn imported_method(input: InputImportedMethod) -> TestImportObject {
        let uri = Self::URI;
        let args = serialize_imported_method_args(input);
        let result = subinvoke::w3_subinvoke(
            uri,
            "query".to_string(),
            "imported_method".to_string(),
            args,
        )
        .unwrap_or_default();
        deserialize_imported_method_result(result.as_slice())
    }

    pub fn another_method(input: InputAnotherMethod) -> i64 {
        let uri = Self::URI;
        let args = serialize_another_method_args(input);
        let result =
            subinvoke::w3_subinvoke(uri, "query".to_string(), "another_method".to_string(), args)
                .unwrap_or_default();
        deserialize_another_method_result(result.as_slice())
    }
}
