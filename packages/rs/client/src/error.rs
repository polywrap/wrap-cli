use thiserror::Error;

#[derive(Error, Debug)]
pub enum WrapperError {
  #[error("`{0}`")]
  ModuleReadError(String),
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
