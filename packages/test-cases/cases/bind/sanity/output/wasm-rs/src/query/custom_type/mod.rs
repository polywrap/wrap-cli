use super::AnotherType;
use super::CustomEnum;
use crate::{Read, Write};
use num_bigint::BigInt;

#[derive(Debug)]
pub struct CustomType {
    string: String,
    opt_string: Option<String>,
    unsigned: u32,
    opt_unsigned: Option<u32>,
    uint8: u8,
    uint16: u16,
    uint32: u32,
    uint64: u64,
    int8: i8,
    int16: i16,
    int32: i32,
    int64: i64,
    opt_bigint: Option<BigInt>,
    bytes: Vec<u8>,
    opt_bytes: Option<Vec<u8>>,
    boolean: bool,
    opt_boolean: Option<bool>,
    u_array: Vec<u32>,
    u_opt_array: Vec<Option<u32>>,
    opt_u_opt_array: Option<Option<Vec<u32>>>,
    opt_str_opt_array: Option<Option<Vec<String>>>,
    u_array_array: Vec<Vec<u32>>,
    u_opt_array_opt_array: Vec<Option<Vec<u64>>>,
    u_array_opt_array_array: Vec<Option<Vec<Vec<u64>>>>,
    crazy_array: Option<Vec<Option<Vec<Option<Vec<u64>>>>>>,
    object: AnotherType<T>,
    opt_object: Option<AnotherType<T>>,
    object_array: Vec<AnotherType<T>>,
    opt_object_array: Option<Vec<AnotherType<T>>>,
    custom_enum: CustomEnum,
    opt_custom_enum: Option<CustomEnum>,
    enum_array: Vec<CustomEnum>,
    opt_enum_array: Option<Vec<CustomEnum>>,
}

impl CustomType {
    pub fn to_buffer(&mut self) -> Vec<u8> {
        todo!()
    }

    pub fn from_buffer(&mut self) -> Self {
        todo!()
    }

    pub fn write<W: Write>(&mut self, writer: W) {
        todo!()
    }

    pub fn read<R: Read>(&mut self, reader: R) -> Self {
        todo!()
    }
}
