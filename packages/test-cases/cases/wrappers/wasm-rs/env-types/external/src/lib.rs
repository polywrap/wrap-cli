pub mod wrap;
pub use wrap::*;

pub fn external_env_method(_: InputExternalEnvMethod, env: Env) -> Env {
  env
}
