extern crate alloc;

use alloc::string::String;
pub mod w3;
pub use w3::*;

pub fn bytes_method(input: InputBytesMethod) -> Vec<u8> {
    let arg_str = String::from_utf8(input.arg.prop).unwrap();
    let sanity_str = [&arg_str, " Sanity!"].concat();
    String::into_bytes(sanity_str)
}
