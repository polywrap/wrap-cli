use template_plugin_rs::SamplePlugin;
use polywrap_core::{
    client::ClientConfig,
    resolvers::{
        static_resolver::{StaticResolver, StaticResolverLike},
        uri_resolution_context::UriPackage,
    },
    uri::Uri,
};
use polywrap_msgpack::{msgpack};
use polywrap_plugin::{package::PluginPackage};
use polywrap_client::{
    client::PolywrapClient,
};
use std::{
    sync::{Arc, Mutex},
};

fn get_client() -> PolywrapClient {
    let sample_plugin = SamplePlugin {};
    let plugin_pkg: PluginPackage = sample_plugin.into();
    let package = Arc::new(Mutex::new(plugin_pkg));

    let resolver = StaticResolver::from(vec![StaticResolverLike::Package(UriPackage {
        uri: Uri::try_from("plugin/sample").unwrap(),
        package,
    })]);

    PolywrapClient::new(ClientConfig {
        resolver: Arc::new(resolver),
        interfaces: None,
        envs: None,
    })
}

#[test]
fn sample_method() {
    let response = get_client()
        .invoke::<String>(
            &Uri::try_from("plugin/sample").unwrap(),
            "sampleMethod",
            Some(&msgpack!({
                "data": "input data",
            })),
            None,
            None,
        )
        .unwrap();
    assert_eq!(response, "input data from sample_method");
}
