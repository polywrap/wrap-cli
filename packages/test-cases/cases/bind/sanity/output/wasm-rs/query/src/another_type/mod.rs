pub mod serialization;
pub use serialization::{
    deserialize_another_type, read_another_type, serialize_another_type, write_another_type,
};

use crate::{CustomType, Read, Write};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AnotherType {
    pub prop: Option<String>,
    pub circular: Box<Option<CustomType>>,
}

impl AnotherType {
    pub fn new() -> Self {
        Self {
            prop: None,
            circular: Box::new(None),
        }
    }

    pub fn to_buffer(object: Self) -> Vec<u8> {
        serialize_another_type(object)
    }

    pub fn from_buffer(buffer: &[u8]) -> Self {
        deserialize_another_type(buffer)
    }

    pub fn write<W: Write>(object: Self, writer: W) {
        write_another_type(object, writer);
    }

    pub fn read<R: Read>(reader: R) -> Self {
        read_another_type(reader)
    }
}
