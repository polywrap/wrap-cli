pub mod wrap;
use wrap::module::{EnvTrait, IModule, Module};
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

impl IModule for Module {
    fn method_no_env(&self, args: ArgsMethodNoEnv) -> Result<String, String> {
        Ok(args.arg)
    }

    fn method_require_env(&self, _: ArgsMethodRequireEnv) -> Result<Env, String> {
        create_env(self.env.clone())
    }

    fn method_optional_env(&self, _: ArgsMethodOptionalEnv) -> Result<Option<Env>, String> {
        Ok(self.env.clone())
    }

    fn subinvoke_env_method(&self, _: ArgsSubinvokeEnvMethod) -> Result<CompoundEnv, String> {
        match self.env.clone() {
            Some(env) => match ExternalEnvApiModule::external_env_method(&(imported::ArgsExternalEnvMethod {})) {
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
