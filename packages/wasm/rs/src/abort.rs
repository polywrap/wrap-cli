use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "w3")]
extern "C" {
    /// Get Abort Arguments
    pub fn __w3_abort(
        msg_ptr: u32,
        msg_en: u32,
        file_ptr: u32,
        file_len: u32,
        line: u32,
        column: u32,
    );
}

/// Helper for aborting
#[allow(unused_unsafe)]
#[wasm_bindgen]
pub fn w3_abort(msg: &str, file: &str, line: u32, column: u32) {
    let msg_buf = msg.as_bytes();
    let file_buf = file.as_bytes();

    let msg_buf_u32 = msg_buf.as_ptr() as u32;
    let file_buf_u32 = file_buf.as_ptr() as u32;

    unsafe {
        __w3_abort(
            msg_buf_u32,
            msg_buf.len() as u32,
            file_buf_u32,
            file_buf.len() as u32,
            line,
            column,
        )
    };
}
