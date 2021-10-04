#![no_std]

extern crate alloc;

pub mod common;
pub mod entry;
pub mod another_type;
pub use another_type::AnotherType;
pub mod custom_type;
pub use custom_type::CustomType;
pub mod custom_enum;
pub use custom_enum::{
    get_custom_enum_key,
    get_custom_enum_value,
    sanitize_custom_enum_value,
    CustomEnum,
};
pub mod imported;
pub use imported::test_import_object::TestImportObject;
pub use imported::test_import_another_object::TestImportAnotherObject;
pub use imported::test_import_enum::{
    get_test_import_enum_key,
    get_test_import_enum_value,
    sanitize_test_import_enum_value,
    TestImportEnum,
};
pub use imported::test_import_query::TestImportQuery;
pub use imported::test_import_mutation::TestImportMutation;
pub mod mutation;
pub use mutation::{
    deserialize_mutation_method_args,
    serialize_mutation_method_result,
    mutation_method_wrapped,
    InputMutationMethod,
    deserialize_object_method_args,
    serialize_object_method_result,
    object_method_wrapped,
    InputObjectMethod,
};