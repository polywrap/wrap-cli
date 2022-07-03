use serde::{Serialize, Deserialize};
pub mod serialization;
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
    DecodeError,
    EncodeError,
    Read,
    Write,
    JSON,
};
pub use serialization::{
    deserialize_env,
    read_env,
    serialize_env,
    write_env
};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Env {
    pub prop: String,
    pub opt_prop: Option<String>,
    pub opt_map: Option<Map<String, Option<i32>>>,
}

impl Env {
    pub fn new() -> Env {
        Env {
            prop: String::new(),
            opt_prop: None,
            opt_map: Map::<String, Option<i32>>::new(),
        }
    }

    pub fn to_buffer(args: &Env) -> Result<Vec<u8>, EncodeError> {
        serialize_env(args).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn from_buffer(args: &[u8]) -> Result<Env, DecodeError> {
        deserialize_env(args).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }

    pub fn write<W: Write>(args: &Env, writer: &mut W) -> Result<(), EncodeError> {
        write_env(args, writer).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<Env, DecodeError> {
        read_env(reader).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }
}
