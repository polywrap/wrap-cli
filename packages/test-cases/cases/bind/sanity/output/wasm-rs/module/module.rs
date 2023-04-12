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

use crate::Env;
use crate::{
    CustomEnum,
};
use crate::AnotherType;
use crate::Else;

pub struct Module;

pub trait ModuleTrait {
  fn module_method(args: ArgsModuleMethod) -> Result<i32, String>;

  fn object_method(args: ArgsObjectMethod, env: Env) -> Result<Option<AnotherType>, String>;

  fn optional_env_method(args: ArgsOptionalEnvMethod, env: Option<Env>) -> Result<Option<AnotherType>, String>;

  fn _if(args: ArgsIf) -> Result<Else, String>;
}
