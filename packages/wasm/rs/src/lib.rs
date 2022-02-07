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
//! **Warning** The library is still in rapid development and everything may change until 1.0 is
//! shipped.
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

#![deny(dead_code)]
#![deny(unreachable_code)]
#![deny(rustdoc::broken_intra_doc_links)]

pub mod abort;
pub mod debug;
pub mod env;
pub mod get_implementations;
pub mod invoke;
pub mod malloc;
pub mod msgpack;
pub mod subinvoke;

pub use msgpack::{
    Context, DecodeError, EncodeError, EnumTypeError, Read, ReadDecoder, Write, WriteEncoder,
    WriteSizer,
};

pub use num_bigint::BigInt;
pub use serde_json as JSON;
