use alloc::{boxed::Box, string::String, vec::Vec};
use serde_json::{self, value::Value};
pub mod serialization;
use polywrap_wasm_rs::{
    Read,
    Write,
};
pub use serialization::{
    deserialize_custom_type,
    read_custom_type,
    serialize_custom_type,
    write_custom_type,
};

use num_bigint::BigInt;
use crate::AnotherType;
use crate::CustomEnum;

#[derive(Clone, Debug)]
pub struct CustomType {
    pub str: String,
    pub opt_str: Option<String>,
    pub u: u32,
    pub opt_u: Option<u32>,
    pub u8: u8,
    pub u16: u16,
    pub u32: u32,
    pub i: i32,
    pub i8: i8,
    pub i16: i16,
    pub i32: i32,
    pub bigint: BigInt,
    pub opt_bigint: Option<BigInt>,
    pub json: Value,
    pub opt_json: Option<Value>,
    pub bytes: Vec<u8>,
    pub opt_bytes: Option<Vec<u8>>,
    pub boolean: bool,
    pub opt_boolean: Option<bool>,
    pub u_array: Vec<u32>,
    pub u_opt_array: Option<Vec<u32>>,
    pub opt_u_opt_array: Option<Vec<Option<u32>>>,
    pub opt_str_opt_array: Option<Vec<Option<String>>>,
    pub u_array_array: Vec<Vec<u32>>,
    pub u_opt_array_opt_array: Vec<Option<Vec<Option<u32>>>>,
    pub u_array_opt_array_array: Vec<Option<Vec<Vec<u32>>>>,
    pub crazy_array: Option<Vec<Option<Vec<Vec<Option<Vec<u32>>>>>>>,
    pub object: Box<AnotherType>,
    pub opt_object: Option<Box<AnotherType>>,
    pub object_array: Vec<Box<AnotherType>>,
    pub opt_object_array: Option<Vec<Option<Box<AnotherType>>>>,
    pub en: CustomEnum,
    pub opt_enum: Option<CustomEnum>,
    pub enum_array: Vec<CustomEnum>,
    pub opt_enum_array: Option<Vec<Option<CustomEnum>>>,
}

impl CustomType {
    pub fn to_buffer(input: &CustomType) -> Vec<u8> {
        serialize_custom_type(input)
    }

    pub fn from_buffer(input: &[u8]) -> CustomType {
        deserialize_custom_type(input)
    }

    pub fn write<W: Write>(input: &CustomType, writer: &mut W) {
        write_custom_type(input, writer);
    }

    pub fn read<R: Read>(reader: &mut R) -> CustomType {
        read_custom_type(reader).expect("Failed to read CustomType")
    }
}
