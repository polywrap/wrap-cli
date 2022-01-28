use serde::{Serialize, Deserialize};
pub mod serialization;
use polywrap_wasm_rs::{
    BigInt,
    DecodingError,
    EncodingError,
    Read,
    Write,
    JSON,
};
pub use serialization::{
    deserialize_test_import_another_object,
    read_test_import_another_object,
    serialize_test_import_another_object,
    write_test_import_another_object
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

    pub fn to_buffer(input: &TestImportAnotherObject) -> Result<Vec<u8>, EncodingError> {
        serialize_test_import_another_object(input).map_err(|e| EncodingError::from(e))
    }

    pub fn from_buffer(input: &[u8]) -> Result<TestImportAnotherObject, DecodingError> {
        deserialize_test_import_another_object(input).map_err(|e| DecodingError::from(e))
    }

    pub fn write<W: Write>(input: &TestImportAnotherObject, writer: &mut W) -> Result<(), EncodingError> {
        write_test_import_another_object(input, writer).map_err(|e| EncodingError::from(e))
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<TestImportAnotherObject, DecodingError> {
        read_test_import_another_object(reader).map_err(|e| DecodingError::from(e))
    }
}
