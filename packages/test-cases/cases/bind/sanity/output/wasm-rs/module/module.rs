use crate::{
    ArgsModuleMethod,
    ArgsObjectMethod,
    ArgsOptionalEnvMethod,
    ArgsIf,
};
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
    JSON,
};

use crate::{
    CustomEnum,
};
use crate::AnotherType;
use crate::Else;

pub struct Module {
  pub env: Option<Env>,
}

pub trait EnvTrait {
  fn __set_env__(&mut self, env: Env) -> ();
}

pub trait IModule {
  fn module_method(&self, args: ArgsModuleMethod) -> Result<i32, String>;

  fn object_method(&self, args: ArgsObjectMethod) -> Result<Option<AnotherType>, String>;

  fn optional_env_method(&self, args: ArgsOptionalEnvMethod) -> Result<Option<AnotherType>, String>;

  fn _if(&self, args: ArgsIf) -> Result<Else, String>;
}

impl Module {
  pub fn __new__() -> Module {
    Module {
      env: None,
    }
  }
}

impl EnvTrait for Module {
  fn __set_env__(&mut self, env: Env) -> () {
    self.env = Some(env);
  }
}
