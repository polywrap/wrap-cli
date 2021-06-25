// FIXME: cannot call #[wasm_bindgen] imports on non-wasm targets
use polywrap_wasm_rs::invoke;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen_test::wasm_bindgen_test;

#[wasm_bindgen]
pub fn method_name(input: &[u8]) -> Vec<u8> {
    input.to_vec()
}

#[wasm_bindgen_test]
pub fn it_compiles_sanity() {
    invoke::w3_add_invoke("method_name", method_name);
    assert!(invoke::w3_invoke(1, 1));
}
