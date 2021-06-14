use super::context::Context;
use super::utils::throw_index_out_of_range;
use super::{BLOCK_MAX_SIZE, E_INVALID_LENGTH};
use num::FromPrimitive;
use std::io::{Error, ErrorKind, Result};
use std::sync::atomic::{AtomicPtr, Ordering};

#[derive(Clone, Debug)]
pub struct DataView {
    data_start: u32,
    buffer: Vec<u8>,
    byte_length: i32,
    byte_offset: i32,
    context: Context,
}

impl DataView {
    pub fn new(buf: &[u8]) -> Result<Self> {
        let byte_offset = 0;
        let byte_length = buf.len() as i32;
        let context = Context::new();

        if byte_length > BLOCK_MAX_SIZE as i32 || byte_offset + byte_length > buf.len() as i32 {
            let msg = format!("DataView::new(): {} [byte_length: {} BLOCK_MAX_SIZE: {} byte_offset: {} buffer.byte_length: {} ]",
            E_INVALID_LENGTH, byte_length.to_string(), BLOCK_MAX_SIZE.to_string(), byte_offset.to_string(), byte_length.to_string());
            let ctx = context.print_with_context(&msg);
            return Err(Error::new(ErrorKind::Interrupted, ctx));
        }
        let data_start = buf.iter().fold(0, |result, &bit| (result << 1) ^ bit) as u32;
        Ok(Self {
            data_start,
            buffer: buf.to_vec(),
            byte_length,
            byte_offset,
            context,
        })
    }

    pub fn get_bytes(&mut self, length: i32) -> Result<Vec<u8>> {
        if let Err(error) = self.check_index_in_range("get_bytes", length) {
            return Err(Error::from(error));
        }
        let buf = self.buffer.as_slice();
        let (b_off, b_len) = (
            self.byte_offset as usize,
            (self.byte_offset + length) as usize,
        );
        let result = &buf[b_off..b_len];
        self.byte_offset += length;
        Ok(result.to_vec())
    }

    pub fn peek_u8(&mut self) -> Result<u8> {
        if let Err(error) = self.check_index_in_range("peek_u8", 0) {
            return Err(Error::from(error));
        }
        let p = (self.data_start + self.byte_offset as u32) as u8;
        let result = self.load_from_memory(p);
        Ok(result.swap_bytes())
    }

    pub fn discard(&mut self, length: i32) -> Result<()> {
        if let Err(error) = self.check_index_in_range("discard", length) {
            return Err(Error::from(error));
        }
        self.byte_offset += length;
        Ok(())
    }

    pub fn get_f32(&mut self) -> Result<f32> {
        if let Err(error) = self.check_index_in_range("get_f32", 4) {
            return Err(Error::from(error));
        }
        let p = self.data_start + self.byte_offset as u32;
        let result = self.load_from_memory(p).swap_bytes();

        self.byte_offset += 4;
        Ok(result as f32)
    }

    pub fn get_f64(&mut self) -> Result<f64> {
        if let Err(error) = self.check_index_in_range("get_f64", 8) {
            return Err(Error::from(error));
        }
        let p = (self.data_start + self.byte_offset as u32) as u64;
        let result = self.load_from_memory(p).swap_bytes();

        self.byte_offset += 8;
        Ok(result as f64)
    }

    pub fn get_i8(&mut self) -> Result<i8> {
        if let Err(error) = self.check_index_in_range("get_i8", 1) {
            return Err(Error::from(error));
        }
        let p = (self.data_start + self.byte_offset as u32) as i8;
        let result = self.load_from_memory(p);
        self.byte_offset += 1;
        Ok(result.swap_bytes())
    }

    pub fn get_i16(&mut self) -> Result<i16> {
        if let Err(error) = self.check_index_in_range("get_i16", 2) {
            return Err(Error::from(error));
        }
        let p = (self.data_start + self.byte_offset as u32) as i16;
        let result = self.load_from_memory(p);
        self.byte_offset += 2;
        Ok(result.swap_bytes())
    }

    pub fn get_i32(&mut self) -> Result<i32> {
        if let Err(error) = self.check_index_in_range("get_i32", 4) {
            return Err(Error::from(error));
        }
        let p = (self.data_start + self.byte_offset as u32) as i32;
        let result = self.load_from_memory(p);
        self.byte_offset += 4;
        Ok(result.swap_bytes())
    }

    pub fn get_i64(&mut self) -> Result<i64> {
        if let Err(error) = self.check_index_in_range("get_i64", 8) {
            return Err(Error::from(error));
        }
        let p = (self.data_start + self.byte_offset as u32) as i64;
        let result = self.load_from_memory(p);
        self.byte_offset += 8;
        Ok(result.swap_bytes())
    }

    pub fn get_u8(&mut self) -> Result<u8> {
        if let Err(error) = self.check_index_in_range("get_u8", 1) {
            return Err(Error::from(error));
        }
        let p = (self.data_start + self.byte_offset as u32) as u8;
        let result = self.load_from_memory(p);
        self.byte_offset += 1;
        Ok(result.swap_bytes())
    }

    pub fn get_u16(&mut self) -> Result<u16> {
        if let Err(error) = self.check_index_in_range("get_u16", 2) {
            return Err(Error::from(error));
        }
        let p = (self.data_start + self.byte_offset as u32) as u16;
        let result = self.load_from_memory(p);
        self.byte_offset += 2;
        Ok(result.swap_bytes())
    }

    pub fn get_u32(&mut self) -> Result<u32> {
        if let Err(error) = self.check_index_in_range("get_u32", 4) {
            return Err(Error::from(error));
        }
        let p = (self.data_start + self.byte_offset as u32) as u32;
        let result = self.load_from_memory(p);
        self.byte_offset += 4;
        Ok(result.swap_bytes())
    }

    pub fn get_u64(&mut self) -> Result<u64> {
        if let Err(error) = self.check_index_in_range("get_u64", 8) {
            return Err(Error::from(error));
        }
        let p = (self.data_start + self.byte_offset as u32) as u64;
        let result = self.load_from_memory(p);
        self.byte_offset += 8;
        Ok(result.swap_bytes())
    }

    pub fn set_bytes(&mut self, buf: &[u8]) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_bytes", buf.len() as i32) {
            return Err(Error::from(error));
        }
        let src_ptr = buf.iter().fold(0, |result, &bit| (result << 1) ^ bit) as *const i32;
        let dst_ptr = (self.data_start as i32 + self.byte_offset) as *mut i32;
        unsafe {
            std::ptr::copy(src_ptr, dst_ptr, buf.len());
        }
        self.byte_offset += buf.len() as i32;
        Ok(())
    }

    pub fn set_f32(&mut self, value: f32) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_f32", 4) {
            return Err(Error::from(error));
        }
        let ptr = self.data_start + self.byte_offset as u32;
        let val = value as u32;
        self.store_to_memory(ptr, val.swap_bytes());
        self.byte_offset += 4;
        Ok(())
    }

    pub fn set_f64(&mut self, value: f64) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_f64", 8) {
            return Err(Error::from(error));
        }
        let ptr = (self.data_start + self.byte_offset as u32) as u64;
        let val = value as u64;
        self.store_to_memory(ptr, val.swap_bytes());
        self.byte_offset += 8;
        Ok(())
    }

    pub fn set_i8(&mut self, value: i8) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_i8", 1) {
            return Err(Error::from(error));
        }
        let ptr = (self.data_start + self.byte_offset as u32) as i8;
        self.store_to_memory(ptr, value.swap_bytes());
        self.byte_offset += 1;
        Ok(())
    }

    pub fn set_i16(&mut self, value: i16) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_i16", 2) {
            return Err(Error::from(error));
        }
        let ptr = (self.data_start + self.byte_offset as u32) as i16;
        self.store_to_memory(ptr, value.swap_bytes());
        self.byte_offset += 2;
        Ok(())
    }

    pub fn set_i32(&mut self, value: i32) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_i32", 4) {
            return Err(Error::from(error));
        }
        let ptr = (self.data_start + self.byte_offset as u32) as i32;
        self.store_to_memory(ptr, value.swap_bytes());
        self.byte_offset += 4;
        Ok(())
    }

    pub fn set_i64(&mut self, value: i64) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_i64", 8) {
            return Err(Error::from(error));
        }
        let ptr = (self.data_start + self.byte_offset as u32) as i64;
        self.store_to_memory(ptr, value.swap_bytes());
        self.byte_offset += 8;
        Ok(())
    }

    pub fn set_u8(&mut self, value: u8) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_u8", 1) {
            return Err(Error::from(error));
        }
        let ptr = (self.data_start + self.byte_offset as u32) as u8;
        self.store_to_memory(ptr, value.swap_bytes());
        self.byte_offset += 1;
        Ok(())
    }

    pub fn set_u16(&mut self, value: u16) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_u16", 2) {
            return Err(Error::from(error));
        }
        let ptr = (self.data_start + self.byte_offset as u32) as u16;
        self.store_to_memory(ptr, value.swap_bytes());
        self.byte_offset += 2;
        Ok(())
    }

    pub fn set_u32(&mut self, value: u32) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_u32", 4) {
            return Err(Error::from(error));
        }
        let ptr = self.data_start + self.byte_offset as u32;
        self.store_to_memory(ptr, value.swap_bytes());
        self.byte_offset += 4;
        Ok(())
    }

    pub fn set_u64(&mut self, value: u64) -> Result<()> {
        if let Err(error) = self.check_index_in_range("set_u64", 8) {
            return Err(Error::from(error));
        }
        let ptr = (self.data_start + self.byte_offset as u32) as u64;
        self.store_to_memory(ptr, value.swap_bytes());
        self.byte_offset += 8;
        Ok(())
    }

    pub fn to_string() -> String {
        format!("[object DataView")
    }

    fn load_from_memory<T: FromPrimitive + Copy>(&mut self, mut p: T) -> T {
        let val_ptr = AtomicPtr::new(&mut p);
        let value = val_ptr.load(Ordering::Relaxed);
        let result = unsafe { value.as_ref().unwrap() };
        *result
    }

    fn store_to_memory<T: FromPrimitive + Copy>(&mut self, mut p: T, mut value: T) {
        let p = &mut p;
        let ptr = AtomicPtr::new(p);
        let value = &mut value;
        ptr.store(value, Ordering::Relaxed);
    }

    fn check_index_in_range(&self, method: &str, length: i32) -> Result<()> {
        if self.byte_offset + length > self.byte_length {
            let custom = throw_index_out_of_range(
                self.context.clone(),
                method,
                length,
                self.byte_offset,
                self.byte_length,
            );
            return Err(Error::new(ErrorKind::Interrupted, custom));
        }
        Ok(())
    }
}
