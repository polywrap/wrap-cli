use super::error::EncodingError;
use crate::{BigInt, Context, JSON};
use core::hash::Hash;
use std::collections::BTreeMap;

pub trait Write: Clone + std::io::Write {
    fn write_nil(&mut self) -> Result<(), EncodingError>;
    fn write_bool(&mut self, value: bool) -> Result<(), EncodingError>;
    fn write_i8(&mut self, value: i8) -> Result<(), EncodingError>;
    fn write_i16(&mut self, value: i16) -> Result<(), EncodingError>;
    fn write_i32(&mut self, value: i32) -> Result<(), EncodingError>;
    fn write_i64(&mut self, value: i64) -> Result<(), EncodingError>;
    fn write_u8(&mut self, value: u8) -> Result<(), EncodingError>;
    fn write_u16(&mut self, value: u16) -> Result<(), EncodingError>;
    fn write_u32(&mut self, value: u32) -> Result<(), EncodingError>;
    fn write_u64(&mut self, value: u64) -> Result<(), EncodingError>;
    fn write_f32(&mut self, value: f32) -> Result<(), EncodingError>;
    fn write_f64(&mut self, value: f64) -> Result<(), EncodingError>;
    fn write_string_length(&mut self, length: u32) -> Result<(), EncodingError>;
    fn write_string(&mut self, value: &String) -> Result<(), EncodingError>;
    fn write_str(&mut self, value: &str) -> Result<(), EncodingError>;
    fn write_bytes_length(&mut self, length: u32) -> Result<(), EncodingError>;
    fn write_bytes(&mut self, buf: &[u8]) -> Result<(), EncodingError>;
    fn write_bigint(&mut self, value: &BigInt) -> Result<(), EncodingError>;
    fn write_json(&mut self, value: &JSON::Value) -> Result<(), EncodingError>;
    fn write_array_length(&mut self, length: u32) -> Result<(), EncodingError>;
    fn write_array<T: Clone>(
        &mut self,
        a: &[T],
        arr_fn: impl FnMut(&mut Self, &T),
    ) -> Result<(), EncodingError>;
    fn write_map_length(&mut self, length: u32) -> Result<(), EncodingError>;
    fn write_map<K, V: Clone>(
        &mut self,
        map: &BTreeMap<K, V>,
        key_fn: impl FnMut(&mut Self, &K),
        val_fn: impl FnMut(&mut Self, &V),
    ) -> Result<(), EncodingError>
    where
        K: Clone + Eq + Hash + Ord;
    fn write_nullable_bool(&mut self, value: &Option<bool>) -> Result<(), EncodingError>;
    fn write_nullable_i8(&mut self, value: &Option<i8>) -> Result<(), EncodingError>;
    fn write_nullable_i16(&mut self, value: &Option<i16>) -> Result<(), EncodingError>;
    fn write_nullable_i32(&mut self, value: &Option<i32>) -> Result<(), EncodingError>;
    fn write_nullable_i64(&mut self, value: &Option<i64>) -> Result<(), EncodingError>;
    fn write_nullable_u8(&mut self, value: &Option<u8>) -> Result<(), EncodingError>;
    fn write_nullable_u16(&mut self, value: &Option<u16>) -> Result<(), EncodingError>;
    fn write_nullable_u32(&mut self, value: &Option<u32>) -> Result<(), EncodingError>;
    fn write_nullable_u64(&mut self, value: &Option<u64>) -> Result<(), EncodingError>;
    fn write_nullable_f32(&mut self, value: &Option<f32>) -> Result<(), EncodingError>;
    fn write_nullable_f64(&mut self, value: &Option<f64>) -> Result<(), EncodingError>;
    fn write_nullable_string(&mut self, value: &Option<String>) -> Result<(), EncodingError>;
    fn write_nullable_bytes(&mut self, value: &Option<Vec<u8>>) -> Result<(), EncodingError>;
    fn write_nullable_bigint(&mut self, value: &Option<BigInt>) -> Result<(), EncodingError>;
    fn write_nullable_json(&mut self, value: &Option<JSON::Value>) -> Result<(), EncodingError>;
    fn write_nullable_array<T: Clone>(
        &mut self,
        a: &Option<Vec<T>>,
        arr_fn: impl FnMut(&mut Self, &T),
    ) -> Result<(), EncodingError>;
    fn write_nullable_map<K, V: Clone>(
        &mut self,
        map: &Option<BTreeMap<K, V>>,
        key_fn: impl FnMut(&mut Self, &K),
        val_fn: impl FnMut(&mut Self, &V),
    ) -> Result<(), EncodingError>
    where
        K: Clone + Eq + Hash + Ord;
    fn context(&mut self) -> &mut Context;
}
