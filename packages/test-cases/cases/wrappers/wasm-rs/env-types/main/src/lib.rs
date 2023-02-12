pub mod wrap;
use wrap::module::{EnvTrait, ModuleTrait, Module};
pub use wrap::*;

fn create_env(env: Option<Env>) -> Result<Env, String> {
    match env {
        Some(e) => Ok(Env {
            str: e.str,
            opt_str: e.opt_str,
            opt_filled_str: e.opt_filled_str,
            number: e.number,
            opt_number: e.opt_number,
            bool: e.bool,
            opt_bool: e.opt_bool,
            en: e.en,
            opt_enum: e.opt_enum,
            object: e.object,
            opt_object: e.opt_object,
            array: e.array,
        }),
        None => Err("Env not set!".to_string()),
    }
}

impl ModuleTrait for Module {
    fn method_no_env(&self, args: ArgsMethodNoEnv) -> Result<String, String> {
        Ok(args.arg)
    }

    fn method_require_env(&self, _: ArgsMethodRequireEnv, env: Env) -> Result<Env, String> {
        create_env(env)
    }

    fn method_optional_env(&self, _: ArgsMethodOptionalEnv, env: Option<Env>) -> Result<Option<Env>, String> {
        Ok(env)
    }

    fn subinvoke_env_method(&self, _: ArgsSubinvokeEnvMethod, env: Option<Env>) -> Result<CompoundEnv, String> {
        match env {
            Some(env) => match ExternalEnvApModuleTrait::external_env_method(&(imported::ArgsExternalEnvMethod {})) {
                Ok(external_env) => Ok(CompoundEnv {
                    local: env,
                    external: external_env,
                }),
                Err(e) => Err(e),
            }
            None => Err("Env not set!".to_string()),
        }
    }
}
