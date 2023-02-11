pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module, EnvTrait};

impl ModuleTrait for Module {
  fn external_env_method(&self, _: ArgsExternalEnvMethod) -> Result<Env, String> {
    match self.env.clone() {
      Some(env) => Ok(env),
      None => Err("Env not found!".to_string())
    }
  }
}
