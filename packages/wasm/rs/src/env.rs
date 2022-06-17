use crate::invoke::InvokeFunction;
use crate::malloc::alloc;

#[link(wasm_import_module = "wrap")]
extern "C" {
    // Load Env Variables
    #[link_name = "__wrap_load_env"]
    pub fn __wrap_load_env(environment_ptr: u32);

    // Get Sanitized Env Arguments
    #[link_name = "__wrap_sanitize_env_args"]
    pub fn __wrap_sanitize_env_args(args_ptr: u32);

    // Set Sanitized Env Result
    #[link_name = "__wrap_sanitize_env_result"]
    pub fn __wrap_sanitize_env_result(ptr: u32, len: u32);
}

pub fn wrap_load_env(env_size: u32) -> Vec<u8> {
    let env_size_ptr = alloc(env_size as usize);
    let env_buf =
        unsafe { Vec::from_raw_parts(env_size_ptr, env_size as usize, env_size as usize) };
    unsafe { __wrap_load_env(env_buf.as_ptr() as u32) };
    env_buf
}

pub fn wrap_sanitize_env(args_size: u32, func: InvokeFunction) {
    let args_size_ptr = alloc(args_size as usize);
    let args_buf =
        unsafe { Vec::from_raw_parts(args_size_ptr, args_size as usize, args_size as usize) };
    unsafe { __wrap_sanitize_env_args(args_buf.as_ptr() as u32) };
    let result = func(&args_buf);
    let result_len = result.len() as u32;
    unsafe { __wrap_sanitize_env_result(result.as_ptr() as u32, result_len) };
}
