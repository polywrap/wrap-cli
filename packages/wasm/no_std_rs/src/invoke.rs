use crate::memory::internal_alloc;
use alloc::{format, string::String, vec::Vec};

#[link(wasm_import_module = "w3")]
extern "C" {
    /// Get Invoke Arguments
    pub fn __w3_invoke_args(method_ptr: u32, args_ptr: u32);

    /// Set Invoke Result
    pub fn __w3_invoke_result(ptr: u32, len: u32);

    /// Set Invoke Error
    pub fn __w3_invoke_error(ptr: u32, len: u32);

    pub fn __w3_log(ptr: u32, len: u32);
}

pub type InvokeFunction = fn(args_buf: &[u8]) -> Vec<u8>;

pub struct InvokeArgs {
    pub method: String,
    pub args: Vec<u8>,
}

#[allow(unused_unsafe)]
pub fn w3_invoke_args(method_size: u32, args_size: u32) -> InvokeArgs {
    let method_buf_ptr = internal_alloc(method_size as usize);
    let args_buf_ptr = internal_alloc(args_size as usize);

    unsafe { __w3_invoke_args(method_buf_ptr as u32, args_buf_ptr as u32) };

    let method = unsafe {
        String::from_raw_parts(method_buf_ptr, method_size as usize, method_size as usize)
    };
    let args = unsafe { Vec::from_raw_parts(args_buf_ptr, args_size as usize, args_size as usize) };

    unsafe { __w3_log(method.as_ptr() as u32, method.len() as u32) };

    InvokeArgs {
        method: method,
        args: args,
    }
}

/// Helper for handling _w3_invoke
#[allow(unused_unsafe)]
pub fn w3_invoke(options: InvokeArgs, opt_invoke_func: Option<InvokeFunction>) -> bool {
    unsafe { __w3_log(options.method.as_ptr() as u32, options.method.len() as u32) };
    if opt_invoke_func.is_some() {
        if let Some(func) = opt_invoke_func {
            let result = func(options.args.as_slice());
            let result_u32 = result.as_ptr() as u32;

            unsafe { __w3_invoke_result(result_u32, result.len() as u32) };
            true
        } else {
            false
        }
    } else {
        let message = format!("Could not find invoke function {}", options.method);
        let message_u32 = message.as_ptr() as u32;
        unsafe { __w3_invoke_error(message_u32, message.len() as u32) };
        false
    }
}
