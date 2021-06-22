use super::context::Context;
use super::data_view::DataView;
use super::format::Format;
use super::write::{Result, Write};
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::hash::Hash;

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct WriteEncoder {
    context: Context,
    view: DataView,
}

impl WriteEncoder {
    pub fn new(ua: &[u8], context: Context) -> Self {
        Self {
            context: context.clone(),
            view: DataView::new(ua, context).unwrap(),
        }
    }
}

impl Write for WriteEncoder {
    fn write_nil(&mut self) {
        let _ = self.view.set_u8(Format::NIL);
    }

    fn write_bool(&mut self, value: bool) {
        if value {
            let _ = self.view.set_u8(Format::TRUE);
        } else {
            let _ = self.view.set_u8(Format::FALSE);
        }
    }

    fn write_i8(&mut self, value: i8) {
        self.write_i64(value as i64);
    }

    fn write_i16(&mut self, value: i16) {
        self.write_i64(value as i64);
    }

    fn write_i32(&mut self, value: i32) {
        self.write_i64(value as i64);
    }

    fn write_i64(&mut self, value: i64) {
        if value >= 0 && (value < 1 << 7) {
            let _ = self.view.set_u8(value as u8);
        } else if value < 0 && value >= -(1 << 5) {
            if Format::is_negative_fixed_int(value as u8) {
                let _ = self.view.set_u8(Format::NEGATIVE_FIXINT);
            } else {
                let _ = self.view.set_u8(value as u8);
            }
        } else if (value <= i8::MAX as i64) && (value >= i8::MIN as i64) {
            let _ = self.view.set_u8(Format::INT8);
            let _ = self.view.set_i8(value as i8);
        } else if (value <= i16::MAX as i64) && (value >= i16::MIN as i64) {
            let _ = self.view.set_u8(Format::INT16);
            let _ = self.view.set_i16(value as i16);
        } else if (value <= i32::MAX as i64) && (value >= i32::MIN as i64) {
            let _ = self.view.set_u8(Format::INT32);
            let _ = self.view.set_i32(value as i32);
        } else {
            let _ = self.view.set_u8(Format::INT64);
            let _ = self.view.set_i64(value);
        }
    }

    fn write_u8(&mut self, value: u8) {
        self.write_u64(value as u64);
    }

    fn write_u16(&mut self, value: u16) {
        self.write_u64(value as u64);
    }

    fn write_u32(&mut self, value: u32) {
        self.write_u64(value as u64);
    }

    fn write_u64(&mut self, value: u64) {
        if value < 1 << 7 {
            let _ = self.view.set_u8(value as u8);
        } else if value <= u8::MAX as u64 {
            let _ = self.view.set_u8(Format::UINT8);
            let _ = self.view.set_u8(value as u8);
        } else if value <= u16::MAX as u64 {
            let _ = self.view.set_u8(Format::UINT16);
            let _ = self.view.set_u16(value as u16);
        } else if value <= u32::MAX as u64 {
            let _ = self.view.set_u8(Format::UINT32);
            let _ = self.view.set_u32(value as u32);
        } else {
            let _ = self.view.set_u8(Format::UINT64);
            let _ = self.view.set_u64(value);
        }
    }

    fn write_f32(&mut self, value: f32) {
        let _ = self.view.set_u8(Format::FLOAT32);
        let _ = self.view.set_f32(value);
    }

    fn write_f64(&mut self, value: f64) {
        let _ = self.view.set_u8(Format::FLOAT64);
        let _ = self.view.set_f64(value);
    }

    fn write_string_length(&mut self, length: u32) {
        if length < 32 {
            if Format::is_fixed_string(length as u8) {
                let _ = self.view.set_u8(Format::FIXSTR);
            }
            let _ = self.view.set_u8(length as u8);
        } else if length <= u8::MAX as u32 {
            let _ = self.view.set_u8(Format::STR8);
            let _ = self.view.set_u8(length as u8);
        } else if length <= u16::MAX as u32 {
            let _ = self.view.set_u8(Format::STR16);
            let _ = self.view.set_u16(length as u16);
        } else {
            let _ = self.view.set_u8(Format::STR32);
            let _ = self.view.set_u32(length);
        }
    }

    fn write_string(&mut self, value: String) {
        let buf = String::as_bytes(&value);
        self.write_string_length(buf.len() as u32);
        let _ = self.view.set_bytes(buf);
    }

    fn write_bytes_length(&mut self, length: u32) {
        if length <= u8::MAX as u32 {
            let _ = self.view.set_u8(Format::BIN8);
            let _ = self.view.set_u8(length as u8);
        } else if length <= u16::MAX as u32 {
            let _ = self.view.set_u8(Format::BIN16);
            let _ = self.view.set_u16(length as u16);
        } else {
            let _ = self.view.set_u8(Format::BIN32);
            let _ = self.view.set_u32(length);
        }
    }

    fn write_bytes(&mut self, buf: &[u8]) -> Result {
        if buf.len() == 0 {
            self.write_nil();
            return Ok(());
        }
        self.write_bytes_length(buf.len() as u32);
        let _ = self.view.set_bytes(buf);
        Ok(())
    }

    fn write_bigint(&mut self, value: BigInt) {
        let val_str = value.to_string();
        self.write_string(val_str);
    }

    fn write_array_length(&mut self, length: u32) {
        if length < 16 {
            if Format::is_fixed_array(length as u8) {
                let _ = self.view.set_u8(Format::FIXARRAY);
            }
            let _ = self.view.set_u8(length as u8);
        } else if length <= u16::MAX as u32 {
            let _ = self.view.set_u8(Format::ARRAY16);
            let _ = self.view.set_u16(length as u16);
        } else {
            let _ = self.view.set_u8(Format::ARRAY32);
            let _ = self.view.set_u32(length);
        }
    }

    fn write_array<T>(&mut self, a: &[T], arr_fn: fn(&T)) {
        self.write_array_length(a.len() as u32);
        for item in a {
            arr_fn(item);
        }
    }

    fn write_map_length(&mut self, length: u32) {
        if length < 16 {
            if Format::is_fixed_map(length as u8) {
                let _ = self.view.set_u8(Format::FIXMAP);
            }
            let _ = self.view.set_u8(length as u8);
        } else if length <= u16::MAX as u32 {
            let _ = self.view.set_u8(Format::MAP16);
            let _ = self.view.set_u16(length as u16);
        } else {
            let _ = self.view.set_u8(Format::MAP32);
            let _ = self.view.set_u32(length);
        }
    }

    fn write_map<K: Eq + Hash, V>(&mut self, map: HashMap<K, V>, key_fn: fn(&K), val_fn: fn(&V)) {
        self.write_map_length(map.len() as u32);
        let keys = map.keys().into_iter();
        for key in keys {
            let value = map.get(&key).unwrap();
            key_fn(key);
            val_fn(value);
        }
    }

    fn write_nullable_bool(&mut self, value: Option<bool>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_bool(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_i8(&mut self, value: Option<i8>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_i8(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_i16(&mut self, value: Option<i16>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_i16(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_i32(&mut self, value: Option<i32>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_i32(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_i64(&mut self, value: Option<i64>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_i64(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_u8(&mut self, value: Option<u8>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_u8(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_u16(&mut self, value: Option<u16>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_u16(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_u32(&mut self, value: Option<u32>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_u32(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_u64(&mut self, value: Option<u64>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_u64(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_f32(&mut self, value: Option<f32>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_f32(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_f64(&mut self, value: Option<f64>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_f64(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_string(&mut self, value: Option<String>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_string(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_bytes(&mut self, buf: Option<Vec<u8>>) -> Result {
        if buf.is_none() {
            self.write_nil();
            return Ok(());
        }
        let buf: &[u8] = &buf.unwrap_or_default();
        let _ = self.write_bytes(buf);
        Ok(())
    }

    fn write_nullable_bigint(&mut self, value: Option<BigInt>) -> Result {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_bigint(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_array<T>(&mut self, a: Option<&[T]>, arr_fn: fn(&T)) -> Result {
        if a.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_array(a.unwrap(), arr_fn);
        Ok(())
    }

    fn write_nullable_map<K: Eq + Hash, V>(
        &mut self,
        map: Option<HashMap<K, V>>,
        key_fn: fn(&K),
        val_fn: fn(&V),
    ) -> Result {
        if map.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_map(map.unwrap(), key_fn, val_fn);
        Ok(())
    }

    fn context(&self) -> &Context {
        &self.context
    }
}
