pub mod wrap;
pub use wrap::prelude::*;

impl ModuleTrait for Module {
  fn method(args: ArgsMethod) -> Result<String, String> {
    Ok(args.arg)
  }
}
