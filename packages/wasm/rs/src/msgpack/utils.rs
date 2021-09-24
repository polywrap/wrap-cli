//! Utility functions for better error handling

use super::Context;
use alloc::{
    format,
    string::{String, ToString},
};

pub const BLOCK_MAX_SIZE: usize = 1 << 30;
pub const E_INDEX_OUT_OF_RANGE: &str = "Index out of range";
pub const E_INVALID_LENGTH: &str = "Invalid length";

/// Returns an error message for when the provided length plus the byte_offset
/// is greater than the byte_length
pub fn throw_index_out_of_range(
    context: Context,
    method: &str,
    length: i32,
    byte_offset: i32,
    byte_length: i32,
) -> String {
    let mut ctx = String::from(method);
    let msg = format!(
        ": {}, [length: {}, byte_offset: {}, byte_length: {}]",
        E_INDEX_OUT_OF_RANGE,
        length.to_string(),
        byte_offset.to_string(),
        byte_length.to_string()
    );
    ctx.push_str(&msg);
    context.print_with_context(&ctx)
}
