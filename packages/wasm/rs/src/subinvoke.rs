// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// Subinvoke API
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
extern "C" {
    fn __w3_subinvoke(
        uri_ptr: u32,
        uri_len: u32,
        module_ptr: u32,
        module_len: u32,
        method_ptr: u32,
        method_len: u32,
        input_ptr: u32,
        input_len: u32,
    ) -> bool;
}

/// Subinvoke Result
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
extern "C" {
    fn __w3_subinvoke_result_len() -> u32;
    fn __w3_subinvoke_result(ptr: u32);
}

/// Subinvoke Error
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
extern "C" {
    fn __w3_subinvoke_error_len() -> u32;
    fn __w3_subinvoke_error(ptr: u32);
}

/// Subinvoke API Helper
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn w3_subinvoke(
    _uri: String,
    _module: String,
    _method: String,
    _input: Vec<u8>
) -> Vec<u8> {
    todo!()
}
