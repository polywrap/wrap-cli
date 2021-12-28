use super::{Context, BLOCK_MAX_SIZE, E_INVALID_LENGTH};
use core::sync::atomic::{AtomicPtr, Ordering};

#[derive(Clone, Debug, Default)]
pub struct DataView {
    data_start: usize,
    buffer: Vec<u8>,
    byte_length: usize,
    byte_offset: usize,
    context: Context,
}

impl DataView {
    pub fn new(buf: &[u8], context: Context, offset: usize) -> Result<Self, String> {
        let byte_offset = offset;
        let byte_length = buf.len();

        if byte_length > BLOCK_MAX_SIZE || byte_offset + byte_length > byte_length {
            let msg = format!(
                "DataView::new(): {} [ byte_length: {} byte_offset: {} buffer.byte_length: {} ]",
                E_INVALID_LENGTH, byte_length, byte_offset, byte_length
            );
            return Err(context.print_with_context(&msg));
        }
        Ok(Self {
            data_start: buf.as_ptr() as usize,
            buffer: buf.to_vec(),
            byte_length,
            byte_offset,
            context,
        })
    }

    pub fn get_bytes(&mut self, length: usize) -> Vec<u8> {
        self.check_index_in_range("get_bytes", length);
        let buf = self.buffer.as_slice();
        let (b_off, b_len) = (self.byte_offset, self.byte_offset + length);
        let result = &buf[b_off..b_len];
        self.byte_offset += length;
        result.to_vec()
    }

    pub fn peek_u8(&mut self) -> u8 {
        self.check_index_in_range("peek_u8", 0);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut u8)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        u8::swap_bytes(*result)
    }

    pub fn discard(&mut self, length: usize) {
        self.check_index_in_range("discard", length);
        self.byte_offset += length;
    }

    pub fn get_f32(&mut self) -> f32 {
        self.check_index_in_range("get_f32", 4);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut f32)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 4;
        u32::swap_bytes(*result as u32) as f32
    }

    pub fn get_f64(&mut self) -> f64 {
        self.check_index_in_range("get_f64", 8);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut f64)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 8;
        u64::swap_bytes(*result as u64) as f64
    }

    pub fn get_i8(&mut self) -> i8 {
        self.check_index_in_range("get_i8", 1);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut i8)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 1;
        i8::swap_bytes(*result as i8)
    }

    pub fn get_i16(&mut self) -> i16 {
        self.check_index_in_range("get_i16", 2);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut i16)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 2;
        i16::swap_bytes(*result as i16)
    }

    pub fn get_i32(&mut self) -> i32 {
        self.check_index_in_range("get_i32", 4);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut i32)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 4;
        i32::swap_bytes(*result as i32)
    }

    pub fn get_i64(&mut self) -> i64 {
        self.check_index_in_range("get_i64", 8);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut i64)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 8;
        i64::swap_bytes(*result as i64)
    }

    pub fn get_u8(&mut self) -> u8 {
        self.check_index_in_range("get_u8", 1);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut u8)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 1;
        u8::swap_bytes(*result as u8)
    }

    pub fn get_u16(&mut self) -> u16 {
        self.check_index_in_range("get_u16", 2);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut u16)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 2;
        u16::swap_bytes(*result as u16)
    }

    pub fn get_u32(&mut self) -> u32 {
        self.check_index_in_range("get_u32", 4);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut u32)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 4;
        u32::swap_bytes(*result as u32)
    }

    pub fn get_u64(&mut self) -> u64 {
        self.check_index_in_range("get_u64", 8);
        let result = unsafe {
            AtomicPtr::new((self.data_start + self.byte_offset) as *mut u64)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 8;
        u64::swap_bytes(*result as u64)
    }

    pub fn set_bytes(&mut self, buf: &[u8]) {
        self.check_index_in_range("set_bytes", 8);
        let src_len = buf.len();
        self.buffer[..src_len].copy_from_slice(buf);
        self.byte_offset += src_len;
    }

    pub fn set_f32(&mut self, value: f32) {
        self.check_index_in_range("set_f32", 4);
        let mut swapped_f32 = (value as u32).swap_bytes() as f32;
        AtomicPtr::new((self.data_start + self.byte_offset) as *mut f32)
            .store(&mut swapped_f32, Ordering::Relaxed);
        self.byte_offset += 4;
    }

    pub fn set_f64(&mut self, value: f64) {
        self.check_index_in_range("set_f64", 8);
        let mut swapped_f64 = (value as u64).swap_bytes() as f64;
        AtomicPtr::new((self.data_start + self.byte_offset) as *mut f64)
            .store(&mut swapped_f64, Ordering::Relaxed);
        self.byte_offset += 8;
    }

    pub fn set_i8(&mut self, value: i8) {
        self.check_index_in_range("set_i8", 1);
        AtomicPtr::new((self.data_start + self.byte_offset) as *mut i8)
            .store(&mut value.swap_bytes(), Ordering::Relaxed);
        self.byte_offset += 1;
    }

    pub fn set_i16(&mut self, value: i16) {
        self.check_index_in_range("set_i16", 2);
        AtomicPtr::new((self.data_start + self.byte_offset) as *mut i16)
            .store(&mut value.swap_bytes(), Ordering::Relaxed);
        self.byte_offset += 2;
    }

    pub fn set_i32(&mut self, value: i32) {
        self.check_index_in_range("set_i32", 4);
        AtomicPtr::new((self.data_start + self.byte_offset) as *mut i32)
            .store(&mut value.swap_bytes(), Ordering::Relaxed);
        self.byte_offset += 4;
    }

    pub fn set_i64(&mut self, value: i64) {
        self.check_index_in_range("set_i64", 8);
        AtomicPtr::new((self.data_start + self.byte_offset) as *mut i64)
            .store(&mut value.swap_bytes(), Ordering::Relaxed);
        self.byte_offset += 8;
    }

    pub fn set_u8(&mut self, value: u8) {
        self.check_index_in_range("set_u8", 1);
        AtomicPtr::new((self.data_start + self.byte_offset) as *mut u8)
            .store(&mut value.swap_bytes(), Ordering::Relaxed);
        self.byte_offset += 1;
    }

    pub fn set_u16(&mut self, value: u16) {
        self.check_index_in_range("set_u16", 2);
        AtomicPtr::new((self.data_start + self.byte_offset) as *mut u16)
            .store(&mut value.swap_bytes(), Ordering::Relaxed);
        self.byte_offset += 2;
    }

    pub fn set_u32(&mut self, value: u32) {
        self.check_index_in_range("set_u32", 4);
        AtomicPtr::new((self.data_start + self.byte_offset) as *mut u32)
            .store(&mut value.swap_bytes(), Ordering::Relaxed);
        self.byte_offset += 4;
    }

    pub fn set_u64(&mut self, value: u64) {
        self.check_index_in_range("set_u64", 8);
        AtomicPtr::new((self.data_start + self.byte_offset) as *mut u64)
            .store(&mut value.swap_bytes(), Ordering::Relaxed);
        self.byte_offset += 8;
    }

    pub fn get_byte_length(&self) -> i32 {
        self.byte_length as i32
    }

    pub fn get_buffer(&self) -> Vec<u8> {
        self.buffer.clone()
    }

    pub fn context(&mut self) -> &mut Context {
        &mut self.context
    }

    fn check_index_in_range(&self, method: &str, length: usize) {
        if self.byte_offset + length > self.byte_length {
            super::utils::throw_index_out_of_range(
                &self.context,
                method,
                length,
                self.byte_offset,
                self.byte_length,
            );
        }
    }
}
