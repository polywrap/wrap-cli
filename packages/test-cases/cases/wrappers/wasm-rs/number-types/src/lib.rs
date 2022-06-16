pub mod wrap;
pub use wrap::*;

pub fn i8_method(input: InputI8Method) -> i8 {
    input.first + input.second
}

pub fn u8_method(input: InputU8Method) -> u8 {
    input.first + input.second
}

pub fn i16_method(input: InputI16Method) -> i16 {
    input.first + input.second
}

pub fn u16_method(input: InputU16Method) -> u16 {
    input.first + input.second
}

pub fn i32_method(input: InputI32Method) -> i32 {
    input.first + input.second
}

pub fn u32_method(input: InputU32Method) -> u32 {
    input.first + input.second
}
