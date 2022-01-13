pub fn malloc(len: u32) -> *mut u8 {
    let len_bytes = vec![0; len as usize];
    // Prevent automatically dropping the Vec's data
    let mut len_bytes_ptr = core::mem::ManuallyDrop::new(len_bytes);
    len_bytes_ptr.as_mut_ptr()
}
