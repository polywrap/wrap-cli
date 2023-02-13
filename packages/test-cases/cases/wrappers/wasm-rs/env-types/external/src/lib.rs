pub mod wrap;
pub use wrap::*;

impl ModuleTrait for Module {
  fn external_env_method(&self, _: ArgsExternalEnvMethod, env: Env) -> Result<Env, String> {
    Ok(env)
  }
}
