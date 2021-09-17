// extern crate alloc;
// use alloc::{string::String, vec::Vec};
use polywrap_wasm_rs::memory::internal_alloc;

type InvokeFunction = fn(args_buf: &[u8]) -> Vec<u8>;

pub struct InvokeArgs {
    pub method: String,
    pub args: Vec<u8>,
}

fn w3_invoke_args(method_size: u32, args_size: u32) -> InvokeArgs {
    let method_buf_ptr = internal_alloc(method_size as usize);
    let args_buf_ptr = internal_alloc(args_size as usize);

    let method = unsafe {
        String::from_raw_parts(method_buf_ptr, method_size as usize, method_size as usize)
    };
    let args = unsafe { Vec::from_raw_parts(args_buf_ptr, args_size as usize, args_size as usize) };

    InvokeArgs { method, args }
}

/// Helper for handling _w3_invoke
fn w3_invoke(_options: InvokeArgs, opt_invoke_func: Option<InvokeFunction>) -> bool {
    if opt_invoke_func.is_some() {
        if let Some(_func) = opt_invoke_func {
            true
        } else {
            false
        }
    } else {
        false
    }
}

fn method_name(input: &[u8]) -> Vec<u8> {
    input.to_vec()
}

#[test]
fn it_compiles_sanity() {
    let invoke_args = w3_invoke_args(10, 10);
    assert!(w3_invoke(invoke_args, Some(method_name)))
}
