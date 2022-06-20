pub mod wrap;
pub use wrap::*;

fn create_env(env: Env) -> Env {
  Env {
    str: env.str,
    optStr: env.optStr,
    optFilledStr: env.optFilledStr,
    number: env.number,
    optNumber: env.optNumber,
    bool: env.bool,
    optBool: env.optBool,
    en: env.en,
    optEnum: env.optEnum,
    object: env.object,
    optObject: env.optObject,
    array: env.array,
  }
}

pub fn method_no_env(input: InputMethodNoEnv) -> String {
  input.arg
}

pub fn method_require_env(input: InputMethodRequireEnv) -> Env {
  create_env(input.env)
}

pub fn method_optional_env(input: InputMethodOptionalEnv) -> Optional<Env> {
  if input.env {
    Some(create_env(input.env))
  } else {
    None()
  }
}
