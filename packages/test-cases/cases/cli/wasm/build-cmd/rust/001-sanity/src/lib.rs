pub mod wrap;
pub use wrap::*;

impl ModuleTrait for Module {
  fn method(&self, args: wrap::module::ArgsMethod) -> Result<String, String> {
    Ok(args.arg)
  }
}
