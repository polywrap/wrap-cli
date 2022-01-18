pub mod w3;
pub use w3::*;
use w3::entry::w3_abort;

pub fn throw_error(input: InputThrowError) -> String {
    match input.arg {
        Some(s) => s,
        None => {
            w3_abort();
            panic!("Panic here...");
        }
    }
}
