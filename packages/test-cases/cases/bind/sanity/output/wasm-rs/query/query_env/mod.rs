use serde::{Serialize, Deserialize};
pub mod serialization;
use polywrap_wasm_rs::{
    BigInt,
    DecodingError,
    EncodingError,
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

    pub fn to_buffer(input: &QueryEnv) -> Result<Vec<u8>, EncodingError> {
        serialize_query_env(input).map_err(|e| EncodingError::from(e))
    }

    pub fn from_buffer(input: &[u8]) -> Result<QueryEnv, DecodingError> {
        deserialize_query_env(input).map_err(|e| DecodingError::from(e))
    }

    pub fn write<W: Write>(input: &QueryEnv, writer: &mut W) -> Result<(), EncodingError> {
        write_query_env(input, writer).map_err(|e| EncodingError::from(e))
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<QueryEnv, DecodingError> {
        read_query_env(reader).map_err(|e| DecodingError::from(e))
    }
}
