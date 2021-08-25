pub mod w3;
use w3::*;

pub fn method(input: InputMethod) -> String {
  input.arg.prop_a
}
