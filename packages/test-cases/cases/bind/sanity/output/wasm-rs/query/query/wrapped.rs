use crate::{
    deserialize_query_method_args,
    serialize_query_method_result,
    deserialize_object_method_args,
    serialize_object_method_result,
};

pub fn query_method_wrapped(args_buf: &[u8]) -> Vec<u8> {
    let args = deserialize_query_method_args(args_buf).unwrap();
    query_method(TODO)
    serialize_query_method_result(result)
}

pub fn object_method_wrapped(args_buf: &[u8]) -> Vec<u8> {
    let object_method = deserialize_object_method_args(args_buf).unwrap();
    serialize_object_method_result(&object_method.opt_object)
}
