pub mod wrapped;
pub use wrapped::{object_method_wrapped, query_method_wrapped};
pub mod serialization;
pub use serialization::{
    deserialize_object_method_args, deserialize_query_method_args, serialize_object_method_result,
    serialize_query_method_result, InputObjectMethod, InputQueryMethod,
};
