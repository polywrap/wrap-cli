use super::{context::Context, BLOCK_MAX_SIZE, E_INVALID_LENGTH};
use alloc::{format, string::String, vec::Vec};
use core::sync::atomic::{AtomicPtr, Ordering};

#[derive(Clone, Debug, Default)]
pub struct DataView<'a> {
    data_start: u32,
    buffer: Vec<u8>,
    byte_length: i32,
    byte_offset: i32,
    context: Context<'a>,
}

impl<'a> DataView<'a> {
    pub fn new(
        buf: &[u8],
        cxt: Option<Context<'a>>,
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
        let data_start = buf.as_ptr() as u32;
        Ok(Self {
            data_start,
            buffer: buf.to_vec(),
            byte_length,
            byte_offset,
            context,
        })
    }

    pub fn get_bytes(&mut self, length: i32) -> Result<Vec<u8>, &'static str> {
        let buf = self.buffer.as_slice();
        let (b_off, b_len) = (
            self.byte_offset as usize,
            (self.byte_offset + length) as usize,
        );
        let result = &buf[b_off..b_len];
        self.byte_offset += length;
        Ok(result.to_vec())
    }

    pub fn peek_u8(&mut self) -> Result<u8, &'static str> {
        let p = &mut ((self.data_start + self.byte_offset as u32) as u8);
        let u8_ptr = AtomicPtr::new(p);
        let result = u8_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        Ok(result.swap_bytes())
    }

    pub fn discard(&mut self, length: i32) {
        self.byte_offset += length;
    }

    pub fn get_f32(&mut self) -> Result<f32, &'static str> {
        let p = &mut (self.data_start + self.byte_offset as u32);
        let f32_ptr = AtomicPtr::new(p);
        let result = f32_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        self.byte_offset += 4;
        Ok(*result as f32)
    }

    pub fn get_f64(&mut self) -> Result<f64, &'static str> {
        let p = &mut ((self.data_start + self.byte_offset as u32) as u64);
        let f64_ptr = AtomicPtr::new(p);
        let result = f64_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        self.byte_offset += 8;
        Ok(*result as f64)
    }

    pub fn get_i8(&mut self) -> Result<i8, &'static str> {
        let p = &mut ((self.data_start + self.byte_offset as u32) as i8);
        let i8_ptr = AtomicPtr::new(p);
        let result = i8_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        self.byte_offset += 1;
        Ok(result.swap_bytes())
    }

    pub fn get_i16(&mut self) -> Result<i16, &'static str> {
        let p = &mut ((self.data_start + self.byte_offset as u32) as i16);
        let i16_ptr = AtomicPtr::new(p);
        let result = i16_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        self.byte_offset += 2;
        Ok(result.swap_bytes())
    }

    pub fn get_i32(&mut self) -> Result<i32, &'static str> {
        let p = &mut ((self.data_start + self.byte_offset as u32) as i32);
        let i32_ptr = AtomicPtr::new(p);
        let result = i32_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        self.byte_offset += 4;
        Ok(result.swap_bytes())
    }

    pub fn get_i64(&mut self) -> Result<i64, &'static str> {
        let p = &mut ((self.data_start + self.byte_offset as u32) as i64);
        let i64_ptr = AtomicPtr::new(p);
        let result = i64_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        self.byte_offset += 8;
        Ok(result.swap_bytes())
    }

    pub fn get_u8(&mut self) -> Result<u8, &'static str> {
        let p = &mut ((self.data_start + self.byte_offset as u32) as u8);
        let u8_ptr = AtomicPtr::new(p);
        let result = u8_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        self.byte_offset += 1;
        Ok(result.swap_bytes())
    }

    pub fn get_u16(&mut self) -> Result<u16, &'static str> {
        let p = &mut ((self.data_start + self.byte_offset as u32) as u16);
        let u16_ptr = AtomicPtr::new(p);
        let result = u16_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        self.byte_offset += 2;
        Ok(result.swap_bytes())
    }

    pub fn get_u32(&mut self) -> Result<u32, &'static str> {
        let p = &mut (self.data_start + self.byte_offset as u32);
        let u32_ptr = AtomicPtr::new(p);
        let result = u32_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        self.byte_offset += 4;
        Ok(result.swap_bytes())
    }

    pub fn get_u64(&mut self) -> Result<u64, &'static str> {
        let p = &mut ((self.data_start + self.byte_offset as u32) as u64);
        let u64_ptr = AtomicPtr::new(p);
        let result = u64_ptr.load(Ordering::Relaxed);
        let result = unsafe { result.as_ref().unwrap() };
        self.byte_offset += 8;
        Ok(result.swap_bytes())
    }

    pub fn set_bytes(&mut self, buf: &[u8]) -> Result<(), &'static str> {
        for (dst, src) in self.buffer.iter_mut().zip(buf.iter()) {
            *dst = *src
        }
        self.byte_offset += buf.len() as i32;
        Ok(())
    }

    pub fn set_f32(&mut self, value: f32) -> Result<(), &'static str> {
        let ptr = &mut (self.data_start + self.byte_offset as u32);
        let val_ptr = &mut (value as u32).swap_bytes();
        let f32_ptr = AtomicPtr::new(ptr);
        f32_ptr.store(val_ptr, Ordering::Relaxed);
        self.byte_offset += 4;
        Ok(())
    }

    pub fn set_f64(&mut self, value: f64) -> Result<(), &'static str> {
        let ptr = &mut ((self.data_start + self.byte_offset as u32) as u64);
        let val_ptr = &mut (value as u64).swap_bytes();
        let f64_ptr = AtomicPtr::new(ptr);
        f64_ptr.store(val_ptr, Ordering::Relaxed);
        self.byte_offset += 8;
        Ok(())
    }

    pub fn set_i8(&mut self, value: i8) -> Result<(), &'static str> {
        let ptr = &mut ((self.data_start + self.byte_offset as u32) as i8);
        let val_ptr = &mut value.swap_bytes();
        let i8_ptr = AtomicPtr::new(ptr);
        i8_ptr.store(val_ptr, Ordering::Relaxed);
        self.byte_offset += 1;
        Ok(())
    }

    pub fn set_i16(&mut self, value: i16) -> Result<(), &'static str> {
        let ptr = &mut ((self.data_start + self.byte_offset as u32) as i16);
        let val_ptr = &mut value.swap_bytes();
        let i16_ptr = AtomicPtr::new(ptr);
        i16_ptr.store(val_ptr, Ordering::Relaxed);
        self.byte_offset += 2;
        Ok(())
    }

    pub fn set_i32(&mut self, value: i32) -> Result<(), &'static str> {
        let ptr = &mut ((self.data_start + self.byte_offset as u32) as i32);
        let val_ptr = &mut value.swap_bytes();
        let i32_ptr = AtomicPtr::new(ptr);
        i32_ptr.store(val_ptr, Ordering::Relaxed);
        self.byte_offset += 4;
        Ok(())
    }

    pub fn set_i64(&mut self, value: i64) -> Result<(), &'static str> {
        let ptr = &mut ((self.data_start + self.byte_offset as u32) as i64);
        let val_ptr = &mut value.swap_bytes();
        let i64_ptr = AtomicPtr::new(ptr);
        i64_ptr.store(val_ptr, Ordering::Relaxed);
        self.byte_offset += 8;
        Ok(())
    }

    pub fn set_u8(&mut self, value: u8) -> Result<(), &'static str> {
        let ptr = &mut ((self.data_start + self.byte_offset as u32) as u8);
        let val_ptr = &mut value.swap_bytes();
        let u8_ptr = AtomicPtr::new(ptr);
        u8_ptr.store(val_ptr, Ordering::Relaxed);
        self.byte_offset += 1;
        Ok(())
    }

    pub fn set_u16(&mut self, value: u16) -> Result<(), &'static str> {
        let ptr = &mut ((self.data_start + self.byte_offset as u32) as u16);
        let val_ptr = &mut value.swap_bytes();
        let u16_ptr = AtomicPtr::new(ptr);
        u16_ptr.store(val_ptr, Ordering::Relaxed);
        self.byte_offset += 2;
        Ok(())
    }

    pub fn set_u32(&mut self, value: u32) -> Result<(), &'static str> {
        // if let Err(error) = self.check_index_in_range("set_u32", 4) {
        //     return Err(error);
        // }
        let ptr = &mut (self.data_start + self.byte_offset as u32);
        let val_ptr = &mut value.swap_bytes();
        let u32_ptr = AtomicPtr::new(ptr);
        u32_ptr.store(val_ptr, Ordering::Relaxed);
        self.byte_offset += 4;
        Ok(())
    }

    pub fn set_u64(&mut self, value: u64) -> Result<(), &'static str> {
        let ptr = &mut ((self.data_start + self.byte_offset as u32) as u64);
        let val_ptr = &mut value.swap_bytes();
        let u64_ptr = AtomicPtr::new(ptr);
        u64_ptr.store(val_ptr, Ordering::Relaxed);
        self.byte_offset += 8;
        Ok(())
    }

    /// Get a reference to the data view's byte length.
    pub fn byte_length(&self) -> &i32 {
        &self.byte_length
    }

    /// Get a reference to the data view's context.
    pub fn context(&self) -> &Context<'a> {
        &self.context
    }
}
