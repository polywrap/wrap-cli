#[link(wasm_import_module = "w3")]
extern "C" {
    /// Get Abort Arguments
    pub fn __w3_abort(
        msg_ptr: u32,
        msg_len: u32,
        file_ptr: u32,
        file_len: u32,
        line: u32,
        column: u32,
    );
}

/// Helper for aborting
#[allow(unused_unsafe)]
pub fn w3_abort(msg: &str, file: &str, line: u32, column: u32) {
    let msg_buf = msg.as_bytes();
    let file_buf = file.as_bytes();

    unsafe {
        __w3_abort(
            msg_buf.as_ptr() as u32,
            msg_buf.len() as u32,
            file_buf.as_ptr() as u32,
            file_buf.len() as u32,
            line,
            column,
        )
    };
}
