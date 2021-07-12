pub mod serialization;
pub mod wrapped;

pub use crate::{
    AnotherType,
    CustomEnum,
};
pub use serialization::{
    deserialize_object_method_args,
    deserialize_query_method_args,
    serialize_object_method_result,
    serialize_query_method_result,
};
pub use serialization::{
    InputObjectMethod,
    InputQueryMethod,
};
