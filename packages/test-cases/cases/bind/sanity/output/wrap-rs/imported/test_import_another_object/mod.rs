use serde::{Serialize, Deserialize};
pub mod serialization;
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
    DecodeError,
    EncodeError,
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

    pub fn to_buffer(args: &TestImportAnotherObject) -> Result<Vec<u8>, EncodeError> {
        serialize_test_import_another_object(args).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn from_buffer(args: &[u8]) -> Result<TestImportAnotherObject, DecodeError> {
        deserialize_test_import_another_object(args).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }

    pub fn write<W: Write>(args: &TestImportAnotherObject, writer: &mut W) -> Result<(), EncodeError> {
        write_test_import_another_object(args, writer).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<TestImportAnotherObject, DecodeError> {
        read_test_import_another_object(reader).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }
}
