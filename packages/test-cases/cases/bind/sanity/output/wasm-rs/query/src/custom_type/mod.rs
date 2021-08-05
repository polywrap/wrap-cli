pub mod serialization;
use crate::{AnotherType, CustomEnum};
use crate::{Read, Write};
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};
pub use serialization::{
    deserialize_custom_type, read_custom_type, serialize_custom_type, write_custom_type,
};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CustomType {
    pub str: String,
    pub opt_str: Option<String>,
    pub u: u32,
    pub opt_u: Option<u32>,
    pub u8: u8,
    pub u16: u16,
    pub u32: u32,
    pub u64: u64,
    pub i: i32,
    pub i8: i8,
    pub i16: i16,
    pub i32: i32,
    pub i64: i64,
    pub bigint: BigInt,
    pub opt_bigint: Option<BigInt>,
    pub bytes: Vec<u8>,
    pub opt_bytes: Option<Vec<u8>>,
    pub boolean: bool,
    pub opt_boolean: Option<bool>,
    pub u_array: Vec<u32>,
    pub u_opt_array: Option<Vec<u32>>,
    pub opt_u_opt_array: Option<Vec<Option<u32>>>,
    pub opt_str_opt_array: Option<Vec<Option<String>>>,
    pub u_array_array: Vec<Vec<u32>>,
    pub u_opt_array_opt_array: Vec<Option<Vec<u64>>>,
    pub u_array_opt_array_array: Vec<Option<Vec<Vec<u64>>>>,
    pub crazy_array: Option<Vec<Option<Vec<Option<Vec<u64>>>>>>,
    pub object: AnotherType,
    pub opt_object: Option<AnotherType>,
    pub object_array: Vec<AnotherType>,
    pub opt_object_array: Option<Vec<Option<AnotherType>>>,
    pub en: CustomEnum,
    pub opt_enum: Option<CustomEnum>,
    pub enum_array: Vec<CustomEnum>,
    pub opt_enum_array: Option<Vec<Option<CustomEnum>>>,
}

impl CustomType {
    pub fn to_buffer(object: &CustomType) -> Vec<u8> {
        serialize_custom_type(object)
    }

    pub fn from_buffer(buffer: &[u8]) -> CustomType {
        deserialize_custom_type(buffer)
    }

    pub fn write<W: Write>(object: &CustomType, writer: &mut W) {
        write_custom_type(object, writer);
    }

    pub fn read<R: Read>(reader: &mut R) -> CustomType {
        read_custom_type(reader).expect("Failed to read CustomType")
    }
}
