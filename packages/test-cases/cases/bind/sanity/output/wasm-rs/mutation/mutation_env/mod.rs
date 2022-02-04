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
    deserialize_mutation_env,
    read_mutation_env,
    serialize_mutation_env,
    write_mutation_env
};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct MutationEnv {
    pub mutation_prop: String,
    pub prop: String,
    pub opt_prop: Option<String>
}

impl MutationEnv {
    pub fn new() -> MutationEnv {
        MutationEnv {
            mutation_prop: String::new(),
            prop: String::new(),
            opt_prop: None,
        }
    }

    pub fn to_buffer(input: &MutationEnv) -> Result<Vec<u8>, EncodeError> {
        serialize_mutation_env(input)
    }

    pub fn from_buffer(input: &[u8]) -> Result<MutationEnv, DecodeError> {
        deserialize_mutation_env(input)
    }

    pub fn write<W: Write>(input: &MutationEnv, writer: &mut W) -> Result<(), EncodeError> {
        write_mutation_env(input, writer)
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<MutationEnv, DecodeError> {
        read_mutation_env(reader)
    }
}
