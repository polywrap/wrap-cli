use super::{Context, BLOCK_MAX_SIZE, E_INVALID_LENGTH};
use super::utils;
use core::sync::atomic::{AtomicPtr, Ordering};

#[derive(Clone, Debug, Default)]
pub struct DataView {
    data_start: u32,
    buffer: Vec<u8>,
    byte_length: i32,
    byte_offset: i32,
    context: Context,
}

impl DataView {
    pub fn new(
        buf: &[u8],
        cxt: Option<Context>,
        offset: Option<usize>,
        length: Option<usize>,
    ) -> Result<Self, String> {
        let context = cxt.unwrap_or_default();
        let byte_offset = offset.unwrap_or(0) as i32;
        let byte_length = length.unwrap_or(buf.len()) as i32;

        if byte_length > BLOCK_MAX_SIZE as i32 || byte_offset + byte_length > buf.len() as i32 {
            let msg = format!(
                "DataView::new(): {} [ byte_length: {} byte_offset: {} buffer.byte_length: {} ]",
                E_INVALID_LENGTH, byte_length, byte_offset, byte_length
            );
            return Err(context.print_with_context(&msg));
        }
        Ok(Self {
            data_start: buf.as_ptr() as u32,
            buffer: buf.to_vec(),
            byte_length,
            byte_offset,
            context,
        })
    }

    pub fn get_buffer(&self) -> Vec<u8> {
        self.buffer.clone()
    }

    pub fn get_bytes(&mut self, length: i32) -> Vec<u8> {
        self.check_index_in_range("get_bytes", length);
        let buf = self.buffer.as_slice();
        let (b_off, b_len) = (
            self.byte_offset as usize,
            (self.byte_offset + length) as usize,
        );
        let result = &buf[b_off..b_len];
        self.byte_offset += length;
        result.to_vec()
    }

    pub fn peek_u8(&mut self) -> u8 {
        self.check_index_in_range("peek_u8", 0);
        let ptr = AtomicPtr::<u8>::new((self.data_start + self.byte_offset as u32) as *mut u8)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        result.swap_bytes()
    }

    pub fn discard(&mut self, length: i32) {
        self.check_index_in_range("discard", length);
        self.byte_offset += length;
    }

    pub fn get_f32(&mut self) -> f32 {
        self.check_index_in_range("get_f32", 4);
        let ptr = AtomicPtr::<f32>::new((self.data_start + self.byte_offset as u32) as *mut f32)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        self.byte_offset += 4;
        *result as f32
    }

    pub fn get_f64(&mut self) -> f64 {
        self.check_index_in_range("get_f64", 8);
        let ptr = AtomicPtr::<f64>::new((self.data_start + self.byte_offset as u32) as *mut f64)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        self.byte_offset += 8;
        *result as f64
    }

    pub fn get_i8(&mut self) -> i8 {
        self.check_index_in_range("get_i8", 1);
        let ptr = AtomicPtr::<i8>::new((self.data_start + self.byte_offset as u32) as *mut i8)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        self.byte_offset += 1;
        result.swap_bytes()
    }

    pub fn get_i16(&mut self) -> i16 {
        self.check_index_in_range("get_i16", 2);
        let ptr = AtomicPtr::<i16>::new((self.data_start + self.byte_offset as u32) as *mut i16)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        self.byte_offset += 2;
        result.swap_bytes()
    }

    pub fn get_i32(&mut self) -> i32 {
        self.check_index_in_range("get_i32", 4);
        let ptr = AtomicPtr::<i32>::new((self.data_start + self.byte_offset as u32) as *mut i32)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        self.byte_offset += 4;
        result.swap_bytes()
    }

    pub fn get_u8(&mut self) -> u8 {
        self.check_index_in_range("get_u8", 1);
        let ptr = AtomicPtr::<u8>::new((self.data_start + self.byte_offset as u32) as *mut u8)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        self.byte_offset += 1;
        result.swap_bytes()
    }

    pub fn get_u16(&mut self) -> u16 {
        self.check_index_in_range("get_u16", 2);
        let ptr = AtomicPtr::<u16>::new((self.data_start + self.byte_offset as u32) as *mut u16)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        self.byte_offset += 2;
        result.swap_bytes()
    }

    pub fn get_u32(&mut self) -> u32 {
        self.check_index_in_range("get_u32", 4);
        let ptr = AtomicPtr::<u32>::new((self.data_start + self.byte_offset as u32) as *mut u32)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        self.byte_offset += 4;
        result.swap_bytes()
    }

    pub fn set_bytes(&mut self, buf: &[u8]) {
        self.copy_bytes("set_bytes", buf);
    }

    pub fn set_f32(&mut self, value: &f32) {
        self.copy_bytes("set_f32", &value.to_be_bytes());
    }

    pub fn set_f64(&mut self, value: &f64) {
        self.copy_bytes("set_f64", &value.to_be_bytes());
    }

    pub fn set_i8(&mut self, value: &i8) {
        self.copy_bytes("set_i8", &value.to_be_bytes());
    }

    pub fn set_i16(&mut self, value: &i16) {
        self.copy_bytes("set_i16", &value.to_be_bytes());
    }

    pub fn set_i32(&mut self, value: &i32) {
        self.copy_bytes("set_i32", &value.to_be_bytes());
    }

    pub fn set_u8(&mut self, value: &u8) {
        self.copy_bytes("set_u8", &value.to_be_bytes());
    }

    pub fn set_u16(&mut self, value: &u16) {
        self.copy_bytes("set_u16", &value.to_be_bytes());
    }

    pub fn set_u32(&mut self, value: &u32) {
        self.copy_bytes("set_u32", &value.to_be_bytes());
    }

    // Non-standard additions that make sense in WebAssembly, but won't work in JS:
    pub fn get_i64(&mut self) -> i64 {
        self.check_index_in_range("get_i64", 8);
        let ptr = AtomicPtr::<i64>::new((self.data_start + self.byte_offset as u32) as *mut i64)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        self.byte_offset += 8;
        result.swap_bytes()
    }

    pub fn get_u64(&mut self) -> u64 {
        self.check_index_in_range("get_u64", 8);
        let ptr = AtomicPtr::<u64>::new((self.data_start + self.byte_offset as u32) as *mut u64)
            .load(Ordering::Relaxed);
        let result = unsafe { ptr.as_ref().unwrap() };
        self.byte_offset += 8;
        result.swap_bytes()
    }

    pub fn byte_length(&self) -> i32 {
        self.byte_length
    }

    fn copy_bytes(&mut self, method: &str, buf: &[u8]) {
        self.check_index_in_range(method, buf.len() as i32);
        let buffer_begin = self.byte_offset as usize;
        let buffer_itr = self.buffer[buffer_begin..(buffer_begin + buf.len())].iter_mut();
        for (dst, src) in buffer_itr.zip(buf.iter()) {
            *dst = *src
        }
        self.byte_offset += buf.len() as i32;
    }

    /// Get a reference to the data view's context.
    pub fn context(&mut self) -> &mut Context {
        &mut self.context
    }

    fn check_index_in_range(&self, method: &str, length: i32) {
        if self.byte_offset + length > self.byte_length {
            utils::throw_index_out_of_range(
                &self.context,
                method,
                length,
                self.byte_offset,
                self.byte_length
            );
        }
    }
}
