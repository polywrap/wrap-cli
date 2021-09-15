//! Polywrap Rust/WASM Runtime Library

#![no_std]

extern crate alloc;
extern crate std;

pub mod abort;
pub mod invoke;
pub mod memory;
pub mod msgpack;
pub mod subinvoke;

pub use msgpack::{
    context::Context, read::Read, read_decoder::ReadDecoder, write::Write,
    write_encoder::WriteEncoder, write_sizer::WriteSizer,
};
