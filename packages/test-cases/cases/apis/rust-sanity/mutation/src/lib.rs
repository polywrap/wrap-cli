pub mod w3;
pub use w3::entry;
use w3::*;

fn method(input: InputMethod) -> String {
    format!("{}", input.arg)
}
