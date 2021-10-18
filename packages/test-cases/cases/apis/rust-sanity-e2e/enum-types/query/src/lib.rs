pub mod w3;
pub use w3::*;

pub fn sanity_enum_method1(input: InputSanityEnumMethod1) -> SanityEnum {
    input.en
}

pub fn sanity_enum_method2(input: InputSanityEnumMethod2) -> Vec<SanityEnum> {
    input.enum_array
}
