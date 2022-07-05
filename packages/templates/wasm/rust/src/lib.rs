pub mod wrap;
pub use wrap::*;

pub fn simple_method(args: ArgsSimpleMethod) -> SimpleResult {
    return SimpleResult {
        value: args.arg
    };
}

