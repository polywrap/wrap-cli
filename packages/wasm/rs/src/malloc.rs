pub fn malloc(len: u32) -> *const u8 {
    let len_bytes = vec![0; len as usize];
    // Prevent automatically dropping the Vec's data
    let len_bytes_ptr = core::mem::ManuallyDrop::new(len_bytes);
    len_bytes_ptr.as_ptr()
}
