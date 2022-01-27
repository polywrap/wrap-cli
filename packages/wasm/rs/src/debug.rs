use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[link(wasm_import_module = "w3")]
extern "C" {
    /// Get Abort Arguments
    #[wasm_bindgen(js_name = __w3_debug_log)]
    pub fn __w3_debug_log(ptr: u32, len: u32);
}

pub fn w3_debug_log(msg: &str) {
    let msg_bytes = msg.as_bytes();
    __w3_debug_log(msg_bytes.as_ptr() as u32, msg_bytes.len() as u32);
}
