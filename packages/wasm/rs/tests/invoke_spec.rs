use polywrap_wasm_rs::invoke::{w3_invoke, InvokeArgs};

pub fn method_name(input: &[u8]) -> Vec<u8> {
    input.to_vec()
}

#[test]
pub fn it_compiles_sanity() {
    let invoke_args = InvokeArgs {
        method: "method_name".to_string(),
        args: vec![0x1, 0x2, 0x3],
    };
    assert!(w3_invoke(invoke_args, Some(method_name)))
}
