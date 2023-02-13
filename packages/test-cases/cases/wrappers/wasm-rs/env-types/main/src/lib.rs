pub mod wrap;
pub use wrap::*;

impl ModuleTrait for Module {
    fn method_no_env(&self, args: ArgsMethodNoEnv) -> Result<String, String> {
        Ok(args.arg)
    }

    fn method_require_env(&self, _: ArgsMethodRequireEnv, env: Env) -> Result<Env, String> {
        Ok(env)
    }

    fn method_optional_env(
        &self,
        _: ArgsMethodOptionalEnv,
        env: Option<Env>,
    ) -> Result<Option<Env>, String> {
        Ok(env)
    }

    fn subinvoke_env_method(
        &self,
        _: ArgsSubinvokeEnvMethod,
        env: Env,
    ) -> Result<CompoundEnv, String> {
        match ExternalEnvApiModule::external_env_method(&(imported::ArgsExternalEnvMethod {})) {
            Ok(external_env) => Ok(CompoundEnv {
                local: env,
                external: external_env,
            }),
            Err(e) => Err(e),
        }
    }
}
