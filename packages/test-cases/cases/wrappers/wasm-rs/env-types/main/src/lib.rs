pub mod wrap;
pub use wrap::*;

fn create_env(env: Env) -> Env {
  Env {
    str: env.str,
    opt_str: env.opt_str,
    opt_filled_str: env.opt_filled_str,
    number: env.number,
    opt_number: env.opt_number,
    bool: env.bool,
    opt_bool: env.opt_bool,
    en: env.en,
    opt_enum: env.opt_enum,
    object: env.object,
    opt_object: env.opt_object,
    array: env.array,
  }
}

pub fn method_no_env(input: InputMethodNoEnv) -> String {
  input.arg
}

pub fn method_require_env(_: InputMethodRequireEnv, env: Env) -> Env {
  create_env(env)
}

pub fn method_optional_env(input: InputMethodOptionalEnv, env: Option<Env>) -> Option<Env> {
  match env {
    Some(e) => Some(create_env(e)),
    None => None
  }
}

pub fn subinvoke_env_method(input: InputSubinvokeEnvMethod, env: Env) -> CompoundEnv {
  let external_env: ExternalEnvApiEnv = ExternalEnvApiModule::external_env_method(&(imported::InputExternalEnvMethod {})).unwrap();
  
  return CompoundEnv {
    local: env,
    external: external_env
  };
}
