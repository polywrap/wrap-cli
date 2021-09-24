//! Polywrap Rust/WASM Runtime Library

// #![no_std]
// #![feature(
//     alloc_error_handler,
//     default_alloc_error_handler,
//     core_intrinsics,
//     lang_items
// )]

extern crate alloc;
// extern crate wee_alloc;

// // Set up the global allocator.
// #[global_allocator]
// static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// #[panic_handler]
// #[lang = "panic_impl"]
// extern "C" fn panic(_: &core::panic::PanicInfo) -> ! {
//     core::intrinsics::abort();
// }

// #[lang = "eh_personality"]
// extern "C" fn eh_personality() {}

pub mod abort;
pub mod big_int;
pub mod invoke;
pub mod json;
pub mod memory;
pub mod msgpack;
pub mod subinvoke;

pub use big_int::BigInt;
pub use invoke::InvokeArgs;
pub use json::JSON;
pub use msgpack::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
