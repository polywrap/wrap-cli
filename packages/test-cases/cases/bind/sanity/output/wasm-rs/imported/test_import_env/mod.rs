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
    deserialize_test_import_env,
    read_test_import_env,
    serialize_test_import_env,
    write_test_import_env
};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TestImportEnv {
    pub enviro_prop: String,
}

impl TestImportEnv {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn new() -> TestImportEnv {
        TestImportEnv {
            enviro_prop: String::new(),
        }
    }

    pub fn to_buffer(args: TestImportEnv) -> Result<Vec<u8>, EncodeError> {
        serialize_test_import_env(args).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn from_buffer(args: &[u8]) -> Result<TestImportEnv, DecodeError> {
        deserialize_test_import_env(args).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }

    pub fn write<W: Write>(args: TestImportEnv, writer: &mut W) -> Result<(), EncodeError> {
        write_test_import_env(args, writer).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<TestImportEnv, DecodeError> {
        read_test_import_env(reader).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }
}
