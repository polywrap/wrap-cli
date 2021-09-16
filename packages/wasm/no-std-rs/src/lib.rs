//! Polywrap Rust/WASM Runtime Library

#![no_std]
#![feature(alloc_error_handler)]

extern crate alloc;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[alloc_error_handler]
pub fn alloc_error_handler(_: core::alloc::Layout) -> ! {
    loop {}
}

#[panic_handler]
fn panic_handler(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}

// #[no_mangle]
// pub extern "C" fn _start() -> ! {
//     loop {}
// }

pub mod abort;
pub mod invoke;
pub mod memory;
pub mod msgpack;
pub mod subinvoke;

pub use msgpack::{
    context::Context, read::Read, read_decoder::ReadDecoder, write::Write,
    write_encoder::WriteEncoder, write_sizer::WriteSizer,
};
