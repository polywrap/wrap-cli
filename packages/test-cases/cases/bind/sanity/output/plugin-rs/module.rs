/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

use std::sync::Arc;
use polywrap_core::invoke::Invoker;
use polywrap_plugin::error::PluginError;
use polywrap_plugin::module::PluginModule;
use serde::{Serialize, Deserialize};
use super::types::*;
use async_trait::async_trait;
pub use polywrap_plugin::impl_plugin_traits;

#[macro_export]
macro_rules! impl_traits {
    ($plugin_type:ty) => {
        $crate::wrap::module::impl_plugin_traits!(
            $plugin_type,
            $crate::wrap::wrap_info::get_manifest(),
            (module_method, $crate::wrap::module::ArgsModuleMethod),
            (object_method, $crate::wrap::module::ArgsObjectMethod),
            (optional_env_method, $crate::wrap::module::ArgsOptionalEnvMethod),
            (_if, $crate::wrap::module::ArgsIf),
        );
    };
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsModuleMethod {
    pub str: String,
    pub opt_str: Option<String>,
    pub en: CustomEnum,
    pub opt_enum: Option<CustomEnum>,
    pub enum_array: Vec<CustomEnum>,
    pub opt_enum_array: Option<Vec<Option<CustomEnum>>>,
    pub map: Map<String, i32>,
    pub map_of_arr: Map<String, Vec<i32>>,
    pub map_of_map: Map<String, Map<String, i32>>,
    pub map_of_obj: Map<String, AnotherType>,
    pub map_of_arr_of_obj: Map<String, Vec<AnotherType>>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsObjectMethod {
    pub object: AnotherType,
    pub opt_object: Option<AnotherType>,
    pub object_array: Vec<AnotherType>,
    pub opt_object_array: Option<Vec<Option<AnotherType>>>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsOptionalEnvMethod {
    pub object: AnotherType,
    pub opt_object: Option<AnotherType>,
    pub object_array: Vec<AnotherType>,
    pub opt_object_array: Option<Vec<Option<AnotherType>>>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsIf {
    #[serde(rename = "if")]
    pub _if: Else,
}

#[async_trait]
pub trait Module: PluginModule {
  async fn module_method(&mut self, args: &ArgsModuleMethod, invoker: Arc<dyn Invoker>) -> Result<i32, PluginError>;

  async fn object_method(&mut self, args: &ArgsObjectMethod, invoker: Arc<dyn Invoker>) -> Result<Option<AnotherType>, PluginError>;

  async fn optional_env_method(&mut self, args: &ArgsOptionalEnvMethod, invoker: Arc<dyn Invoker>) -> Result<Option<AnotherType>, PluginError>;

  async fn _if(&mut self, args: &ArgsIf, invoker: Arc<dyn Invoker>) -> Result<Else, PluginError>;
}
