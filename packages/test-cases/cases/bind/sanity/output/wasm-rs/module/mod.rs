pub mod wrapped;
pub use wrapped::{
    module_method_wrapped,
    object_method_wrapped
};
pub mod serialization;
pub use serialization::{
    deserialize_module_method_args,
    serialize_module_method_result,
    ArgsModuleMethod,
    deserialize_object_method_args,
    serialize_object_method_result,
    ArgsObjectMethod
};
