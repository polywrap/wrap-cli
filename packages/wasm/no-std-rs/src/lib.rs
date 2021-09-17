//! Polywrap Rust/WASM Runtime Library

#![cfg_attr(not(test), no_std)]
#![feature(
    alloc_error_handler,
    default_alloc_error_handler,
    core_intrinsics,
    lang_items
)]

// Set up the global allocator.
extern crate alloc;
extern crate wee_alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg(not(test))]
#[panic_handler]
// #[lang = "panic_impl"]
extern "C" fn panic(_: &core::panic::PanicInfo) -> ! {
    core::intrinsics::abort();
}

#[cfg(not(test))]
#[lang = "eh_personality"]
extern "C" fn eh_personality() {}

pub mod abort;
pub mod invoke;
pub mod memory;
pub mod msgpack;
pub mod subinvoke;

pub use msgpack::{
    context::Context, read::Read, read_decoder::ReadDecoder, write::Write,
    write_encoder::WriteEncoder, write_sizer::WriteSizer,
};
