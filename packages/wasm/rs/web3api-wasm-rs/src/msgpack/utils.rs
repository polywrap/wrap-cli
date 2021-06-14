use super::context::Context;
use once_cell::sync::Lazy;
use std::io::{Error, ErrorKind};
use std::{mem::MaybeUninit, ptr};

#[allow(unused)]
static DUMMY: Lazy<Block> = Lazy::new(|| Block { mm_info: 0 });

#[allow(unused)]
static OFFSET_C: Lazy<usize> = Lazy::new(|| {
    let base: *const Block = &*DUMMY;
    let mm_info: *const u32 = unsafe { &DUMMY.mm_info };
    (mm_info as usize) - (base as usize)
});

pub const BLOCK_OVERHEAD: usize = 100; // Call offset_of() when completed

pub const BLOCK_MAX_SIZE: usize = (1 << 30) - BLOCK_OVERHEAD;
pub const E_INDEX_OUT_OF_RANGE: &str = "Index out of range";
pub const E_INVALID_LENGTH: &str = "Invalid length";

#[derive(Clone, Copy, Debug, Default)]
#[repr(C, packed)]
pub struct Block {
    /// Memory manager info
    mm_info: u32,
}

#[allow(dead_code)]
fn offset_of() -> usize {
    return unsafe {
        let base = MaybeUninit::<Block>::uninit();
        let base_ptr = base.as_ptr();
        let mm_info = ptr::addr_of!((*base_ptr).mm_info);
        (mm_info as usize) - (base_ptr as usize)
    };
}

pub fn throw_index_out_of_range(
    context: Context,
    method: &str,
    length: i32,
    byte_offset: i32,
    byte_length: i32,
) -> Error {
    let mut ctx = String::from(method);
    let msg = format!(
        ": {}, [length: {}, byte_offset: {}, byte_length: {}]",
        E_INDEX_OUT_OF_RANGE,
        length.to_string(),
        byte_offset.to_string(),
        byte_length.to_string()
    );
    ctx.push_str(&msg);
    let error = context.print_with_context(&ctx);
    Error::new(ErrorKind::Interrupted, error)
}
