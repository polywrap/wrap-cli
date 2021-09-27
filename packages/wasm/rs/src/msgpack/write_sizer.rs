use super::{Context, Write};
use crate::{BigInt, JSON};
use alloc::{
    collections::BTreeMap,
    string::{String, ToString},
    vec::Vec,
};
use core::hash::Hash;

#[derive(Clone, Debug, Default)]
pub struct WriteSizer {
    pub length: i32,
    context: Context,
}

impl WriteSizer {
    #[allow(dead_code)]
    pub fn new(context: Context) -> Self {
        Self { length: 0, context }
    }

    pub fn get_length(&self) -> i32 {
        self.length
    }
}

impl Write for WriteSizer {
    fn write_nil(&mut self) {
        self.length += 1;
    }

    fn write_bool(&mut self, _value: bool) {
        self.length += 1;
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
        if value >= -(1 << 5) && value < 1 << 7 {
            self.length += 1;
        } else if value < 1 << 7 && value >= -(1 << 7) {
            self.length += 2;
        } else if value < 1 << 15 && value >= -(1 << 15) {
            self.length += 3;
        } else if value < 1 << 31 && value >= -(1 << 31) {
            self.length += 5;
        } else {
            self.length += 9;
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
        if value < (1 << 7) {
            self.length += 1;
        } else if value < (1 << 8) {
            self.length += 2;
        } else if value < (1 << 16) {
            self.length += 3;
        } else if value < (1 << 32) {
            self.length += 5;
        } else {
            self.length += 9;
        }
    }

    fn write_f32(&mut self, _value: f32) {
        self.length += 5;
    }

    fn write_f64(&mut self, _value: f64) {
        self.length += 9;
    }

    fn write_string_length(&mut self, length: u32) {
        if length < 32 {
            self.length += 1;
        } else if length <= u8::MAX as u32 {
            self.length += 2;
        } else if length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
        }
    }

    fn write_string(&mut self, value: &String) {
        self.write_string_length(value.len() as u32);
        self.length += value.len() as i32;
    }

    fn write_str(&mut self, value: &str) {
        self.write_string_length(value.len() as u32);
        self.length += value.len() as i32;
    }

    fn write_bytes_length(&mut self, length: u32) {
        if length <= u8::MAX as u32 {
            self.length += 2;
        } else if length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
        }
    }

    fn write_bytes(&mut self, value: &[u8]) {
        if value.is_empty() {
            self.length += 1;
        } else {
            self.write_bytes_length(value.len() as u32);
            self.length += value.len() as i32;
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
            self.length += 1;
        } else if length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
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
            self.length += 1;
        } else if length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
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

    fn write_nullable_i64(&mut self, value: &Option<i64>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_i64(value.unwrap());
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

    fn write_nullable_u64(&mut self, value: &Option<u64>) {
        if value.is_none() {
            self.write_nil();
        } else {
            self.write_u64(value.unwrap());
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
