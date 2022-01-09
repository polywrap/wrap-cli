//! Utility functions for better error handling

use super::Context;

pub const BLOCK_MAX_SIZE: usize = 1 << 30;
pub const E_INDEX_OUT_OF_RANGE: &str = "Index out of range";
pub const E_INVALID_LENGTH: &str = "Invalid length";

/// Returns an error message for when the provided length is greater than the byte_length
pub fn throw_index_out_of_range(
    context: &Context,
    method: &str,
    length: usize,
    byte_length: usize,
) -> String {
    let mut ctx = String::from(method);
    let msg = format!(
        ": {}, [length: {}, byte_length: {}]",
        E_INDEX_OUT_OF_RANGE,
        length.to_string(),
        byte_length.to_string()
    );
    ctx.push_str(&msg);
    context.print_with_context(&ctx)
}
