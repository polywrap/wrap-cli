use super::error::MsgPackError;
use crate::{BigInt, Context, JSON};
use core::hash::Hash;
use std::collections::BTreeMap;

pub trait Read: Clone + Sized + std::io::Read {
    fn read_bool(&mut self) -> Result<bool, MsgPackError>;
    fn read_i8(&mut self) -> Result<i8, MsgPackError>;
    fn read_i16(&mut self) -> Result<i16, MsgPackError>;
    fn read_i32(&mut self) -> Result<i32, MsgPackError>;
    fn read_u8(&mut self) -> Result<u8, MsgPackError>;
    fn read_u16(&mut self) -> Result<u16, MsgPackError>;
    fn read_u32(&mut self) -> Result<u32, MsgPackError>;
    fn read_f32(&mut self) -> Result<f32, MsgPackError>;
    fn read_f64(&mut self) -> Result<f64, MsgPackError>;
    fn read_string_length(&mut self) -> Result<u32, MsgPackError>;
    fn read_string(&mut self) -> Result<String, MsgPackError>;
    fn read_bytes_length(&mut self) -> Result<u32, MsgPackError>;
    fn read_bytes(&mut self) -> Result<Vec<u8>, MsgPackError>;
    fn read_bigint(&mut self) -> Result<BigInt, MsgPackError>;
    fn read_json(&mut self) -> Result<JSON::Value, MsgPackError>;
    fn read_array_length(&mut self) -> Result<u32, MsgPackError>;
    fn read_array<T>(&self, reader: impl FnMut(&mut Self) -> T) -> Result<Vec<T>, MsgPackError>;
    fn read_map_length(&mut self) -> Result<u32, MsgPackError>;
    fn read_map<K, V>(
        &mut self,
        key_fn: impl FnMut(&mut Self) -> K,
        val_fn: impl FnMut(&mut Self) -> V,
    ) -> Result<BTreeMap<K, V>, MsgPackError>
    where
        K: Eq + Hash + Ord;
    fn read_nullable_bool(&mut self) -> Result<Option<bool>, MsgPackError>;
    fn read_nullable_i8(&mut self) -> Result<Option<i8>, MsgPackError>;
    fn read_nullable_i16(&mut self) -> Result<Option<i16>, MsgPackError>;
    fn read_nullable_i32(&mut self) -> Result<Option<i32>, MsgPackError>;
    fn read_nullable_u8(&mut self) -> Result<Option<u8>, MsgPackError>;
    fn read_nullable_u16(&mut self) -> Result<Option<u16>, MsgPackError>;
    fn read_nullable_u32(&mut self) -> Result<Option<u32>, MsgPackError>;
    fn read_nullable_f32(&mut self) -> Result<Option<f32>, MsgPackError>;
    fn read_nullable_f64(&mut self) -> Result<Option<f64>, MsgPackError>;
    fn read_nullable_string(&mut self) -> Result<Option<String>, MsgPackError>;
    fn read_nullable_bytes(&mut self) -> Result<Option<Vec<u8>>, MsgPackError>;
    fn read_nullable_bigint(&mut self) -> Result<Option<BigInt>, MsgPackError>;
    fn read_nullable_json(&mut self) -> Result<Option<JSON::Value>, MsgPackError>;
    fn read_nullable_array<T>(
        &mut self,
        reader: impl FnMut(&mut Self) -> T,
    ) -> Result<Option<Vec<T>>, MsgPackError>;
    fn read_nullable_map<K, V>(
        &mut self,
        key_fn: impl FnMut(&mut Self) -> K,
        val_fn: impl FnMut(&mut Self) -> V,
    ) -> Result<Option<BTreeMap<K, V>>, MsgPackError>
    where
        K: Eq + Hash + Ord;
    fn is_next_nil(&mut self) -> bool;
    fn is_next_string(&mut self) -> bool;
    fn context(&mut self) -> &mut Context;
}
