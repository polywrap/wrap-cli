pub mod serialization;
use crate::{
    Read, 
    Write,
};
use serde::{
    Deserialize, 
    Serialize,
};
pub use serialization::{
    deserialize_test_import_another_object, 
    read_test_import_another_object,
    serialize_test_import_another_object, 
    write_test_import_another_object,
};

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct TestImportAnotherObject {
    prop: String,
}

impl TestImportAnotherObject {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn new() -> TestImportAnotherObject {
        TestImportAnotherObject {
            prop: String::new(),
        }
    }

    pub fn to_buffer(object: &TestImportAnotherObject) -> Vec<u8> {
        serialize_test_import_another_object(object)
    }

    pub fn from_buffer(buffer: &[u8]) -> TestImportAnotherObject {
        deserialize_test_import_another_object(buffer)
    }

    pub fn write<W: Write>(object: &TestImportAnotherObject, writer: &mut W) {
        write_test_import_another_object(object, writer);
    }

    pub fn read<R: Read>(reader: &mut R) -> TestImportAnotherObject {
        read_test_import_another_object(reader).expect("Failed to read TestImportAnotherObject")
    }
}
