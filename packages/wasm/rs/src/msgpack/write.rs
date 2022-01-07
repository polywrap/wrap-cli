use super::error::EncodingError;
use crate::{BigInt, Context, JSON};
use core::hash::Hash;
use std::collections::BTreeMap;
use std::io::Write as IoWrite;

pub trait Write: Clone {
    fn write_nil<W: IoWrite>(&mut self, writer: &mut W) -> Result<(), EncodingError>;
    fn write_bool<W: IoWrite>(&mut self, writer: &mut W, value: bool) -> Result<(), EncodingError>;
    fn write_i8<W: IoWrite>(&mut self, writer: &mut W, value: i8) -> Result<(), EncodingError>;
    fn write_i16<W: IoWrite>(&mut self, writer: &mut W, value: i16) -> Result<(), EncodingError>;
    fn write_i32<W: IoWrite>(&mut self, writer: &mut W, value: i32) -> Result<(), EncodingError>;
    fn write_u8<W: IoWrite>(&mut self, writer: &mut W, value: u8) -> Result<(), EncodingError>;
    fn write_u16<W: IoWrite>(&mut self, writer: &mut W, value: u16) -> Result<(), EncodingError>;
    fn write_u32<W: IoWrite>(&mut self, writer: &mut W, value: u32) -> Result<(), EncodingError>;
    fn write_f32<W: IoWrite>(&mut self, writer: &mut W, value: f32) -> Result<(), EncodingError>;
    fn write_f64<W: IoWrite>(&mut self, writer: &mut W, value: f64) -> Result<(), EncodingError>;
    fn write_string_length<W: IoWrite>(
        &mut self,
        writer: &mut W,
        length: u32,
    ) -> Result<(), EncodingError>;
    fn write_string<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &String,
    ) -> Result<(), EncodingError>;
    fn write_str<W: IoWrite>(&mut self, writer: &mut W, value: &str) -> Result<(), EncodingError>;
    fn write_bytes_length<W: IoWrite>(
        &mut self,
        writer: &mut W,
        length: u32,
    ) -> Result<(), EncodingError>;
    fn write_bytes<W: IoWrite>(&mut self, writer: &mut W, buf: &[u8]) -> Result<(), EncodingError>;
    fn write_bigint<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: BigInt,
    ) -> Result<(), EncodingError>;
    fn write_json<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &JSON::Value,
    ) -> Result<(), EncodingError>;
    fn write_array_length<W: IoWrite>(
        &mut self,
        writer: &mut W,
        length: u32,
    ) -> Result<(), EncodingError>;
    fn write_array<T: Clone, W: IoWrite>(
        &mut self,
        writer: &mut W,
        a: &[T],
        arr_fn: impl FnMut(&mut W, &T),
    ) -> Result<(), EncodingError>;
    fn write_map_length<W: IoWrite>(
        &mut self,
        writer: &mut W,
        length: u32,
    ) -> Result<(), EncodingError>;
    fn write_map<K, V: Clone, W: IoWrite>(
        &mut self,
        writer: &mut W,
        map: &BTreeMap<K, V>,
        key_fn: impl FnMut(&mut W, &K),
        val_fn: impl FnMut(&mut W, &V),
    ) -> Result<(), EncodingError>
    where
        K: Clone + Eq + Hash + Ord;
    fn write_nullable_bool<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<bool>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_i8<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<i8>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_i16<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<i16>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_i32<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<i32>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_u8<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<u8>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_u16<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<u16>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_u32<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<u32>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_f32<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<f32>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_f64<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<f64>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_string<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<String>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_bytes<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<Vec<u8>>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_bigint<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<BigInt>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_json<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<JSON::Value>,
    ) -> Result<(), EncodingError>;
    fn write_nullable_array<T: Clone, W: IoWrite>(
        &mut self,
        writer: &mut W,
        a: &Option<Vec<T>>,
        arr_fn: impl FnMut(&mut W, &T),
    ) -> Result<(), EncodingError>;
    fn write_nullable_map<K, V: Clone, W: IoWrite>(
        &mut self,
        writer: &mut W,
        map: &Option<BTreeMap<K, V>>,
        key_fn: impl FnMut(&mut W, &K),
        val_fn: impl FnMut(&mut W, &V),
    ) -> Result<(), EncodingError>
    where
        K: Clone + Eq + Hash + Ord;
    fn context(&mut self) -> &mut Context;
}
