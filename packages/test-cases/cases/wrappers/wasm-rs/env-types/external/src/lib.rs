pub mod wrap;
pub use wrap::*;
use wrap::module::{IModule, Module, EnvTrait};

impl IModule for Module {
  fn external_env_method(&self, _: ArgsExternalEnvMethod) -> Result<Env, String> {
    match self.env.clone() {
      Some(env) => Ok(env),
      None => Err("Env not found!".to_string())
    }
  }
}
