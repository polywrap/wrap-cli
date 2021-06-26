use crate::Context;
use num_bigint::BigInt;
use std::collections::HashMap;
use std::hash::Hash;
use std::io::Result;

pub trait Read: Clone + Sized {
    fn read_bool(&mut self) -> Result<bool>;
    fn read_i8(&mut self) -> Result<i8>;
    fn read_i16(&mut self) -> Result<i16>;
    fn read_i32(&mut self) -> Result<i32>;
    fn read_i64(&mut self) -> Result<i64>;
    fn read_u8(&mut self) -> Result<u8>;
    fn read_u16(&mut self) -> Result<u16>;
    fn read_u32(&mut self) -> Result<u32>;
    fn read_u64(&mut self) -> Result<u64>;
    fn read_f32(&mut self) -> Result<f32>;
    fn read_f64(&mut self) -> Result<f64>;
    fn read_string_length(&mut self) -> Result<u32>;
    fn read_string(&mut self) -> Result<String>;
    fn read_bytes_length(&mut self) -> Result<u32>;
    fn read_bytes(&mut self) -> Result<Vec<u8>>;
    fn read_bigint(&mut self) -> Result<BigInt>;
    fn read_array_length(&mut self) -> Result<u32>;
    fn read_array<T>(&mut self, reader: impl FnMut(&mut Self) -> T) -> Result<Vec<T>>;
    fn read_map_length(&mut self) -> Result<u32>;
    fn read_map<K: Eq + Hash, V>(
        &mut self,
        key_fn: impl FnMut(&mut Self) -> K,
        val_fn: impl FnMut(&mut Self) -> V,
    ) -> HashMap<K, V>;
    fn read_nullable_bool(&mut self) -> Option<bool>;
    fn read_nullable_i8(&mut self) -> Option<i8>;
    fn read_nullable_i16(&mut self) -> Option<i16>;
    fn read_nullable_i32(&mut self) -> Option<i32>;
    fn read_nullable_i64(&mut self) -> Option<i64>;
    fn read_nullable_u8(&mut self) -> Option<u8>;
    fn read_nullable_u16(&mut self) -> Option<u16>;
    fn read_nullable_u32(&mut self) -> Option<u32>;
    fn read_nullable_u64(&mut self) -> Option<u64>;
    fn read_nullable_f32(&mut self) -> Option<f32>;
    fn read_nullable_f64(&mut self) -> Option<f64>;
    fn read_nullable_string(&mut self) -> Option<String>;
    fn read_nullable_bytes(&mut self) -> Option<Vec<u8>>;
    fn read_nullable_bigint(&mut self) -> Option<BigInt>;
    fn read_nullable_array<T>(&mut self, reader: impl FnMut(&mut Self) -> T) -> Option<Vec<T>>;
    fn read_nullable_map<K: Eq + Hash, V>(
        &mut self,
        key_fn: impl FnMut(&mut Self) -> K,
        val_fn: impl FnMut(&mut Self) -> V,
    ) -> Option<HashMap<K, V>>;
    fn is_next_nil(&mut self) -> bool;
    fn is_next_string(&mut self) -> bool;
    fn context(&mut self) -> &mut Context;
}
