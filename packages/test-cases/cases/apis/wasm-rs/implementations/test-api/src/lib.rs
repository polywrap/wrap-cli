pub mod polywrap;
pub use polywrap::*;

pub fn module_method(input: InputModuleMethod) -> ImplementationType {
    input.arg
}

pub fn abstract_module_method(input: InputAbstractModuleMethod) -> String {
    input.arg.str
}
