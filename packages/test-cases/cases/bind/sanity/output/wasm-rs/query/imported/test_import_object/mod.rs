use serde::{Serialize, Deserialize};
pub mod serialization;
use polywrap_wasm_rs::{
    BigInt,
    DecodingError,
    EncodingError,
    Read,
    Write,
    JSON
};
pub use serialization::{
    deserialize_test_import_object,
    read_test_import_object,
    serialize_test_import_object,
    write_test_import_object
};

use crate::TestImportAnotherObject;
use crate::TestImportEnum;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TestImportObject {
    pub object: TestImportAnotherObject,
    pub opt_object: Option<TestImportAnotherObject>,
    pub object_array: Vec<TestImportAnotherObject>,
    pub opt_object_array: Option<Vec<Option<TestImportAnotherObject>>>,
    pub en: TestImportEnum,
    pub opt_enum: Option<TestImportEnum>,
    pub enum_array: Vec<TestImportEnum>,
    pub opt_enum_array: Option<Vec<Option<TestImportEnum>>>,
}

impl TestImportObject {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn new() -> TestImportObject {
        TestImportObject {
            object: TestImportAnotherObject::new(),
            opt_object: None,
            object_array: vec![],
            opt_object_array: None,
            en: TestImportEnum::_MAX_,
            opt_enum: None,
            enum_array: vec![],
            opt_enum_array: None,
        }
    }

    pub fn to_buffer(input: &TestImportObject) -> Result<Vec<u8>, EncodingError>  {
        serialize_test_import_object(input).map_err(|e| EncodingError::from(e))
    }

    pub fn from_buffer(input: &[u8]) -> Result<TestImportObject, DecodingError> {
        deserialize_test_import_object(input).map_err(|e| DecodingError::from(e))
    }

    pub fn write<W: Write>(input: &TestImportObject, writer: &mut W) -> Result<(), EncodingError> {
        write_test_import_object(input, writer).map_err(|e| EncodingError::from(e))
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<TestImportObject, DecodingError> {
        read_test_import_object(reader).map_err(|e| DecodingError::from(e))
    }
}
