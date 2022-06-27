pub mod wrap;
pub use wrap::*;

pub fn method1(args: ArgsMethod1) -> SanityEnum {
    args.en
}

pub fn method2(args: ArgsMethod2) -> Vec<SanityEnum> {
    args.enum_array
}
