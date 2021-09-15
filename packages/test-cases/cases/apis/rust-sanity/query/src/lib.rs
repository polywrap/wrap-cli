#![no_std]

pub mod w3;
pub use w3::entry;
use w3::*;

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

use alloc::{format, string::String};

pub fn method(input: InputMethod) -> String {
    format!("{}{}", input.arg.prop_a, input.arg.prop_b)
}
