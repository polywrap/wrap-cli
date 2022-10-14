use thiserror::Error;

#[derive(Error, Debug)]
pub enum WrapperError {
  #[error("Wrapper does not contain a wasm module")]
  ModuleReadError,
  #[error("`{0}`")]
  FileReadError(#[from] std::io::Error),
  #[error("Invocation error: `{0}`")]
  InvokeError(String),
  #[error("`{0}`")]
  DecodeError(#[from] rmp_serde::decode::Error),
  #[error("`{0}`")]
  WasmRuntimeError(String),
  #[error("`{0}`")]
  ExportError(String)
}
