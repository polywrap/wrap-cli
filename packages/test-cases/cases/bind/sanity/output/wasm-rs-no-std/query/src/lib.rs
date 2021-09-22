#![no_std]

extern crate alloc;
use alloc::boxed::Box;
pub mod common;
pub mod custom_type;
pub mod entry;
pub use custom_type::CustomType;
pub mod another_type;
pub use another_type::AnotherType;
pub mod custom_enum;
pub use custom_enum::{
    get_custom_enum_key, get_custom_enum_value, sanitize_custom_enum_value, CustomEnum,
};
pub mod imported;
pub use imported::test_import_another_object::TestImportAnotherObject;
pub use imported::test_import_enum::{
    get_test_import_enum_key, get_test_import_enum_value, sanitize_test_import_enum_value,
    TestImportEnum,
};
pub use imported::test_import_object::TestImportObject;
pub use imported::test_import_query::TestImportQuery;
pub mod query;
pub use query::{
    deserialize_object_method_args, deserialize_query_method_args, object_method_wrapped,
    query_method_wrapped, serialize_object_method_result, serialize_query_method_result,
    InputObjectMethod, InputQueryMethod,
};

/**
TEMPORARY
 */
pub fn object_method(_: InputObjectMethod) -> Option<Box<AnotherType>> {
    unimplemented!()
}
pub fn query_method(_: InputQueryMethod) -> i32 {
    unimplemented!()
}
