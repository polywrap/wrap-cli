use template_plugin_rs::SamplePlugin;
use template_plugin_rs::wrap::module::ArgsSampleMethod;
use polywrap::{
    Client,
    ClientConfig,
    ClientConfigBuilder,
    Uri,
};
use polywrap_plugin::{package::PluginPackage};
use polywrap_msgpack_serde::to_vec;
use std::{
    sync::{Arc},
};

fn get_client() -> Client {
    let sample_plugin = SamplePlugin {};
    let plugin_pkg = PluginPackage::<SamplePlugin>::from(sample_plugin);

    let mut config = ClientConfig::new();
    config.add_package(
        Uri::try_from("plugin/sample").unwrap(),
        Arc::new(plugin_pkg)
    );

    Client::new(config.into())
}

#[test]
fn sample_method() {
    let response = get_client()
        .invoke::<String>(
            &Uri::try_from("plugin/sample").unwrap(),
            "sampleMethod",
            Some(&to_vec(&ArgsSampleMethod {
                data: "input data".to_string(),
            }).unwrap()),
            None,
            None,
        )
        .unwrap();
    assert_eq!(response, "input data from sample_method");
}
