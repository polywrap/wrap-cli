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
//! <https://docs.polywrap.io/>

#![deny(dead_code)]
#![deny(unreachable_code)]
#![deny(rustdoc::broken_intra_doc_links)]

pub mod abort;
pub mod debug;
pub mod debug_log;
pub mod env;
pub mod get_implementations;
pub mod invoke;
pub mod malloc;
pub mod msgpack;
pub mod subinvoke;

pub use abort::*;
pub use debug::*;
pub use debug_log::*;
pub use env::*;
pub use get_implementations::*;
pub use invoke::*;
pub use subinvoke::*;

pub use msgpack::{
    DecodeError, EncodeError, EnumTypeError, Read, ReadDecoder, Write, WriteEncoder,
};

pub use num_bigint::BigInt;
pub use bigdecimal::BigDecimal as BigNumber;
pub use serde_json as JSON;
pub use std::collections::BTreeMap as Map;
