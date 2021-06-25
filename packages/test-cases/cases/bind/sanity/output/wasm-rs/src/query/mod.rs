use crate::{abort, invoke};
use wasm_bindgen::prelude::*;

mod another_type;
mod custom_enum;
mod custom_type;
mod imported;
mod queries;

pub use another_type::AnotherType;
pub use custom_enum::CustomEnum;
pub use custom_type::CustomType;
pub use queries::{object_method_wrapped, query_method_wrapped};
pub use queries::{InputObjectMethod, InputQueryMethod};

pub use imported::{TestImportAnotherObject, TestImportEnum, TestImportObject, TestImportQuery};

#[wasm_bindgen]
pub fn _w3_init() {
    invoke::w3_add_invoke("query_method", query_method_wrapped);
    invoke::w3_add_invoke("object_method", object_method_wrapped);
}

#[wasm_bindgen]
pub fn _w3_invoke(method_size: u32, args_size: u32) -> bool {
    invoke::w3_invoke(method_size, args_size)
}

#[wasm_bindgen]
pub fn w3_abort(msg: &str, file: &str, line: u32, column: u32) {
    abort::w3_abort(msg, file, line, column);
}