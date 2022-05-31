pub mod w3;
pub use w3::*;

pub fn query_implementations() -> Vec<String> {
  Interface::get_implementations()
}

pub fn query_method(input: InputQueryMethod) -> ImplementationType {
    input.arg
}

pub fn abstract_query_method(input: InputAbstractQueryMethod) -> String {
  input.arg.str
}
