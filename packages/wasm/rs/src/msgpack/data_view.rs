use super::{Context, BLOCK_MAX_SIZE, E_INVALID_LENGTH};
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
    pub fn new(buf: &[u8], context: Context, offset: usize) -> Result<Self, String> {
        let byte_offset = offset as i32;
        let byte_length = buf.len() as i32;

        if byte_length > BLOCK_MAX_SIZE as i32 || byte_offset + byte_length > byte_length {
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
        let result = unsafe {
            AtomicPtr::<u8>::new((self.data_start + self.byte_offset as u32) as *mut u8)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        result.swap_bytes()
    }

    pub fn discard(&mut self, length: i32) {
        self.check_index_in_range("discard", length);
        self.byte_offset += length;
    }

    pub fn get_f32(&mut self) -> f32 {
        self.check_index_in_range("get_f32", 4);
        let result = unsafe {
            AtomicPtr::<f32>::new((self.data_start + self.byte_offset as u32) as *mut f32)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 4;
        *result
    }

    pub fn get_f64(&mut self) -> f64 {
        self.check_index_in_range("get_f64", 8);
        let result = unsafe {
            AtomicPtr::<f64>::new((self.data_start + self.byte_offset as u32) as *mut f64)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 8;
        *result
    }

    pub fn get_i8(&mut self) -> i8 {
        self.check_index_in_range("get_i8", 1);
        let result = unsafe {
            AtomicPtr::<i8>::new((self.data_start + self.byte_offset as u32) as *mut i8)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 1;
        result.swap_bytes()
    }

    pub fn get_i16(&mut self) -> i16 {
        self.check_index_in_range("get_i16", 2);
        let result = unsafe {
            AtomicPtr::<i16>::new((self.data_start + self.byte_offset as u32) as *mut i16)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 2;
        result.swap_bytes()
    }

    pub fn get_i32(&mut self) -> i32 {
        self.check_index_in_range("get_i32", 4);
        let result = unsafe {
            AtomicPtr::<i32>::new((self.data_start + self.byte_offset as u32) as *mut i32)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 4;
        result.swap_bytes()
    }

    pub fn get_i64(&mut self) -> i64 {
        self.check_index_in_range("get_i64", 8);
        let result = unsafe {
            AtomicPtr::<i64>::new((self.data_start + self.byte_offset as u32) as *mut i64)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 8;
        result.swap_bytes()
    }

    pub fn get_u8(&mut self) -> u8 {
        self.check_index_in_range("get_u8", 1);
        let result = unsafe {
            AtomicPtr::<u8>::new((self.data_start + self.byte_offset as u32) as *mut u8)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 1;
        result.swap_bytes()
    }

    pub fn get_u16(&mut self) -> u16 {
        self.check_index_in_range("get_u16", 2);
        let result = unsafe {
            AtomicPtr::<u16>::new((self.data_start + self.byte_offset as u32) as *mut u16)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 2;
        result.swap_bytes()
    }

    pub fn get_u32(&mut self) -> u32 {
        self.check_index_in_range("get_u32", 4);
        let result = unsafe {
            AtomicPtr::<u32>::new((self.data_start + self.byte_offset as u32) as *mut u32)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 4;
        result.swap_bytes()
    }

    pub fn get_u64(&mut self) -> u64 {
        self.check_index_in_range("get_u64", 8);
        let result = unsafe {
            AtomicPtr::<u64>::new((self.data_start + self.byte_offset as u32) as *mut u64)
                .load(Ordering::Relaxed)
                .as_ref()
                .unwrap()
        };
        self.byte_offset += 8;
        result.swap_bytes()
    }

    pub fn set_bytes(&mut self, buf: &[u8]) {
        let b_size = self.byte_offset as usize;
        for (dst, src) in self.buffer[b_size..b_size + buf.len()]
            .iter_mut()
            .zip(buf.iter())
        {
            *dst = *src
        }
        self.byte_offset += buf.len() as i32;
    }

    pub fn set_f32(&mut self, value: f32) {
        self.set_bytes(&value.to_be_bytes());
    }

    pub fn set_f64(&mut self, value: f64) {
        self.set_bytes(&value.to_be_bytes());
    }

    pub fn set_i8(&mut self, value: i8) {
        self.set_bytes(&value.to_be_bytes());
    }

    pub fn set_i16(&mut self, value: i16) {
        self.set_bytes(&value.to_be_bytes());
    }

    pub fn set_i32(&mut self, value: i32) {
        self.set_bytes(&value.to_be_bytes());
    }

    pub fn set_i64(&mut self, value: i64) {
        self.set_bytes(&value.to_be_bytes());
    }

    pub fn set_u8(&mut self, value: u8) {
        self.set_bytes(&value.to_be_bytes());
    }

    pub fn set_u16(&mut self, value: u16) {
        self.set_bytes(&value.to_be_bytes());
    }

    pub fn set_u32(&mut self, value: u32) {
        self.set_bytes(&value.to_be_bytes());
    }

    pub fn set_u64(&mut self, value: u64) {
        self.set_bytes(&value.to_be_bytes());
    }

    pub fn get_byte_length(&self) -> i32 {
        self.byte_length
    }

    pub fn get_buffer(&self) -> Vec<u8> {
        self.buffer.clone()
    }

    pub fn context(&mut self) -> &mut Context {
        &mut self.context
    }

    fn check_index_in_range(&self, method: &str, length: i32) {
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
