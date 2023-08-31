use template_wasm_rs::wrap::module::ArgsSampleMethod;
use polywrap::{
    PolywrapClient,
    PolywrapClientConfig,
    polywrap_core::uri::Uri,
};
use polywrap_msgpack_serde::to_vec;
use std::path::Path;

fn get_client() -> PolywrapClient {
    let mut config = PolywrapClientConfig::new();
    PolywrapClient::new(config.into())
}

pub fn get_wrap_uri() -> Result<Uri, String> {
    let path = Path::new("../build")
        .canonicalize()
        .map_err(|e| e.to_string())?
        .into_os_string()
        .into_string()
        .map_err(|e| format!("{e:?}"))?;
    let uri = Uri::try_from(path).map_err(|e| e.to_string())?;
    Ok(uri)
}

#[test]
fn sample_method() {
    let uri = get_wrap_uri().unwrap();
    let args = ArgsSampleMethod {
        arg: "input data".to_string(),
    };
    let encoded_args = to_vec(&args).unwrap();

    let response = get_client()
        .invoke::<String>(&uri, "sampleMethod", Some(&encoded_args), None, None)
        .unwrap();

    assert_eq!(response, "input data from sample_method");
}
