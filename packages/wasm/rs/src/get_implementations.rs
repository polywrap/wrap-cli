use crate::{malloc::malloc, Context, Read, ReadDecoder};

#[link(wasm_import_module = "w3")]
extern "C" {
	#[link_name = "__w3_getImplementations"]
	pub fn __w3_getImplementations(uri_ptr: u32, uri_len: u32) -> bool;

	#[link_name = "__w3_getImplementations_result_len"]
	pub fn __w3_getImplementations_result_len() -> u32;

	#[link_name = "__w3_getImplementations_result"]
	pub fn __w3_getImplementations_result(ptr: u32);
}

pub fn w3_get_implementations(uri: &str) -> Vec<String> {
	let uri_buf = uri.as_bytes();

	let success = unsafe { __w3_getImplementations(uri_buf.as_ptr() as u32, uri_buf.len() as u32) };

	if !success {
		return vec![]
	}

	let result_len = unsafe { __w3_getImplementations_result_len() };
	let result_len_ptr = malloc(result_len);
	let result_buffer =
		unsafe { Vec::from_raw_parts(result_len_ptr, result_len as usize, result_len as usize) };
	unsafe { __w3_getImplementations_result(result_buffer.as_ptr() as u32) };

	// deserialize the `msgpack` buffer,
	// which contains a `Vec<String>`
	let mut decoder = ReadDecoder::new(&result_buffer, Context::new());
	decoder.context().push(
		"__w3_getImplementations_result",
		"Vec<String>",
		"__w3_getImplementations successful",
	);
	decoder.read_array(|reader| reader.read_string().unwrap()).unwrap()
}
