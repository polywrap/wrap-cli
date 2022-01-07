use super::error::DecodingError;
use crate::{BigInt, Context, JSON};
use core::hash::Hash;
use std::collections::BTreeMap;
use std::io::Read as IoRead;

pub trait Read: Clone + Sized {
    fn read_bool<R: IoRead>(&self, reader: &mut R) -> Result<bool, DecodingError>;
    fn read_i8<R: IoRead>(&self, reader: &mut R) -> Result<i8, DecodingError>;
    fn read_i16<R: IoRead>(&self, reader: &mut R) -> Result<i16, DecodingError>;
    fn read_i32<R: IoRead>(&self, reader: &mut R) -> Result<i32, DecodingError>;
    fn read_u8<R: IoRead>(&self, reader: &mut R) -> Result<u8, DecodingError>;
    fn read_u16<R: IoRead>(&self, reader: &mut R) -> Result<u16, DecodingError>;
    fn read_u32<R: IoRead>(&self, reader: &mut R) -> Result<u32, DecodingError>;
    fn read_f32<R: IoRead>(&self, reader: &mut R) -> Result<f32, DecodingError>;
    fn read_f64<R: IoRead>(&self, reader: &mut R) -> Result<f64, DecodingError>;
    fn read_string_length<R: IoRead>(&self, reader: &mut R) -> Result<u32, DecodingError>;
    fn read_string<R: IoRead>(&self, reader: &mut R) -> Result<String, DecodingError>;
    fn read_bytes_length<R: IoRead>(&self, reader: &mut R) -> Result<u32, DecodingError>;
    fn read_bytes<R: IoRead>(&self, reader: &mut R) -> Result<Vec<u8>, DecodingError>;
    fn read_bigint<R: IoRead>(&self, reader: &mut R) -> Result<BigInt, DecodingError>;
    fn read_json<R: IoRead>(&self, reader: &mut R) -> Result<JSON::Value, DecodingError>;
    fn read_array_length<R: IoRead>(&self, reader: &mut R) -> Result<u32, DecodingError>;
    fn read_array<R: IoRead, T>(
        &self,
        reader: impl FnMut(&mut R) -> T,
    ) -> Result<Vec<T>, DecodingError>;
    fn read_map_length<R: IoRead>(&self, reader: &mut R) -> Result<u32, DecodingError>;
    fn read_map<K, V, R: IoRead>(
        &self,
        reader: &mut R,
        key_fn: impl FnMut(&mut R) -> K,
        val_fn: impl FnMut(&mut R) -> V,
    ) -> Result<BTreeMap<K, V>, DecodingError>
    where
        K: Eq + Hash + Ord;
    fn read_nullable_bool<R: IoRead>(&self, reader: &mut R) -> Result<Option<bool>, DecodingError>;
    fn read_nullable_i8<R: IoRead>(&self, reader: &mut R) -> Result<Option<i8>, DecodingError>;
    fn read_nullable_i16<R: IoRead>(&self, reader: &mut R) -> Result<Option<i16>, DecodingError>;
    fn read_nullable_i32<R: IoRead>(&self, reader: &mut R) -> Result<Option<i32>, DecodingError>;
    fn read_nullable_u8<R: IoRead>(&self, reader: &mut R) -> Result<Option<u8>, DecodingError>;
    fn read_nullable_u16<R: IoRead>(&self, reader: &mut R) -> Result<Option<u16>, DecodingError>;
    fn read_nullable_u32<R: IoRead>(&self, reader: &mut R) -> Result<Option<u32>, DecodingError>;
    fn read_nullable_f32<R: IoRead>(&self, reader: &mut R) -> Result<Option<f32>, DecodingError>;
    fn read_nullable_f64<R: IoRead>(&self, reader: &mut R) -> Result<Option<f64>, DecodingError>;
    fn read_nullable_string<R: IoRead>(
        &self,
        reader: &mut R,
    ) -> Result<Option<String>, DecodingError>;
    fn read_nullable_bytes<R: IoRead>(
        &self,
        reader: &mut R,
    ) -> Result<Option<Vec<u8>>, DecodingError>;
    fn read_nullable_bigint<R: IoRead>(
        &self,
        reader: &mut R,
    ) -> Result<Option<BigInt>, DecodingError>;
    fn read_nullable_json<R: IoRead>(
        &self,
        reader: &mut R,
    ) -> Result<Option<JSON::Value>, DecodingError>;
    fn read_nullable_array<R: IoRead, T>(
        &self,
        reader: impl FnMut(&mut R) -> T,
    ) -> Result<Option<Vec<T>>, DecodingError>;
    fn read_nullable_map<R: IoRead, K, V>(
        &self,
        reader: &mut R,
        key_fn: impl FnMut(&mut R) -> K,
        val_fn: impl FnMut(&mut R) -> V,
    ) -> Option<BTreeMap<K, V>>
    where
        K: Eq + Hash + Ord;
    fn is_next_nil(&self) -> bool;
    fn is_next_string(&self) -> bool;
    fn context(&mut self) -> &mut Context;
}
