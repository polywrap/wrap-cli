use crate::Context;
use alloc::{collections::BTreeMap, string::String, vec::Vec};
use core::hash::Hash;
use num_bigint::BigInt;

pub trait Write: Clone {
    fn write_nil(&mut self);
    fn write_bool(&mut self, value: bool);
    fn write_i8(&mut self, value: i8);
    fn write_i16(&mut self, value: i16);
    fn write_i32(&mut self, value: i32);
    fn write_i64(&mut self, value: i64);
    fn write_u8(&mut self, value: u8);
    fn write_u16(&mut self, value: u16);
    fn write_u32(&mut self, value: u32);
    fn write_u64(&mut self, value: u64);
    fn write_f32(&mut self, value: f32);
    fn write_f64(&mut self, value: f64);
    fn write_string_length(&mut self, length: u32);
    fn write_string(&mut self, value: &String);
    fn write_str(&mut self, value: &str);
    fn write_bytes_length(&mut self, length: u32);
    fn write_bytes(&mut self, buf: &[u8]);
    fn write_bigint(&mut self, value: &BigInt);
    fn write_array_length(&mut self, length: u32);
    fn write_array<T: Clone>(&mut self, a: &[T], arr_fn: impl FnMut(&mut Self, &T));
    fn write_map_length(&mut self, length: u32);
    fn write_map<K, V: Clone>(
        &mut self,
        map: &BTreeMap<K, V>,
        key_fn: impl FnMut(&mut Self, &K),
        val_fn: impl FnMut(&mut Self, &V),
    ) where
        K: Clone + Eq + Hash + Ord;
    fn write_nullable_bool(&mut self, value: &Option<bool>);
    fn write_nullable_i8(&mut self, value: &Option<i8>);
    fn write_nullable_i16(&mut self, value: &Option<i16>);
    fn write_nullable_i32(&mut self, value: &Option<i32>);
    fn write_nullable_i64(&mut self, value: &Option<i64>);
    fn write_nullable_u8(&mut self, value: &Option<u8>);
    fn write_nullable_u16(&mut self, value: &Option<u16>);
    fn write_nullable_u32(&mut self, value: &Option<u32>);
    fn write_nullable_u64(&mut self, value: &Option<u64>);
    fn write_nullable_f32(&mut self, value: &Option<f32>);
    fn write_nullable_f64(&mut self, value: &Option<f64>);
    fn write_nullable_string(&mut self, value: &Option<String>);
    fn write_nullable_bytes(&mut self, buf: &Option<Vec<u8>>);
    fn write_nullable_bigint(&mut self, value: &Option<BigInt>);
    fn write_nullable_array<T: Clone>(
        &mut self,
        a: &Option<Vec<T>>,
        arr_fn: impl FnMut(&mut Self, &T),
    );
    fn write_nullable_map<K, V: Clone>(
        &mut self,
        map: &Option<BTreeMap<K, V>>,
        key_fn: impl FnMut(&mut Self, &K),
        val_fn: impl FnMut(&mut Self, &V),
    ) where
        K: Clone + Eq + Hash + Ord;
    fn context(&mut self) -> &Context;
}
