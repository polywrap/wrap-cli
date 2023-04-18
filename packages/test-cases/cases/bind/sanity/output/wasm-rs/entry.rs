use crate::{
    module_method_wrapped,
    object_method_wrapped,
    optional_env_method_wrapped,
    if_wrapped
};
use polywrap_wasm_rs::{
    abort,
    invoke,
    InvokeArgs,
};
use crate::module::Module;

#[no_mangle]
pub extern "C" fn _wrap_invoke(method_size: u32, args_size: u32, env_size: u32) -> bool {
    // Ensure the abort handler is properly setup
    abort::wrap_abort_setup();

    let args: InvokeArgs = invoke::wrap_invoke_args(method_size, args_size);
    let result: Vec<u8>;

    match args.method.as_str() {
        "moduleMethod" => {
            result = module_method_wrapped(args.args.as_slice(), env_size);
        }
        "objectMethod" => {
            result = object_method_wrapped(args.args.as_slice(), env_size);
        }
        "optionalEnvMethod" => {
            result = optional_env_method_wrapped(args.args.as_slice(), env_size);
        }
        "if" => {
            result = if_wrapped(args.args.as_slice(), env_size);
        }
        _ => {
            invoke::wrap_invoke_error(format!("Could not find invoke function {}", args.method));
            return false;
        }
    };
    invoke::wrap_invoke_result(result);
    return true;
}
