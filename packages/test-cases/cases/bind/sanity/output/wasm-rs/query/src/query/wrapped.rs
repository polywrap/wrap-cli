use crate::{
    deserialize_object_method_args, deserialize_query_method_args, serialize_object_method_result,
    serialize_query_method_result,
};

pub fn query_method_wrapped(args_buf: &[u8]) -> Vec<u8> {
    let query_method = deserialize_query_method_args(args_buf).unwrap();
    let args = bincode::serialize(&query_method).expect("Failed to serialize InputQueryMethod");
    let result = args.as_ptr() as i32;
    serialize_query_method_result(result)
}

pub fn object_method_wrapped(args_buf: &[u8]) -> Vec<u8> {
    let object_method = deserialize_object_method_args(args_buf).unwrap();
    serialize_object_method_result(&object_method.opt_object)
}
