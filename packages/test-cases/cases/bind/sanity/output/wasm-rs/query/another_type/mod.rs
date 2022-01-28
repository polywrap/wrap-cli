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
    deserialize_another_type,
    read_another_type,
    serialize_another_type,
    write_another_type
};

use crate::CustomType;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AnotherType {
    pub prop: Option<String>,
    pub circular: Option<CustomType>,
}

impl AnotherType {
    pub fn new() -> AnotherType {
        AnotherType {
            prop: None,
            circular: None,
        }
    }

    pub fn to_buffer(input: &AnotherType) -> Result<Vec<u8>, EncodingError> {
        serialize_another_type(input).map_err(|e| EncodingError::from(e))
    }

    pub fn from_buffer(input: &[u8]) -> Result<AnotherType, DecodingError> {
        deserialize_another_type(input).map_err(|e| DecodingError::from(e))
    }

    pub fn write<W: Write>(input: &AnotherType, writer: &mut W) -> Result<(), EncodingError> {
        write_another_type(input, writer).map_err(|e| EncodingError::from(e))
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<AnotherType, DecodingError> {
        read_another_type(reader).map_err(|e| DecodingError::from(e))
    }
}
