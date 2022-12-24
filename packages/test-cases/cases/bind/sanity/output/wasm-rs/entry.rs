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

    let mut module = Module::__new__();
    let args: InvokeArgs = invoke::wrap_invoke_args(method_size, args_size);

    match args.method.as_str() {
        "moduleMethod" => {
            let result = module_method_wrapped(&mut module, args.args.as_slice(), env_size);
            invoke::wrap_invoke_result(result);
            true
        }
        "objectMethod" => {
            let result = object_method_wrapped(&mut module, args.args.as_slice(), env_size);
            invoke::wrap_invoke_result(result);
            true
        }
        "optionalEnvMethod" => {
            let result = optional_env_method_wrapped(&mut module, args.args.as_slice(), env_size);
            invoke::wrap_invoke_result(result);
            true
        }
        "if" => {
            let result = if_wrapped(&mut module, args.args.as_slice(), env_size);
            invoke::wrap_invoke_result(result);
            true
        }
        _ => {
            invoke::wrap_invoke_error(format!("Could not find invoke function {}", args.method));
            false
        }
    }
}
