use crate::{
    module_method_wrapped,
    object_method_wrapped
};
use polywrap_wasm_rs::{
    abort,
    invoke,
    InvokeArgs,
};

#[no_mangle]
pub extern "C" fn _wrap_invoke(method_size: u32, args_size: u32) -> bool {
    // Ensure the abort handler is properly setup
    abort::wrap_abort_setup();

    let args: InvokeArgs = invoke::wrap_invoke_args(method_size, args_size);

    match args.method.as_str() {
        "moduleMethod" => invoke::wrap_invoke(args, Some(module_method_wrapped)),
        "objectMethod" => invoke::wrap_invoke(args, Some(object_method_wrapped)),
        _ => invoke::wrap_invoke(args, None),
    }
}
