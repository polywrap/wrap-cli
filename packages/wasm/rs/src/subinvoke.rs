use wasm_bindgen::prelude::*;

/// Subinvoke API
#[wasm_bindgen(module = "w3")]
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
#[wasm_bindgen(module = "w3")]
extern "C" {
    fn __w3_subinvoke_result_len() -> u32;
    fn __w3_subinvoke_result(ptr: u32);
}

/// Subinvoke Error
#[wasm_bindgen(module = "w3")]
extern "C" {
    fn __w3_subinvoke_error_len() -> u32;
    fn __w3_subinvoke_error(ptr: u32);
}

/// Subinvoke API Helper
#[allow(unused_unsafe)]
pub fn w3_subinvoke(
    uri: String,
    module: String,
    method: String,
    input: Vec<u8>,
) -> Result<Vec<u8>, String> {
    let uri_buf = uri.as_bytes();
    let module_buf = module.as_bytes();
    let method_buf = method.as_bytes();

    let uri_buf_u32 = uri_buf.iter().fold(0, |result, &bit| (result << 1) ^ bit) as u32;
    let module_buf_u32 = module_buf
        .iter()
        .fold(0, |result, &bit| (result << 1) ^ bit) as u32;
    let method_buf_u32 = method_buf
        .iter()
        .fold(0, |result, &bit| (result << 1) ^ bit) as u32;
    let input_u32 = input
        .as_slice()
        .iter()
        .fold(0, |result, &bit| (result << 1) ^ bit) as u32;

    let success = unsafe {
        __w3_subinvoke(
            uri_buf_u32,
            uri_buf.len() as u32,
            module_buf_u32,
            module_buf.len() as u32,
            method_buf_u32,
            method_buf.len() as u32,
            input_u32,
            input.len() as u32,
        )
    };
    if !success {
        let error_len = unsafe { __w3_subinvoke_error_len() };
        let message_buf: Vec<u8> = Vec::with_capacity(error_len as usize);
        let message_buf_u32 = message_buf
            .as_slice()
            .iter()
            .fold(0, |result, &bit| (result << 1) ^ bit) as u32;
        unsafe { __w3_subinvoke_error(message_buf_u32) };
        let message = std::str::from_utf8(message_buf.as_slice()).unwrap();
        return Err(message.to_string());
    }
    let result_len = unsafe { __w3_subinvoke_result_len() };
    let result_buf: Vec<u8> = Vec::with_capacity(result_len as usize);
    let result_buf_u32 = result_buf
        .as_slice()
        .iter()
        .fold(0, |result, &bit| (result << 1) ^ bit) as u32;
    unsafe { __w3_subinvoke_result(result_buf_u32) };
    Ok(result_buf)
}
