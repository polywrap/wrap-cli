use serde::{Serialize, Deserialize};
pub mod serialization;
use polywrap_wasm_rs::{
    BigInt,
    DecodeError,
    EncodeError,
    Read,
    Write,
    JSON,
};
pub use serialization::{
    deserialize_query_env,
    read_query_env,
    serialize_query_env,
    write_query_env
};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct QueryEnv {
    pub query_prop: String,
    pub prop: String,
    pub opt_prop: Option<String>
}

impl QueryEnv {
    pub fn new() -> QueryEnv {
        QueryEnv {
            query_prop: String::new(),
            prop: String::new(),
            opt_prop: None,
        }
    }

    pub fn to_buffer(input: &QueryEnv) -> Result<Vec<u8>, EncodeError> {
        serialize_query_env(input)
    }

    pub fn from_buffer(input: &[u8]) -> Result<QueryEnv, DecodeError> {
        deserialize_query_env(input)
    }

    pub fn write<W: Write>(input: &QueryEnv, writer: &mut W) -> Result<(), EncodeError> {
        write_query_env(input, writer)
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<QueryEnv, DecodeError> {
        read_query_env(reader)
    }
}
