pub mod wrap;
pub use wrap::*;

pub fn i8_method(args: ArgsI8Method) -> i8 {
    args.first + args.second
}

pub fn u8_method(args: ArgsU8Method) -> u8 {
    args.first + args.second
}

pub fn i16_method(args: ArgsI16Method) -> i16 {
    args.first + args.second
}

pub fn u16_method(args: ArgsU16Method) -> u16 {
    args.first + args.second
}

pub fn i32_method(args: ArgsI32Method) -> i32 {
    args.first + args.second
}

pub fn u32_method(args: ArgsU32Method) -> u32 {
    args.first + args.second
}
