use crate::{malloc::alloc, Context, Read, ReadDecoder};

#[link(wasm_import_module = "wrap")]
extern "C" {
    #[link_name = "__wrap_getImplementations"]
    pub fn __wrap_getImplementations(uri_ptr: u32, uri_len: u32) -> bool;

    #[link_name = "__wrap_getImplementations_result_len"]
    pub fn __wrap_getImplementations_result_len() -> u32;

    #[link_name = "__wrap_getImplementations_result"]
    pub fn __wrap_getImplementations_result(ptr: u32);
}

pub fn wrap_get_implementations(uri: &str) -> Vec<String> {
    let success =
        unsafe { __wrap_getImplementations(uri.as_bytes().as_ptr() as u32, uri.len() as u32) };

    if !success {
        return vec![];
    }

    let result_len = unsafe { __wrap_getImplementations_result_len() };
    let result_len_ptr = alloc(result_len as usize);
    let result_buffer =
        unsafe { Vec::from_raw_parts(result_len_ptr, result_len as usize, result_len as usize) };
    unsafe { __wrap_getImplementations_result(result_buffer.as_ptr() as u32) };

    // deserialize the `msgpack` buffer,
    // which contains a `Vec<String>`
    let mut decoder = ReadDecoder::new(&result_buffer, Context::new());
    decoder.context().push(
        "__wrap_getImplementations_result",
        "Vec<String>",
        "__wrap_getImplementations successful",
    );
    decoder.read_array(|reader| reader.read_string()).unwrap()
}
