pub mod wrap;
pub use wrap::*;
pub use wrap::module::{Module, IModule};

impl IModule for Module {
  fn method(&self, args: wrap::module::ArgsMethod) -> Result<String, String> {
    Ok(args.arg)
  }
}
