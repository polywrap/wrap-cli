use crate::{
    query_method_wrapped,
    object_method_wrapped
};
use web3api_wasm_rs::{
    abort,
    invoke,
    InvokeArgs,
};

#[cfg(feature = "w3-invoke")]
#[no_mangle]
pub extern "C" fn _w3_invoke(method_size: u32, args_size: u32) -> bool {
    // Ensure the abort handler is properly setup
    abort::w3_abort_setup();

    let args: InvokeArgs = invoke::w3_invoke_args(method_size, args_size);

    match args.method.as_str() {
        "queryMethod" => invoke::w3_invoke(args, Some(query_method_wrapped)),
        "objectMethod" => invoke::w3_invoke(args, Some(object_method_wrapped)),
        _ => invoke::w3_invoke(args, None),
    }
}
