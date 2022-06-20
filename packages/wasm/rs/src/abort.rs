#[link(wasm_import_module = "wrap")]
extern "C" {
    /// Get Abort Arguments
    #[link_name = "__wrap_abort"]
    pub fn __wrap_abort(
        msg_ptr: u32,
        msg_len: u32,
        file_ptr: u32,
        file_len: u32,
        line: u32,
        column: u32,
    );
}

/// Helper for aborting
pub fn wrap_abort_setup() {
    std::panic::set_hook(Box::new(|panic_info| {
        let payload = panic_info.payload();
        let message = match payload
            .downcast_ref::<String>()
            .map(String::as_str)
            .or_else(|| payload.downcast_ref::<&'static str>().copied())
        {
            Some(msg) => msg.to_string(),
            None => "unknown error".to_string(),
        };
        let msg_len = message.len() as u32;
        let location = panic_info.location();
        let file = match location {
            Some(location) => location.file(),
            None => "unknown file",
        };
        let file_len = file.len() as u32;
        let line = match location {
            Some(location) => location.line(),
            None => 0,
        };
        let column = match location {
            Some(location) => location.column(),
            None => 0,
        };
        unsafe {
            __wrap_abort(
                message.as_ptr() as u32,
                msg_len,
                file.as_ptr() as u32,
                file_len,
                line,
                column,
            )
        };
    }))
}
