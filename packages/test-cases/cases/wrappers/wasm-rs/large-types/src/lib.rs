pub mod wrap;
pub use wrap::*;
use wrap::module::{IModule, Module};

impl IModule for Module {
    fn method(&self, args: ArgsMethod) -> Result<LargeCollection, String> {
        Ok(args.large_collection)
    }
}
