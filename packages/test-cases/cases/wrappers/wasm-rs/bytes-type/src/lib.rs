pub mod wrap;
pub use wrap::*;

pub fn bytes_method(input: InputBytesMethod) -> Vec<u8> {
    let arg_str = match String::from_utf8(input.arg.prop) {
        Ok(s) => s,
        Err(_e) => panic!("Parsing error"),
    };
    String::into_bytes([&arg_str, " Sanity!"].concat())
}
