//! # The Polywrap Rust/WASM Runtime Library
//!
//! Polywrap is a WASM-standard developer tool for integrating Web3 protocols into applications.
//! It makes it possible for applications on any platform, written in any language,
//! to read and write data to Web3 protocols.
//! This eliminates the need for client-side SDKs, making dapps lightweight and multi-platform.
//!
//! This library is the Rust implementation of the Polywrap WASM runtime.
//! (There's another implementation in AssemblyScript)
//!
//! **Warning** The library is still in rapid development and everything may change until 1.0 is shipped.
//!
//! ## Usage
//!
//! To use the `polywrap-wasm-rs`, add the following line to your `Cargo.toml`:
//!
//! ```toml
//! [dependencies.polywrap-wasm-rs]
//! polywrap-wasm-rs = "0.0.1-prealpha.57"
//! ```
//!
//! Then, import the crate into your module/file with the `use` keyword:
//!
//! ```rust
//! use polywrap_wasm_rs;
//! ```
//!
//! ## Features
//!
//! - Pure Rust implementation of MessagePack
//! - Clear error handling
//! - Unambiguous foreign function interfaces
//! - Robust and battle-tested

pub mod abort;
pub mod big_int;
pub mod debug;
pub mod get_implementations;
pub mod invoke;
pub mod json;
pub mod malloc;
pub mod msgpack;
pub mod subinvoke;

pub use abort::*;
pub use get_implementations::*;
pub use invoke::*;
pub use subinvoke::*;

pub use big_int::BigInt;
pub use json::JSON;
pub use msgpack::{Context, Format, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
