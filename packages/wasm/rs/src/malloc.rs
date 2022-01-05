pub fn malloc(len: u32) -> *mut u8 {
    let mut len_bytes = Vec::with_capacity(len as usize);
    len_bytes.resize(len as usize, 0);
    // Prevent automatically dropping the Vec's data
    let mut len_bytes_ptr = core::mem::ManuallyDrop::new(len_bytes);
    len_bytes_ptr.as_mut_ptr()
}
