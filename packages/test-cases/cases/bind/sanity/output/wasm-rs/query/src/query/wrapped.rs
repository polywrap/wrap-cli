use crate::{
    deserialize_object_method_args, deserialize_query_method_args, serialize_object_method_result,
    serialize_query_method_result,
};
use crate::{object_method, query_method, InputObjectMethod, InputQueryMethod};

pub fn query_method_wrapped(args_buf: &[u8]) -> Vec<u8> {
    let args = deserialize_query_method_args(args_buf).expect("Failed to deserialize buffer");
    let result = query_method(InputQueryMethod {
        str: args.str,
        opt_str: args.opt_str,
        en: args.en,
        opt_enum: args.opt_enum,
        enum_array: args.enum_array,
        opt_enum_array: args.opt_enum_array,
    });
    serialize_query_method_result(result)
}

pub fn object_method_wrapped(args_buf: &[u8]) -> Vec<u8> {
    let args = deserialize_object_method_args(args_buf).expect("Failed to deserialize buffer");
    let result = object_method(InputObjectMethod {
        object: args.object,
        opt_object: args.opt_object,
        object_array: args.object_array,
        opt_object_array: args.opt_object_array,
    });
    serialize_object_method_result(result)
}
