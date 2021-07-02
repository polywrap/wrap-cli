#[link(wasm_import_module = "w3")]
extern "C" {
    /// Subinvoke API
    pub fn __w3_subinvoke(
        uri_ptr: u32,
        uri_len: u32,
        module_ptr: u32,
        module_len: u32,
        method_ptr: u32,
        method_len: u32,
        input_ptr: u32,
        input_len: u32,
    ) -> bool;

    /// Subinvoke Result
    pub fn __w3_subinvoke_result_len() -> u32;
    pub fn __w3_subinvoke_result(ptr: u32);

    /// Subinvoke Error
    pub fn __w3_subinvoke_error_len() -> u32;
    pub fn __w3_subinvoke_error(ptr: u32);
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

    let uri_buf_u32 = uri_buf.as_ptr() as u32;
    let module_buf_u32 = module_buf.as_ptr() as u32;
    let method_buf_u32 = method_buf.as_ptr() as u32;
    let input_u32 = input.as_ptr() as u32;

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
        let message_buf_u32 = message_buf.as_ptr() as u32;
        unsafe { __w3_subinvoke_error(message_buf_u32) };
        let message = std::str::from_utf8(message_buf.as_slice()).unwrap();
        return Err(message.to_string());
    }
    let result_len = unsafe { __w3_subinvoke_result_len() };
    let result_buf: Vec<u8> = Vec::with_capacity(result_len as usize);
    let result_buf_u32 = result_buf.as_ptr() as u32;
    unsafe { __w3_subinvoke_result(result_buf_u32) };
    Ok(result_buf)
}
