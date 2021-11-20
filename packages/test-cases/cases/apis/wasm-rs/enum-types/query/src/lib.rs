pub mod w3;
pub use w3::*;

pub fn method1(input: InputSanityEnumMethod1) -> SanityEnum {
    input.en
}

pub fn method2(input: InputSanityEnumMethod2) -> Vec<SanityEnum> {
    input.enum_array
}
