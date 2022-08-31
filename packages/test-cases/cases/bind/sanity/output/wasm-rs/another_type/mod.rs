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
    pub _const: Option<String>,
}

impl AnotherType {
    pub fn new() -> AnotherType {
        AnotherType {
            prop: None,
            circular: None,
            _const: None,
        }
    }

    pub fn to_buffer(args: AnotherType) -> Result<Vec<u8>, EncodeError> {
        serialize_another_type(args).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn from_buffer(args: &[u8]) -> Result<AnotherType, DecodeError> {
        deserialize_another_type(args).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }

    pub fn write<W: Write>(args: AnotherType, writer: &mut W) -> Result<(), EncodeError> {
        write_another_type(args, writer).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<AnotherType, DecodeError> {
        read_another_type(reader).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }
}
