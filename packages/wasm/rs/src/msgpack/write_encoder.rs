use super::context::Context;
use super::data_view::DataView;
use super::format::Format;
use super::write::Write;
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::hash::Hash;
use std::io::Result;
use wasm_bindgen::UnwrapThrowExt;

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct WriteEncoder {
    context: Context,
    view: DataView,
}

impl WriteEncoder {
    pub fn new(ua: &[u8], context: Context) -> Self {
        Self {
            context: context.clone(),
            view: DataView::new(ua, context).expect_throw("Error creating new data view"),
        }
    }
}

impl Write for WriteEncoder {
    fn write_nil(&mut self) {
        self.view
            .set_u8(Format::NIL)
            .expect_throw("Failed to set u8 to data view");
    }

    fn write_bool(&mut self, value: bool) {
        if value {
            self.view
                .set_u8(Format::TRUE)
                .expect_throw("Failed to set u8 to data view");
        } else {
            self.view
                .set_u8(Format::FALSE)
                .expect_throw("Failed to set u8 to data view");
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
            self.view
                .set_u8(value as u8)
                .expect_throw("Failed to set u8 to data view");
        } else if value < 0 && value >= -(1 << 5) {
            if Format::is_negative_fixed_int(value as u8) {
                self.view
                    .set_u8(Format::NEGATIVE_FIXINT)
                    .expect_throw("Failed to set u8 to data view");
            } else {
                self.view
                    .set_u8(value as u8)
                    .expect_throw("Failed to set u8 to data view");
            }
        } else if (value <= i8::MAX as i64) && (value >= i8::MIN as i64) {
            self.view
                .set_u8(Format::INT8)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_i8(value as i8)
                .expect_throw("Failed to set i8 to data view");
        } else if (value <= i16::MAX as i64) && (value >= i16::MIN as i64) {
            self.view
                .set_u8(Format::INT16)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_i16(value as i16)
                .expect_throw("Failed to set i16 to data view");
        } else if (value <= i32::MAX as i64) && (value >= i32::MIN as i64) {
            self.view
                .set_u8(Format::INT32)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_i32(value as i32)
                .expect_throw("Failed to set i32 to data view");
        } else {
            self.view
                .set_u8(Format::INT64)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_i64(value)
                .expect_throw("Failed to set i64 to data view");
        }
    }

    fn write_u8(&mut self, value: &u8) {
        self.write_u64(&(*value as u64));
    }

    fn write_u16(&mut self, value: u16) {
        self.write_u64(&(value as u64));
    }

    fn write_u32(&mut self, value: &u32) {
        self.write_u64(&(*value as u64));
    }

    fn write_u64(&mut self, value: &u64) {
        if value < &(1 << 7) {
            self.view
                .set_u8(*value as u8)
                .expect_throw("Failed to set u8 to data view");
        } else if value <= &(u8::MAX as u64) {
            self.view
                .set_u8(Format::UINT8)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u8(*value as u8)
                .expect_throw("Failed to set u8 to data view");
        } else if value <= &(u16::MAX as u64) {
            self.view
                .set_u8(Format::UINT16)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u16(*value as u16)
                .expect_throw("Failed to set u16 to data view");
        } else if value <= &(u32::MAX as u64) {
            self.view
                .set_u8(Format::UINT32)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u32(*value as u32)
                .expect_throw("Failed to set u32 to data view");
        } else {
            self.view
                .set_u8(Format::UINT64)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u64(*value)
                .expect_throw("Failed to set u64 to data view");
        }
    }

    fn write_f32(&mut self, value: f32) {
        self.view
            .set_u8(Format::FLOAT32)
            .expect_throw("Failed to set u8 to data view");
        self.view
            .set_f32(value)
            .expect_throw("Failed to set f32 to data view");
    }

    fn write_f64(&mut self, value: f64) {
        self.view
            .set_u8(Format::FLOAT64)
            .expect_throw("Failed to set u8 to data view");
        self.view
            .set_f64(value)
            .expect_throw("Failed to set f64 to data view");
    }

    fn write_string_length(&mut self, length: u32) {
        if length < 32 {
            if Format::is_fixed_string(length as u8) {
                self.view
                    .set_u8(Format::FIXSTR)
                    .expect_throw("Failed to set u8 to data view");
            }
            self.view
                .set_u8(length as u8)
                .expect_throw("Failed to set u8 to data view");
        } else if length <= u8::MAX as u32 {
            self.view
                .set_u8(Format::STR8)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u8(length as u8)
                .expect_throw("Failed to set u8 to data view");
        } else if length <= u16::MAX as u32 {
            self.view
                .set_u8(Format::STR16)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u16(length as u16)
                .expect_throw("Failed to set u16 to data view");
        } else {
            self.view
                .set_u8(Format::STR32)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u32(length)
                .expect_throw("Failed to set u32 to data view");
        }
    }

    fn write_string(&mut self, value: &String) {
        let buf = String::as_bytes(&value);
        self.write_string_length(buf.len() as u32);
        self.view
            .set_bytes(buf)
            .expect_throw("Failed to set bytes to data view");
    }

    fn write_bytes_length(&mut self, length: u32) {
        if length <= u8::MAX as u32 {
            self.view
                .set_u8(Format::BIN8)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u8(length as u8)
                .expect_throw("Failed to set u8 to data view");
        } else if length <= u16::MAX as u32 {
            self.view
                .set_u8(Format::BIN16)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u16(length as u16)
                .expect_throw("Failed to set u16 to data view");
        } else {
            self.view
                .set_u8(Format::BIN32)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u32(length)
                .expect_throw("Failed to set u32 to data view");
        }
    }

    fn write_bytes(&mut self, buf: &Vec<u8>) {
        if buf.len() == 0 {
            self.write_nil();
        } else {
            self.write_bytes_length(buf.len() as u32);
            self.view
                .set_bytes(buf.as_slice())
                .expect_throw("Failed to set bytes to data view");
        }
    }

    fn write_bigint(&mut self, value: BigInt) {
        let val_str = value.to_string();
        self.write_string(&val_str);
    }

    fn write_array_length(&mut self, length: u32) {
        if length < 16 {
            if Format::is_fixed_array(length as u8) {
                self.view
                    .set_u8(Format::FIXARRAY)
                    .expect_throw("Failed to set u8 to data view");
            }
            self.view
                .set_u8(length as u8)
                .expect_throw("Failed to set u8 to data view");
        } else if length <= u16::MAX as u32 {
            self.view
                .set_u8(Format::ARRAY16)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u16(length as u16)
                .expect_throw("Failed to set u16 to data view");
        } else {
            self.view
                .set_u8(Format::ARRAY32)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u32(length)
                .expect_throw("Failed to set u32 to data view");
        }
    }

    fn write_array<T>(&mut self, a: &[T], mut arr_fn: impl FnMut(&mut Self, &T)) {
        self.write_array_length(a.len() as u32);
        for element in a {
            arr_fn(self, &element);
        }
    }

    fn write_map_length(&mut self, length: u32) {
        if length < 16 {
            if Format::is_fixed_map(length as u8) {
                self.view
                    .set_u8(Format::FIXMAP)
                    .expect_throw("Failed to set u8 to data view");
            }
            self.view
                .set_u8(length as u8)
                .expect_throw("Failed to set u8 to data view");
        } else if length <= u16::MAX as u32 {
            self.view
                .set_u8(Format::MAP16)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u16(length as u16)
                .expect_throw("Failed to set u16 to data view");
        } else {
            self.view
                .set_u8(Format::MAP32)
                .expect_throw("Failed to set u8 to data view");
            self.view
                .set_u32(length)
                .expect_throw("Failed to set u32 to data view");
        }
    }

    fn write_map<K: Eq + Hash, V>(
        &mut self,
        map: HashMap<K, V>,
        mut key_fn: impl FnMut(&mut Self, &K),
        mut val_fn: impl FnMut(&mut Self, &V),
    ) {
        self.write_map_length(map.len() as u32);
        let keys: Vec<_> = map.keys().into_iter().collect();
        for key in keys {
            let value = map.get(&key).unwrap();
            key_fn(self, key);
            val_fn(self, value);
        }
    }

    fn write_nullable_bool(&mut self, value: Option<bool>) -> Result<()> {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_bool(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_i8(&mut self, value: Option<i8>) -> Result<()> {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_i8(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_i16(&mut self, value: Option<i16>) -> Result<()> {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_i16(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_i32(&mut self, value: Option<i32>) -> Result<()> {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_i32(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_i64(&mut self, value: Option<i64>) -> Result<()> {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_i64(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_u8(&mut self, value: Option<u8>) -> Result<()> {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_u8(&value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_u16(&mut self, value: Option<u16>) -> Result<()> {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_u16(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_u32(&mut self, value: &Option<u32>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_u32(&value.unwrap_or_default());
        }
    }

    fn write_nullable_u64(&mut self, value: &Option<u64>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_u64(&value.unwrap_or_default());
        }
    }

    fn write_nullable_f32(&mut self, value: Option<f32>) -> Result<()> {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_f32(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_f64(&mut self, value: Option<f64>) -> Result<()> {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_f64(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_string(&mut self, value: &Option<String>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_string(&value.as_ref().unwrap());
        }
    }

    fn write_nullable_bytes(&mut self, buf: Option<Vec<u8>>) -> Result<()> {
        if buf.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_bytes(&buf.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_bigint(&mut self, value: Option<BigInt>) -> Result<()> {
        if value.is_none() {
            self.write_nil();
            return Ok(());
        }
        self.write_bigint(value.unwrap_or_default());
        Ok(())
    }

    fn write_nullable_array<T>(&mut self, a: &Option<Vec<T>>, arr_fn: impl FnMut(&mut Self, &T)) {
        if a.is_none() {
            self.write_nil();
        } else {
            self.write_array(a.as_ref().unwrap().as_slice(), arr_fn);
        }
    }

    fn write_nullable_map<K: Eq + Hash, V>(
        &mut self,
        map: Option<HashMap<K, V>>,
        key_fn: impl FnMut(&mut Self, &K),
        val_fn: impl FnMut(&mut Self, &V),
    ) {
        if map.is_none() {
            self.write_nil();
        } else {
            self.write_map(map.unwrap(), key_fn, val_fn);
        }
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
