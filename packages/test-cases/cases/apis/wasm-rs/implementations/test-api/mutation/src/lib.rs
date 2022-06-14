pub mod w3;
pub use w3::*;

pub fn mutation_method(input: InputMutationMethod) -> u8 {
    input.arg
}

pub fn abstract_mutation_method(input: InputAbstractMutationMethod) -> u8 {
    input.arg
}
