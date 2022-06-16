pub mod wrap;
pub use wrap::*;

pub fn bool_method(input: InputBoolMethod) -> bool {
    input.arg
}

pub fn int_method(input: InputIntMethod) -> i32 {
    input.arg
}

pub fn u_int_method(input: InputUIntMethod) -> u32 {
    input.arg
}

pub fn bytes_method(input: InputBytesMethod) -> Vec<u8> {
    input.arg
}

pub fn array_method(input: InputArrayMethod) -> Option<Vec<String>> {
    Some(input.arg)
}
