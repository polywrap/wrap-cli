pub mod wrap;
pub use wrap::*;
use wrap::module::{IModule, Module};

impl IModule for Module {
  fn get_env(&self, _: ArgsGetEnv) -> Result<Option<Env>, String> {
    Ok(self.env.clone())
  }
}
