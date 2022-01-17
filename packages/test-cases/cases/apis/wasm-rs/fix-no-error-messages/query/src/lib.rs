pub mod w3;
pub use w3::*;

#[macro_use]
use w3::entry::w3_panic;

pub fn throw_error(input: InputThrowError) -> String {
    w3_panic!("hello from throw_error");
    "Hello".to_string()
}
