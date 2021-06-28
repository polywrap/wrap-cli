use super::{TestImportAnotherObject, TestImportEnum};
use crate::{Read, Write};
use serde::{Deserialize, Serialize};

pub mod serialization;
pub use serialization::{
    deserialize_test_import_object, read_test_import_object, serialize_test_import_object,
    write_test_import_object,
};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TestImportObject {
    pub object: TestImportAnotherObject,
    pub opt_object: Option<TestImportAnotherObject>,
    pub object_array: Vec<TestImportAnotherObject>,
    pub opt_object_array: Option<Vec<TestImportAnotherObject>>,
    pub en: TestImportEnum,
    pub opt_enum: Option<TestImportEnum>,
    pub enum_array: Vec<TestImportEnum>,
    pub opt_enum_array: Option<Vec<TestImportEnum>>,
}

impl TestImportObject {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn to_buffer(object: Self) -> Vec<u8> {
        serialize_test_import_object(object)
    }

    pub fn from_buffer(buffer: &[u8]) -> Self {
        deserialize_test_import_object(buffer)
    }

    pub fn write<W: Write>(writer: W, object: Self) {
        write_test_import_object(writer, object);
    }

    pub fn read<R: Read>(reader: R) -> Self {
        read_test_import_object(reader).expect("Failed to read TestImportObject")
    }
}
