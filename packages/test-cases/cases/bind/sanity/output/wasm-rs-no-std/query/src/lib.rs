#![no_std]
#![feature(
    alloc_error_handler,
    default_alloc_error_handler,
    core_intrinsics,
    lang_items
)]

extern crate alloc;
extern crate wee_alloc;

// Set up the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// #[panic_handler]
// // #[lang = "panic_impl"]
// extern "C" fn panic(_: &core::panic::PanicInfo) -> ! {
//     core::intrinsics::abort();
// }

// #[lang = "eh_personality"]
// extern "C" fn eh_personality() {}

use alloc::{
    boxed::Box,
    collections::BTreeMap,
    format,
    str::FromStr,
    string::{String, ToString},
    vec,
    vec::Vec,
};

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
