pub mod w3;
use w3::*;
pub use w3::entry;

fn method(input: InputMethod) -> String {
  format!("{}{}", input.arg.prop_a, input.arg.prop_b)
}
