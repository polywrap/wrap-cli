pub mod wrap;
pub use wrap::*;

pub fn i8_method(args: ArgsI8Method) -> i8 {
    args.first + args.second
}
