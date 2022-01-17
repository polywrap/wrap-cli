use crate::malloc::malloc;
use crate::debug::w3_debug_log;

#[link(wasm_import_module = "w3")]
extern "C" {
    /// Get Invoke Arguments
    #[link_name = "__w3_invoke_args"]
    pub fn __w3_invoke_args(method_ptr: u32, args_ptr: u32);

    /// Set Invoke Result
    #[link_name = "__w3_invoke_result"]
    pub fn __w3_invoke_result(ptr: u32, len: u32);

    /// Set Invoke Error
    #[link_name = "__w3_invoke_error"]
    pub fn __w3_invoke_error(ptr: u32, len: u32);
}

pub type InvokeFunction = fn(args_buf: &[u8]) -> Vec<u8>;

pub struct InvokeArgs {
    pub method: String,
    pub args: Vec<u8>,
}

#[allow(unused_unsafe)]
pub fn w3_invoke_args(method_size: u32, args_size: u32) -> InvokeArgs {
    w3_debug_log("w3_invoke_args: 1");
    let method_size_ptr = malloc(method_size);
    w3_debug_log("w3_invoke_args: 2");
    let args_size_ptr = malloc(args_size);
    w3_debug_log("w3_invoke_args: 3");

    unsafe { __w3_invoke_args(method_size_ptr as u32, args_size_ptr as u32) };
    w3_debug_log("w3_invoke_args: 4");

    let method = unsafe {
        String::from_raw_parts(method_size_ptr, method_size as usize, method_size as usize)
    };
    w3_debug_log("w3_invoke_args: 4");
    let args =
        unsafe { Vec::from_raw_parts(args_size_ptr, args_size as usize, args_size as usize) };

    w3_debug_log("w3_invoke_args: 5");
    InvokeArgs { method, args }
}

/// Helper for handling _w3_invoke
#[allow(unused_unsafe)]
pub fn w3_invoke(options: InvokeArgs, opt_invoke_func: Option<InvokeFunction>) -> bool {
    w3_debug_log("w3_invoke: 1");
    if opt_invoke_func.is_some() {
        w3_debug_log("w3_invoke: 2");
        if let Some(func) = opt_invoke_func {
            w3_debug_log("w3_invoke: 3");
            let result = func(options.args.as_slice());
            w3_debug_log("w3_invoke: 4");

            unsafe { __w3_invoke_result(result.as_ptr() as u32, result.len() as u32) };
            w3_debug_log("w3_invoke: 5");
            true
        } else {
            w3_debug_log("w3_invoke: 6");
            false
        }
    } else {
        let message = ["Could not find invoke function ", &options.method].concat();
        w3_debug_log("w3_invoke: 7");
        unsafe { __w3_invoke_error(message.as_ptr() as u32, message.len() as u32) };
        w3_debug_log("w3_invoke: 8");
        false
    }
}
