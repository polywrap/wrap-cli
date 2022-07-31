#[link(wasm_import_module = "wrap")]
extern "C" {
    /// Get Abort Arguments
    #[link_name = "__wrap_debug_log"]
    pub fn __wrap_debug_log(ptr: u32, len: u32);
}

pub fn wrap_debug_log(msg: &str) {
    let msg_bytes = msg.as_bytes();
    unsafe { __wrap_debug_log(msg_bytes.as_ptr() as u32, msg_bytes.len() as u32) };
}
