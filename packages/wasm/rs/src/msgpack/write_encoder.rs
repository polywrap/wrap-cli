use super::{Context, DataView, Format, Write};
use crate::{BigInt, JSON};
use core::hash::Hash;
use std::collections::BTreeMap;

#[derive(Clone, Debug, Default)]
pub struct WriteEncoder {
    context: Context,
    view: DataView,
}

impl WriteEncoder {
    pub fn new(buf: &[u8], context: Context) -> Self {
        Self {
            context: context.clone(),
            view: DataView::new(buf, Some(context), None, None)
                .expect("Error creating new data view"),
        }
    }
}

impl Write for WriteEncoder {
    fn write_nil(&mut self) {
        self.view.set_u8(Format::NIL);
    }

    fn write_bool(&mut self, value: bool) {
        if value {
            self.view.set_u8(Format::TRUE);
        } else {
            self.view.set_u8(Format::FALSE);
        }
    }

    fn write_i8(&mut self, value: i8) {
        self.write_i32(value as i32);
    }

    fn write_i16(&mut self, value: i16) {
        self.write_i32(value as i32);
    }

    fn write_i32(&mut self, value: i32) {
        if value >= 0 && value < 1 << 7 {
            self.view.set_u8(value as u8);
        } else if value < 0 && value >= -(1 << 5) {
            if Format::is_negative_fixed_int(value as u8) {
                self.view.set_u8(Format::NEGATIVE_FIXINT);
            } else {
                self.view.set_u8(value as u8);
            }
        } else if (value <= i8::MAX as i32) && (value >= i8::MIN as i32) {
            self.view.set_u8(Format::INT8);
            self.view.set_i8(value as i8);
        } else if (value <= i16::MAX as i32) && (value >= i16::MIN as i32) {
            self.view.set_u8(Format::INT16);
            self.view.set_i16(value as i16);
        } else {
            self.view.set_u8(Format::INT32);
            self.view.set_i32(value);
        }
    }

    fn write_u8(&mut self, value: u8) {
        self.write_u32(value as u32);
    }

    fn write_u16(&mut self, value: u16) {
        self.write_u32(value as u32);
    }

    fn write_u32(&mut self, value: u32) {
        if value < (1 << 7) {
            self.view.set_u8(value as u8);
        } else if value <= (u8::MAX as u32) {
            self.view.set_u8(Format::UINT8);
            self.view.set_u8(value as u8);
        } else if value <= (u16::MAX as u32) {
            self.view.set_u8(Format::UINT16);
            self.view.set_u16(value as u16);
        } else {
            self.view.set_u8(Format::UINT32);
            self.view.set_u32(value);
        }
    }

    fn write_f32(&mut self, value: f32) {
        self.view.set_u8(Format::FLOAT32);
        self.view.set_f32(value);
    }

    fn write_f64(&mut self, value: f64) {
        self.view.set_u8(Format::FLOAT64);
        self.view.set_f64(value);
    }

    fn write_string_length(&mut self, length: u32) {
        if length < 32 {
            if Format::is_fixed_string(length as u8) {
                self.view.set_u8(Format::FIXSTR);
            }
            self.view.set_u8(length as u8);
        } else if length <= u8::MAX as u32 {
            self.view.set_u8(Format::STR8);
            self.view.set_u8(length as u8);
        } else if length <= u16::MAX as u32 {
            self.view.set_u8(Format::STR16);
            self.view.set_u16(length as u16);
        } else {
            self.view.set_u8(Format::STR32);
            self.view.set_u32(length);
        }
    }

    fn write_string(&mut self, value: &String) {
        let buf = value.as_bytes();
        self.write_string_length(buf.len() as u32);
        self.view.set_bytes(buf);
    }

    fn write_str(&mut self, value: &str) {
        let buf = value.as_bytes();
        self.write_string_length(buf.len() as u32);
        self.view.set_bytes(buf);
    }

    fn write_bytes_length(&mut self, length: u32) {
        if length <= u8::MAX as u32 {
            self.view.set_u8(Format::BIN8);
            self.view.set_u8(length as u8);
        } else if length <= u16::MAX as u32 {
            self.view.set_u8(Format::BIN16);
            self.view.set_u16(length as u16);
        } else {
            self.view.set_u8(Format::BIN32);
            self.view.set_u32(length);
        }
    }

    fn write_bytes(&mut self, buf: &[u8]) {
        if buf.is_empty() {
            self.write_nil();
        } else {
            self.write_bytes_length(buf.len() as u32);
            self.view.set_bytes(buf);
        }
    }

    fn write_bigint(&mut self, value: &BigInt) {
        self.write_string(&value.to_string());
    }

    fn write_json(&mut self, value: &JSON::Value) {
        self.write_str(value.as_str().unwrap());
    }

    fn write_array_length(&mut self, length: u32) {
        if length < 16 {
            if Format::is_fixed_array(length as u8) {
                self.view.set_u8(Format::FIXARRAY);
            }
            self.view.set_u8(length as u8);
        } else if length <= u16::MAX as u32 {
            self.view.set_u8(Format::ARRAY16);
            self.view.set_u16(length as u16);
        } else {
            self.view.set_u8(Format::ARRAY32);
            self.view.set_u32(length);
        }
    }

    fn write_array<T: Clone>(&mut self, a: &[T], mut arr_fn: impl FnMut(&mut Self, &T)) {
        self.write_array_length(a.len() as u32);
        for element in a {
            arr_fn(self, element);
        }
    }

    fn write_map_length(&mut self, length: u32) {
        if length < 16 {
            if Format::is_fixed_map(length as u8) {
                self.view.set_u8(Format::FIXMAP);
            }
            self.view.set_u8(length as u8);
        } else if length <= u16::MAX as u32 {
            self.view.set_u8(Format::MAP16);
            self.view.set_u16(length as u16);
        } else {
            self.view.set_u8(Format::MAP32);
            self.view.set_u32(length);
        }
    }

    fn write_map<K, V: Clone>(
        &mut self,
        map: &BTreeMap<K, V>,
        mut key_fn: impl FnMut(&mut Self, &K),
        mut val_fn: impl FnMut(&mut Self, &V),
    ) where
        K: Clone + Eq + Hash + Ord,
    {
        self.write_map_length(map.len() as u32);
        let keys: Vec<_> = map.keys().into_iter().collect();
        for key in keys {
            let value = map.get(key).unwrap();
            key_fn(self, key);
            val_fn(self, value);
        }
    }

    fn write_nullable_bool(&mut self, value: &Option<bool>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_bool(value.unwrap());
        }
    }

    fn write_nullable_i8(&mut self, value: &Option<i8>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_i8(value.unwrap());
        }
    }

    fn write_nullable_i16(&mut self, value: &Option<i16>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_i16(value.unwrap());
        }
    }

    fn write_nullable_i32(&mut self, value: &Option<i32>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_i32(value.unwrap());
        }
    }

    fn write_nullable_u8(&mut self, value: &Option<u8>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_u8(value.unwrap());
        }
    }

    fn write_nullable_u16(&mut self, value: &Option<u16>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_u16(value.unwrap());
        }
    }

    fn write_nullable_u32(&mut self, value: &Option<u32>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_u32(value.unwrap());
        }
    }

    fn write_nullable_f32(&mut self, value: &Option<f32>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_f32(value.unwrap());
        }
    }

    fn write_nullable_f64(&mut self, value: &Option<f64>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_f64(value.unwrap());
        }
    }

    fn write_nullable_string(&mut self, value: &Option<String>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_string(value.as_ref().unwrap());
        }
    }

    fn write_nullable_bytes(&mut self, value: &Option<Vec<u8>>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_bytes(value.as_ref().unwrap());
        }
    }

    fn write_nullable_bigint(&mut self, value: &Option<BigInt>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_bigint(value.as_ref().unwrap());
        }
    }

    fn write_nullable_json(&mut self, value: &Option<JSON::Value>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_json(value.as_ref().unwrap());
        }
    }

    fn write_nullable_array<T: Clone>(
        &mut self,
        a: &Option<Vec<T>>,
        arr_fn: impl FnMut(&mut Self, &T),
    ) {
        if a.is_none() {
            self.write_nil();
        } else {
            self.write_array(a.as_ref().unwrap(), arr_fn);
        }
    }

    fn write_nullable_map<K, V: Clone>(
        &mut self,
        map: &Option<BTreeMap<K, V>>,
        key_fn: impl FnMut(&mut Self, &K),
        val_fn: impl FnMut(&mut Self, &V),
    ) where
        K: Clone + Eq + Hash + Ord,
    {
        if map.is_none() {
            self.write_nil();
        } else {
            self.write_map(map.as_ref().unwrap(), key_fn, val_fn);
        }
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
