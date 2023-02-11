pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn method(&self, args: ArgsMethod) -> Result<LargeCollection, String> {
        Ok(args.large_collection)
    }
}
