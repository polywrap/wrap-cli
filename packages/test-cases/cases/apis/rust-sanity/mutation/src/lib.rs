pub mod w3;
pub use w3::*;

pub fn method(input: InputMethod) -> String {
    format!("{}", input.arg)
}
