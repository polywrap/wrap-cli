use crate::malloc::malloc;

#[link(wasm_import_module = "w3")]
extern "C" {
    /// Get Abort Arguments
    #[link_name = "__w3_abort"]
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
    let msg_ptr = malloc(msg.len() as u32);
    let file_ptr = malloc(file.len() as u32);

    unsafe {
        __w3_abort(
            msg_ptr as u32,
            msg.len() as u32,
            file_ptr as u32,
            file.len() as u32,
            line,
            column,
        )
    };
}
