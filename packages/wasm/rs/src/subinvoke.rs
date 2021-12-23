use crate::memory::internal_alloc;

#[link(wasm_import_module = "w3")]
extern "C" {
    /// Subinvoke API
    #[link_name = "__w3_subinvoke"]
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
    #[link_name = "__w3_subinvoke_result_len"]
    pub fn __w3_subinvoke_result_len() -> u32;

    #[link_name = "__w3_subinvoke_result"]
    pub fn __w3_subinvoke_result(ptr: u32);

    /// Subinvoke Error
    #[link_name = "__w3_subinvoke_error_len"]
    pub fn __w3_subinvoke_error_len() -> u32;

    #[link_name = "__w3_subinvoke_error"]
    pub fn __w3_subinvoke_error(ptr: u32);
}

/// Subinvoke API Helper
#[allow(unused_unsafe)]
pub fn w3_subinvoke(
    uri: &str,
    module: &str,
    method: &str,
    input: Vec<u8>,
) -> Result<Vec<u8>, String> {
    let uri_buf = uri.as_bytes();
    let module_buf = module.as_bytes();
    let method_buf = method.as_bytes();

    let success = unsafe {
        __w3_subinvoke(
            uri_buf.as_ptr() as u32,
            uri_buf.len() as u32,
            module_buf.as_ptr() as u32,
            module_buf.len() as u32,
            method_buf.as_ptr() as u32,
            method_buf.len() as u32,
            input.as_ptr() as u32,
            input.len() as u32,
        )
    };
    if !success {
        let error_len = unsafe { __w3_subinvoke_error_len() };
        let error_buf_ptr = internal_alloc(error_len as usize);
        unsafe { __w3_subinvoke_error(error_buf_ptr as u32) };
        let error = unsafe {
            String::from_raw_parts(error_buf_ptr, error_len as usize, error_len as usize)
        };
        return Err(error);
    }
    let result_len = unsafe { __w3_subinvoke_result_len() };
    let result_buf_ptr = internal_alloc(result_len as usize);
    unsafe { __w3_subinvoke_result(result_buf_ptr as u32) };
    let result_buf =
        unsafe { Vec::from_raw_parts(result_buf_ptr, result_len as usize, result_len as usize) };
    Ok(result_buf)
}
