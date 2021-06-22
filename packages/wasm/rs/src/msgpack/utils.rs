use super::context::Context;
use std::io::{Error, ErrorKind};

#[derive(Clone, Copy, Debug, Default)]
pub struct Block {
    /// Memory manager info
    mm_info: u32,
}

pub const BLOCK_OVERHEAD: usize = 100; // FIXME: offsetof<BLOCK>();

pub const BLOCK_MAX_SIZE: usize = (1 << 30) - BLOCK_OVERHEAD;
pub const E_INDEX_OUT_OF_RANGE: &str = "Index out of range";
pub const E_INVALID_LENGTH: &str = "Invalid length";

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
