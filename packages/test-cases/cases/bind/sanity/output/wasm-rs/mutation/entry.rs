use crate::{
    mutation_method_wrapped,
    object_method_wrapped
};
use polywrap_wasm_rs::{
    abort,
    invoke,
    InvokeArgs
};

// mutation_w3_invoke
#[no_mangle]
pub fn _w3_invoke(method_size: u32, args_size: u32) -> bool {
    let args: InvokeArgs = invoke::w3_invoke_args(method_size, args_size);

    match args.method.as_str() {
        "mutationMethod" => invoke::w3_invoke(args, Some(mutation_method_wrapped)),
        "objectMethod" => invoke::w3_invoke(args, Some(object_method_wrapped)),
        _ => invoke::w3_invoke(args, None),
    }
}

#[no_mangle]
pub fn w3_abort() {
    abort::w3_abort();
}
