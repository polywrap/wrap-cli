#[link(wasm_import_module = "w3")]
extern "C" {
    /// Get Abort Arguments
    #[link_name = "__w3_debug_log"]
    pub fn __w3_debug_log(ptr: u32, len: u32);
}

#[allow(unused_unsafe)]
pub fn w3_debug_log(msg: &str) {
    unsafe { __w3_debug_log(msg.as_ptr() as u32, msg.len() as u32) };
}
