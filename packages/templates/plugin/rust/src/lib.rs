use std::sync::Arc;
use polywrap_core::invoke::Invoker;
use polywrap_plugin::error::PluginError;
use polywrap_plugin::creator::plugin_impl;
use wrap::{
    module::{ArgsSampleMethod, Module},
};
use crate::wrap::wrap_info::get_manifest;
pub mod wrap;

#[derive(Debug)]
pub struct SamplePlugin {
    default_value: String
}

#[plugin_impl]
impl Module for SamplePlugin {
    fn sample_method(&mut self, args: &ArgsSampleMethod, _invoker: Arc<dyn Invoker>) -> Result<String, PluginError> {
        Ok(format!("{}{}", args.data, self.default_value))
    }
}

impl SamplePlugin {
    pub fn new(value: String) -> Self {
        SamplePlugin {
            default_value: value
        }
    }
}

#[cfg(test)]
mod tests {
    use std::sync::{Arc, Mutex};
    use polywrap_client::client::PolywrapClient;
    use polywrap_client_builder::types::{BuilderConfig, ClientBuilder, ClientConfigHandler};
    use polywrap_core::resolvers::uri_resolution_context::UriPackage;
    use polywrap_core::uri::Uri;
    use polywrap_msgpack::msgpack;
    use polywrap_plugin::package::PluginPackage;

    use super::SamplePlugin;

    #[test]
    fn sample_method() {
        let plugin_uri = Uri::try_from("plugin/sample-plugin").unwrap();
        let mut builder = BuilderConfig::new(None);
        let sample_plugin = SamplePlugin::new(
            String::from("foo bar")
        );
        let plugin_package: PluginPackage = sample_plugin.into();
        let uri_package = UriPackage {
            uri: plugin_uri.clone(),
            package: Arc::new(Mutex::new(plugin_package))
        };
        builder.add_package(uri_package);
        let client = PolywrapClient::new(builder.build());

        let invoke_result = client.invoke::<String>(
            &plugin_uri,
            "sampleMethod",
            Some(&msgpack!({ "data": "fuz baz " })),
            None,
            None
        ).unwrap();

        assert_eq!(invoke_result, "fuz baz foo bar")
    }
}