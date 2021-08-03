pub use polywrap_wasm_rs::{
    abort, invoke, subinvoke, Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer,
};

pub mod another_type;
pub mod common;
pub mod custom_enum;
pub mod custom_type;
pub mod entry;
pub mod imported;
pub mod query;

pub use another_type::AnotherType;
pub use custom_enum::{
    get_custom_enum_key, get_custom_enum_value, sanitize_custom_enum_value, CustomEnum,
};
pub use custom_type::CustomType;
pub use imported::test_import_another_object::TestImportAnotherObject;
pub use imported::test_import_enum::{
    get_test_import_enum_key, get_test_import_enum_value, sanitize_test_import_enum_value,
    TestImportEnum,
};
pub use imported::test_import_object::TestImportObject;
pub use imported::test_import_query::TestImportQuery;
pub use query::{
    deserialize_object_method_args, deserialize_query_method_args, object_method_wrapped,
    query_method_wrapped, serialize_object_method_result, serialize_query_method_result,
    InputObjectMethod, InputQueryMethod,
};

// Temporary "imaginary" query_method()
pub fn query_method(_input: InputQueryMethod) -> i32 {
    unimplemented!()
}

// Temporary "imaginary" object_method()
pub fn object_method(_input: InputObjectMethod) -> Option<AnotherType> {
    unimplemented!()
}
