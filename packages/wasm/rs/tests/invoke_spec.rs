// FIXME: cannot call #[wasm_bindgen] imports on non-wasm targets

use web3api_wasm_rs::invoke;

fn method_name(input: &[u8]) -> Vec<u8> {
    input.to_vec()
}

#[test]
fn it_compiles_sanity() {
    invoke::w3_add_invoke("method_name", method_name);
    assert!(invoke::w3_invoke(1, 1));
}
