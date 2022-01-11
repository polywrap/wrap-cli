//! Errors returned from I/O `Write` and `Read` operations

use num_derive::FromPrimitive;
use thiserror::Error;

/// Errors from encoding data
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum EncodingError {
	#[error("NilWriteError")]
	NilWriteError,

	#[error("FormatWriteError")]
	FormatWriteError,

	#[error("BooleanWriteError")]
	BooleanWriteError,

	#[error("BinWriteError")]
	BinWriteError,

	#[error("BigIntWriteError")]
	BigIntWriteError,

	#[error("Float32WriteError")]
	Float32WriteError,

	#[error("Float64WriteError")]
	Float64WriteError,

	#[error("Uint8WriteError")]
	Uint8WriteError,

	#[error("Uint16WriteError")]
	Uint16WriteError,

	#[error("Uint32WriteError")]
	Uint32WriteError,

	#[error("Uint64WriteError")]
	Uint64WriteError,

	#[error("Int8WriteError")]
	Int8WriteError,

	#[error("Int16WriteError")]
	Int16WriteError,

	#[error("Int32WriteError")]
	Int32WriteError,

	#[error("Int64WriteError")]
	Int64WriteError,

	#[error("StrWriteError")]
	StrWriteError,

	#[error("ArrayWriteError")]
	ArrayWriteError,

	#[error("MapWriteError")]
	MapWriteError,
}

impl From<EncodingError> for std::io::Error {
	fn from(e: EncodingError) -> Self {
		e.into()
	}
}

impl From<std::io::Error> for EncodingError {
	fn from(e: std::io::Error) -> Self {
		e.into()
	}
}

impl From<serde_json::Error> for EncodingError {
	fn from(e: serde_json::Error) -> EncodingError {
		e.into()
	}
}

/// Errors from decoding data
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum DecodingError {
	#[error("BytesReadError")]
	BytesReadError,

	#[error("ParseBigIntError")]
	ParseBigIntError,

	#[error("NilReadError")]
	NilReadError,

	#[error("FormatReadError")]
	FormatReadError,

	#[error("BooleanReadError")]
	BooleanReadError,

	#[error("BinReadError")]
	BinReadError,

	#[error("Float32ReadError")]
	Float32ReadError,

	#[error("Float64ReadError")]
	Float64ReadError,

	#[error("Uint8ReadError")]
	Uint8ReadError,

	#[error("Uint16ReadError")]
	Uint16ReadError,

	#[error("Uint32ReadError")]
	Uint32ReadError,

	#[error("Uint64ReadError")]
	Uint64ReadError,

	#[error("Int8ReadError")]
	Int8ReadError,

	#[error("Int16ReadError")]
	Int16ReadError,

	#[error("Int32ReadError")]
	Int32ReadError,

	#[error("Int64ReadError")]
	Int64ReadError,

	#[error("StrReadError")]
	StrReadError,

	#[error("ArrayReadError")]
	ArrayReadError,

	#[error("MapReadError")]
	MapReadError,

	#[error("UnknownFieldName")]
	UnknownFieldName,
}

impl From<DecodingError> for std::io::Error {
	fn from(e: DecodingError) -> Self {
		e.into()
	}
}

impl From<std::io::Error> for DecodingError {
	fn from(e: std::io::Error) -> Self {
		e.into()
	}
}

impl From<serde_json::Error> for DecodingError {
	fn from(e: serde_json::Error) -> DecodingError {
		e.into()
	}
}
