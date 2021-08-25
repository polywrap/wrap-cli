pub mod w3;
use w3::*;

pub fn method(input: InputMethod) -> String {
  return input.arg.as_ref().prop_a;
}
