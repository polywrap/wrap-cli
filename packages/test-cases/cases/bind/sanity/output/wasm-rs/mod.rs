pub mod entry;
pub mod custom_type;
pub use custom_type::CustomType;
pub mod another_type;
pub use another_type::AnotherType;
pub mod custom_map_value;
pub use custom_map_value::CustomMapValue;
pub mod _else;
pub use _else::Else;
pub mod custom_enum;
pub use custom_enum::{
    get_custom_enum_key,
    get_custom_enum_value,
    sanitize_custom_enum_value,
    CustomEnum
};
pub mod _while;
pub use _while::{
    get_while_key,
    get_while_value,
    sanitize_while_value,
    While
};
pub mod env;
pub use env::Env;
pub mod imported;
pub use imported::test_import_object::TestImportObject;
pub use imported::test_import_another_object::TestImportAnotherObject;
pub use imported::test_import_enum::{
    get_test_import_enum_key,
    get_test_import_enum_value,
    sanitize_test_import_enum_value,
    TestImportEnum
};
pub use imported::test_import_enum_return::{
    get_test_import_enum_return_key,
    get_test_import_enum_return_value,
    sanitize_test_import_enum_return_value,
    TestImportEnumReturn
};
pub use imported::test_import_env::TestImportEnv;
pub use imported::test_import_module::TestImportModule;
pub mod test_import;
pub use test_import::TestImport;
pub mod module;
pub use module::{
    deserialize_module_method_args,
    serialize_module_method_result,
    module_method_wrapped,
    ArgsModuleMethod,
    deserialize_object_method_args,
    serialize_object_method_result,
    object_method_wrapped,
    ArgsObjectMethod,
    deserialize_optional_env_method_args,
    serialize_optional_env_method_result,
    optional_env_method_wrapped,
    ArgsOptionalEnvMethod,
    deserialize_if_args,
    serialize_if_result,
    if_wrapped,
    ArgsIf
};

// Override print!(...) & println!(...) macros
#[macro_export]
macro_rules! println { ($($args:tt)*) => { polywrap_wasm_rs::wrap_debug_log(format!($($args)*).as_str()); } }
#[macro_export]
macro_rules! print { ($($args:tt)*) => { polywrap_wasm_rs::wrap_debug_log(format!($($args)*).as_str()); } }
