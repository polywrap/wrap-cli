use crate::{
    module_method_wrapped,
    object_method_wrapped,
    optional_env_method_wrapped
};
use polywrap_wasm_rs::{
    abort,
    invoke,
    InvokeArgs,
};

#[cfg(feature = "wrap-invoke")]
#[no_mangle]
pub extern "C" fn _wrap_invoke(method_size: u32, args_size: u32, env_size: u32) -> bool {
    // Ensure the abort handler is properly setup
    abort::wrap_abort_setup();

    let args: InvokeArgs = invoke::wrap_invoke_args(method_size, args_size);

    match args.method.as_str() {
        "moduleMethod" => invoke::wrap_invoke(args, env_size, Some(module_method_wrapped)),
        "objectMethod" => invoke::wrap_invoke(args, env_size, Some(object_method_wrapped)),
        "optionalEnvMethod" => invoke::wrap_invoke(args, env_size, Some(optional_env_method_wrapped)),
        _ => invoke::wrap_invoke(args, env_size, None),
    }
}
