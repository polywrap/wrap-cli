use crate::malloc::alloc;

#[link(wasm_import_module = "wrap")]
extern "C" {
    // Load Env Variables
    #[link_name = "__wrap_load_env"]
    pub fn __wrap_load_env(environment_ptr: u32);
}

pub fn wrap_load_env(env_size: u32) -> Vec<u8> {
    let env_size_ptr = alloc(env_size as usize);
    let env_buf =
        unsafe { Vec::from_raw_parts(env_size_ptr, env_size as usize, env_size as usize) };
    unsafe { __wrap_load_env(env_buf.as_ptr() as u32) };
    env_buf
}

