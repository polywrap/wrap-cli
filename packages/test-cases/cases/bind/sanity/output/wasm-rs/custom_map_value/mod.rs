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
    deserialize_custom_map_value,
    read_custom_map_value,
    serialize_custom_map_value,
    write_custom_map_value
};


#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CustomMapValue {
    pub foo: String,
}

impl CustomMapValue {
    pub fn new() -> CustomMapValue {
        CustomMapValue {
            foo: String::new(),
        }
    }

    pub fn to_buffer(args: CustomMapValue) -> Result<Vec<u8>, EncodeError> {
        serialize_custom_map_value(args).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn from_buffer(args: &[u8]) -> Result<CustomMapValue, DecodeError> {
        deserialize_custom_map_value(args).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }

    pub fn write<W: Write>(args: CustomMapValue, writer: &mut W) -> Result<(), EncodeError> {
        write_custom_map_value(args, writer).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<CustomMapValue, DecodeError> {
        read_custom_map_value(reader).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }
}
