use std::collections::HashMap;
#[link(wasm_import_module = "w3")]
extern "C" {
    /// Get Invoke Arguments
    pub fn __w3_invoke_args(method_ptr: u32, args_ptr: u32);

    /// Set Invoke Result
    pub fn __w3_invoke_result(ptr: u32, len: u32);

    /// Set Invoke Error
    pub fn __w3_invoke_error(ptr: u32, len: u32);
}

pub type InvokeFunction = fn(args_buf: &[u8]) -> Vec<u8>;

// Keep track of all invokable functions
#[derive(Clone)]
pub struct Invoke {
    invokes: HashMap<String, InvokeFunction>,
}

impl Invoke {
    pub fn new() -> Self {
        Self {
            invokes: HashMap::new(),
        }
    }
}

pub fn w3_add_invoke(method: &str, func: InvokeFunction) {
    let mut invoke = Invoke::new();
    invoke.invokes.insert(method.to_string(), func);
}

/// Helper for handling _w3_invoke
#[allow(unused_unsafe)]
pub fn w3_invoke(method_size: u32, args_size: u32) -> bool {
    let method_buf: Vec<u8> = Vec::with_capacity(method_size as usize);
    let args_buf: Vec<u8> = Vec::with_capacity(args_size as usize);

    let method_buf_u32 = method_buf.as_ptr() as u32;
    let args_buf_u32 = args_buf.as_ptr() as u32;

    unsafe { __w3_invoke_args(method_buf_u32, args_buf_u32) };

    let method = std::str::from_utf8(method_buf.as_slice()).unwrap();
    let invoke = Invoke::new();
    let opt_invoke_func = invoke.invokes.get(method);
    if opt_invoke_func.is_some() {
        let func = opt_invoke_func.unwrap();
        let result = func(args_buf.as_slice());
        let result_u32 = result.as_ptr() as u32;

        unsafe { __w3_invoke_result(result_u32, result.len() as u32) };
        return true;
    } else {
        let message = format!("Could not find invoke function {}", method);
        let message_u32 = message.as_ptr() as u32;
        unsafe { __w3_invoke_error(message_u32, message.len() as u32) };
        return false;
    }
}
