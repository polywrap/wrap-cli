pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module, EnvTrait};

impl ModuleTrait for Module {
  fn external_env_method(&self, _: ArgsExternalEnvMethod, env: Option<Env>) -> Result<Env, String> {
    match env {
      Some(e) => Ok(e),
      None => Err("Env not found!".to_string())
    }
  }
}
