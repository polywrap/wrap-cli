pub mod wrap;
pub use wrap::*;

pub fn method(args: ArgsMethod) -> LargeCollection {
    args.large_collection
}
