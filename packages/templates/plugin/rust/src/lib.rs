use crate::wrap::wrap_info::get_manifest;
use polywrap_core::invoke::Invoker;
use polywrap_plugin::{error::PluginError, implementor::plugin_impl, JSON};
use wrap::{
    module::{ArgsSampleMethod, Module},
};
use std::{sync::Arc};
pub mod wrap;

#[derive(Debug)]
pub struct SamplePlugin {}

#[plugin_impl]
impl Module for SamplePlugin {
    fn sample_method(
        &mut self,
        args: &ArgsSampleMethod,
        _: Arc<dyn Invoker>,
    ) -> Result<String, PluginError> {
        Ok(format!("{:} from sample_method", args.data).to_string())
    }
}
