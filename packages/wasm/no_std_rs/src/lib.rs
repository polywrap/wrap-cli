//! Polywrap Rust/WASM Runtime Library

#![no_std]

extern crate alloc;
extern crate std;
use std::alloc::{GlobalAlloc, Layout, System};

struct PolywrapAlloc;

unsafe impl GlobalAlloc for PolywrapAlloc {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        System.alloc(layout)
    }

    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        System.dealloc(ptr, layout)
    }
}

#[global_allocator]
static GLOBAL: PolywrapAlloc = PolywrapAlloc;

pub mod abort;
pub mod invoke;
pub mod memory;
pub mod msgpack;
pub mod subinvoke;

pub use msgpack::{
    context::Context, read::Read, read_decoder::ReadDecoder, write::Write,
    write_encoder::WriteEncoder, write_sizer::WriteSizer,
};
