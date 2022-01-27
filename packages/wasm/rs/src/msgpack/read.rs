use super::error::DecodingError;
use crate::{BigInt, Context, JSON};
use core::hash::Hash;
use std::collections::BTreeMap;

pub trait Read: Clone + Sized + std::io::Read {
    fn read_nil(&mut self) -> Result<(), DecodingError>;
    fn read_bool(&mut self) -> Result<bool, DecodingError>;
    fn read_i8(&mut self) -> Result<i8, DecodingError>;
    fn read_i16(&mut self) -> Result<i16, DecodingError>;
    fn read_i32(&mut self) -> Result<i32, DecodingError>;
    fn read_i64(&mut self) -> Result<i64, DecodingError>;
    fn read_u8(&mut self) -> Result<u8, DecodingError>;
    fn read_u16(&mut self) -> Result<u16, DecodingError>;
    fn read_u32(&mut self) -> Result<u32, DecodingError>;
    fn read_u64(&mut self) -> Result<u64, DecodingError>;
    fn read_f32(&mut self) -> Result<f32, DecodingError>;
    fn read_f64(&mut self) -> Result<f64, DecodingError>;
    fn read_string_length(&mut self) -> Result<u32, DecodingError>;
    fn read_string(&mut self) -> Result<String, DecodingError>;
    fn read_bytes_length(&mut self) -> Result<u32, DecodingError>;
    fn read_bytes(&mut self) -> Result<Vec<u8>, DecodingError>;
    fn read_bigint(&mut self) -> Result<BigInt, DecodingError>;
    fn read_json(&mut self) -> Result<JSON::Value, DecodingError>;
    fn read_array_length(&mut self) -> Result<u32, DecodingError>;
    fn read_array<T>(
        &mut self,
        reader: impl FnMut(&mut Self) -> Result<T, DecodingError>,
    ) -> Result<Vec<T>, DecodingError>;
    fn read_map_length(&mut self) -> Result<u32, DecodingError>;
    fn read_map<K, V>(
        &mut self,
        key_fn: impl FnMut(&mut Self) -> Result<K, DecodingError>,
        val_fn: impl FnMut(&mut Self) -> Result<V, DecodingError>,
    ) -> Result<BTreeMap<K, V>, DecodingError>
    where
        K: Eq + Hash + Ord;
    fn read_nullable_bool(&mut self) -> Result<Option<bool>, DecodingError>;
    fn read_nullable_i8(&mut self) -> Result<Option<i8>, DecodingError>;
    fn read_nullable_i16(&mut self) -> Result<Option<i16>, DecodingError>;
    fn read_nullable_i32(&mut self) -> Result<Option<i32>, DecodingError>;
    fn read_nullable_i64(&mut self) -> Result<Option<i64>, DecodingError>;
    fn read_nullable_u8(&mut self) -> Result<Option<u8>, DecodingError>;
    fn read_nullable_u16(&mut self) -> Result<Option<u16>, DecodingError>;
    fn read_nullable_u32(&mut self) -> Result<Option<u32>, DecodingError>;
    fn read_nullable_u64(&mut self) -> Result<Option<u64>, DecodingError>;
    fn read_nullable_f32(&mut self) -> Result<Option<f32>, DecodingError>;
    fn read_nullable_f64(&mut self) -> Result<Option<f64>, DecodingError>;
    fn read_nullable_string(&mut self) -> Result<Option<String>, DecodingError>;
    fn read_nullable_bytes(&mut self) -> Result<Option<Vec<u8>>, DecodingError>;
    fn read_nullable_bigint(&mut self) -> Result<Option<BigInt>, DecodingError>;
    fn read_nullable_json(&mut self) -> Result<Option<JSON::Value>, DecodingError>;
    fn read_nullable_array<T>(
        &mut self,
        reader: impl FnMut(&mut Self) -> Result<T, DecodingError>,
    ) -> Result<Option<Vec<T>>, DecodingError>;
    fn read_nullable_map<K, V>(
        &mut self,
        key_fn: impl FnMut(&mut Self) -> Result<K, DecodingError>,
        val_fn: impl FnMut(&mut Self) -> Result<V, DecodingError>,
    ) -> Result<Option<BTreeMap<K, V>>, DecodingError>
    where
        K: Eq + Hash + Ord;
    fn is_next_nil(&mut self) -> Result<bool, DecodingError>;
    fn is_next_string(&mut self) -> Result<bool, DecodingError>;
    fn context(&mut self) -> &mut Context;
}
