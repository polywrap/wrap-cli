use crate::{
    mutation_method_wrapped,
    object_method_wrapped
};
use polywrap_wasm_rs::{
    abort,
    invoke,
    InvokeArgs
};
use wasm_bindgen::prelude::*;

// mutation_w3_invoke
#[no_mangle]
#[wasm_bindgen]
pub extern "C" fn _w3_invoke(method_size: u32, args_size: u32) -> bool {
    // Ensure the abort handler is properly setup
    abort::w3_abort_setup();

    let args: InvokeArgs = invoke::w3_invoke_args(method_size, args_size);

    match args.get_method().as_str() {
        "mutationMethod" => invoke::w3_invoke(args, Some(mutation_method_wrapped)),
        "objectMethod" => invoke::w3_invoke(args, Some(object_method_wrapped)),
        _ => invoke::w3_invoke(args, None),
    }
}
