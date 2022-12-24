pub mod wrap;
pub use wrap::*;
use wrap::module::{IModule, Module};

impl IModule for Module {
    fn bytes_method(&self, args: ArgsBytesMethod) -> Result<Vec<u8>, String> {
        match String::from_utf8(args.arg.prop) {
            Ok(s) => Ok(String::into_bytes([&s, " Sanity!"].concat())),
            Err(_e) => Err(_e.to_string()),
        }
    }
}
