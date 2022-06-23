pub mod wrap;
pub use wrap::*;

pub fn method(input: InputMethod) -> LargeCollection {
    input.large_collection
}
