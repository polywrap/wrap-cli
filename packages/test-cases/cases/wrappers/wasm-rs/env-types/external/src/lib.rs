pub mod wrap;
pub use wrap::*;

pub fn external_env_method(_: ArgsExternalEnvMethod, env: Env) -> Env {
  env
}
