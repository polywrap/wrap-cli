use crate::malloc::alloc;

#[link(wasm_import_module = "wrap")]
extern "C" {
    /// Subinvoke Interface
    #[link_name = "__wrap_subinvoke"]
    pub fn __wrap_subinvoke(
        uri_ptr: u32,
        uri_len: u32,
        method_ptr: u32,
        method_len: u32,
        args_ptr: u32,
        args_len: u32,
    ) -> bool;

    /// Subinvoke Result
    #[link_name = "__wrap_subinvoke_result_len"]
    pub fn __wrap_subinvoke_result_len() -> u32;

    #[link_name = "__wrap_subinvoke_result"]
    pub fn __wrap_subinvoke_result(ptr: u32);

    /// Subinvoke Error
    #[link_name = "__wrap_subinvoke_error_len"]
    pub fn __wrap_subinvoke_error_len() -> u32;

    #[link_name = "__wrap_subinvoke_error"]
    pub fn __wrap_subinvoke_error(ptr: u32);
}

/// Subinvoke Interface Helper
pub fn wrap_subinvoke(
    uri: &str,
    method: &str,
    args: Vec<u8>,
) -> Result<Vec<u8>, String> {
    let uri_buf = uri.as_bytes();
    let method_buf = method.as_bytes();

    let success = unsafe {
        __wrap_subinvoke(
            uri_buf.as_ptr() as u32,
            uri_buf.len() as u32,
            method_buf.as_ptr() as u32,
            method_buf.len() as u32,
            args.as_ptr() as u32,
            args.len() as u32,
        )
    };
    if !success {
        let error_len = unsafe { __wrap_subinvoke_error_len() };
        let error_len_ptr = alloc(error_len as usize);
        unsafe { __wrap_subinvoke_error(error_len_ptr as u32) };
        let error = unsafe {
            String::from_raw_parts(error_len_ptr, error_len as usize, error_len as usize)
        };
        return Err(error);
    }
    let result_len = unsafe { __wrap_subinvoke_result_len() };
    let result_len_ptr = alloc(result_len as usize);
    unsafe { __wrap_subinvoke_result(result_len_ptr as u32) };
    let result_buf =
        unsafe { Vec::from_raw_parts(result_len_ptr, result_len as usize, result_len as usize) };
    Ok(result_buf)
}
