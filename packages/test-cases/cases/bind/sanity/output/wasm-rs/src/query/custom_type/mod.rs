pub mod serialization;
pub use serialization::{
    deserialize_custom_type, read_custom_type, serialize_custom_type, write_custom_type,
};

use super::{AnotherType, CustomEnum};
use crate::{Read, Write};
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CustomType {
    pub string: String,
    pub opt_string: Option<String>,
    pub u: u32,
    pub opt_u: Option<u32>,
    pub uint8: u8,
    pub uint16: u16,
    pub uint32: u32,
    pub uint64: u64,
    pub i: i32,
    pub int8: i8,
    pub int16: i16,
    pub int32: i32,
    pub int64: i64,
    pub bigint: BigInt,
    pub opt_bigint: Option<BigInt>,
    pub bytes: Vec<u8>,
    pub opt_bytes: Option<Vec<u8>>,
    pub boolean: bool,
    pub opt_boolean: Option<bool>,
    pub u_array: Vec<u32>,
    pub u_opt_array: Option<Vec<u32>>,
    pub opt_u_opt_array: Option<Vec<Option<u32>>>,
    pub opt_str_opt_array: Option<Option<Vec<String>>>,
    pub u_array_array: Vec<Vec<u32>>,
    pub u_opt_array_opt_array: Vec<Option<Vec<u64>>>,
    pub u_array_opt_array_array: Vec<Option<Vec<Vec<u64>>>>,
    pub crazy_array: Option<Vec<Option<Vec<Option<Vec<u64>>>>>>,
    pub object: AnotherType,
    pub opt_object: Option<AnotherType>,
    pub object_array: Vec<AnotherType>,
    pub opt_object_array: Option<Vec<AnotherType>>,
    pub en: CustomEnum,
    pub opt_en: Option<CustomEnum>,
    pub en_array: Vec<CustomEnum>,
    pub opt_en_array: Option<Vec<CustomEnum>>,
}

impl CustomType {
    pub fn to_buffer(object: Self) -> Vec<u8> {
        serialize_custom_type(object)
    }

    pub fn from_buffer(buffer: &[u8]) -> Self {
        deserialize_custom_type(buffer)
    }

    pub fn write<W: Write>(object: Self, writer: W) {
        write_custom_type(object, writer);
    }

    pub fn read<R: Read>(reader: R) -> Self {
        read_custom_type(reader).expect("Failed to read CustomType")
    }
}
