use crate::malloc::malloc;

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
    let success = unsafe {
        __w3_subinvoke(
            uri.as_ptr() as u32,
            uri.len() as u32,
            module.as_ptr() as u32,
            module.len() as u32,
            method.as_ptr() as u32,
            method.len() as u32,
            input.as_ptr() as u32,
            input.len() as u32,
        )
    };
    if !success {
        let error_len = unsafe { __w3_subinvoke_error_len() };
        let error_len_ptr = malloc(error_len);
        unsafe { __w3_subinvoke_error(error_len_ptr as u32) };
        let error = unsafe {
            let res = std::slice::from_raw_parts(error_len_ptr, error_len as usize);
            String::from_utf8_lossy(res).to_string()
        };
        return Err(error);
    }
    let result_len = unsafe { __w3_subinvoke_result_len() };
    let result_len_ptr = malloc(result_len);
    unsafe { __w3_subinvoke_result(result_len_ptr as u32) };
    let result_buf = unsafe {
        let res = std::slice::from_raw_parts(result_len_ptr, result_len as usize);
        res.to_vec()
    };
    Ok(result_buf)
}
