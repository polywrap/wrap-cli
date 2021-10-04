// Set up for no-std.
#![no_std]

// Currently, no_std requires the nightly compiler due to the crates that it uses.
#![feature(alloc_error_handler, core_intrinsics, lang_items)]

// Set up the global allocator.
extern crate alloc;
extern crate wee_alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Set up panic and error handlers
#[alloc_error_handler]
fn err_handler(_: core::alloc::Layout) -> ! {
    core::intrinsics::abort();
}

#[panic_handler]
#[lang = "panic_impl"]
extern "C" fn rust_begin_panic(_: &core::panic::PanicInfo) -> ! {
    core::intrinsics::abort();
}

#[lang = "eh_personality"]
extern "C" fn eh_personality() {}

use alloc::{
    format,
    string::String,
};

// pub mod w3;
// pub use w3::entry;
// use w3::*;
pub mod w3;
pub use w3::*;
pub use w3::query::*;
pub use w3::test_object::*;

pub fn method(input: InputMethod) -> String {
    format!("{}{}", input.arg.prop_a, input.arg.prop_b)
}
