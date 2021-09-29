use alloc::{
    boxed::Box,
    collections::BTreeMap,
    format,
    str::FromStr,
    string::{
        String,
        ToString,
    },
    vec,
    vec::Vec,
};
use crate::{
    object_method_wrapped,
    query_method_wrapped,
};
use polywrap_wasm_rs::{
    abort,
    invoke,
    InvokeArgs,
};

pub fn _w3_invoke(method_size: u32, args_size: u32) -> bool {
    let args: InvokeArgs = invoke::w3_invoke_args(method_size, args_size);

    match args.method.as_str() {
        "queryMethod" => invoke::w3_invoke(args, Some(query_method_wrapped)),
        "objectMethod" => invoke::w3_invoke(args, Some(object_method_wrapped)),
        _ => invoke::w3_invoke(args, None),
    }
}

pub fn w3_abort(msg: &str, file: &str, line: u32, column: u32) {
    abort::w3_abort(msg, file, line, column);
}