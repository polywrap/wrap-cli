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
pub use std::collections::HashMap as Map;
