pub mod wrapx;
pub use wrapx::*;

pub fn method(args: ArgsMethod) -> i32 {
    args.arg1
}
