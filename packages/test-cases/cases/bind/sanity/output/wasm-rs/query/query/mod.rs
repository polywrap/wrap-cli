pub mod wrapped;
pub use wrapped::{
    query_method_wrapped,
    object_method_wrapped
};
pub mod serialization;
pub use serialization::{
    deserialize_query_method_args,
    serialize_query_method_result,
    InputQueryMethod,
    deserialize_object_method_args,
    serialize_object_method_result,
    InputObjectMethod
};
