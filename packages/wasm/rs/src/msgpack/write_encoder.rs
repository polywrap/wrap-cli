use super::{error::EncodingError, Context, DataView, Format, Write};
use crate::{BigInt, JSON};
use byteorder::{BigEndian, WriteBytesExt};
use core::hash::Hash;
use std::{collections::BTreeMap, io::Write as StdioWrite};

#[derive(Clone, Debug, Default)]
pub struct WriteEncoder {
    pub(crate) context: Context,
    pub(crate) view: DataView,
}

impl WriteEncoder {
    pub fn new(buf: &[u8], context: Context) -> Self {
        Self {
            context: context.clone(),
            view: DataView::new(buf, context).expect("Error creating new data view"),
        }
    }

    pub fn get_buffer(&self) -> Vec<u8> {
        self.view.get_buffer()
    }
}

impl StdioWrite for WriteEncoder {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        self.view.buffer.write(buf)
    }

    fn flush(&mut self) -> std::io::Result<()> {
        self.view.buffer.flush()
    }
}

impl Write for WriteEncoder {
    fn write_nil(&mut self) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Nil) {
            Ok(_) => Ok(()),
            Err(_) => Err(EncodingError::NilWriteError),
        }
    }

    fn write_bool(&mut self, value: &bool) -> Result<(), EncodingError> {
        let format = if *value { Format::True } else { Format::False };
        match Format::set_format(self, format) {
            Ok(_) => Ok(()),
            Err(_) => Err(EncodingError::BooleanWriteError),
        }
    }

    fn write_i8(&mut self, value: &i8) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Int8) {
            Ok(_) => Ok(WriteBytesExt::write_i8(self, *value)?),
            Err(_) => Err(EncodingError::Int8WriteError),
        }
    }

    fn write_i16(&mut self, value: &i16) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Int16) {
            Ok(_) => Ok(WriteBytesExt::write_i16::<BigEndian>(self, *value)?),
            Err(_) => Err(EncodingError::Int16WriteError),
        }
    }

    fn write_i32(&mut self, value: &i32) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Int32) {
            Ok(_) => Ok(WriteBytesExt::write_i32::<BigEndian>(self, *value)?),
            Err(_) => Err(EncodingError::Int32WriteError),
        }
    }

    fn write_i64(&mut self, value: &i64) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Int64) {
            Ok(_) => Ok(WriteBytesExt::write_i64::<BigEndian>(self, *value)?),
            Err(_) => Err(EncodingError::Int64WriteError),
        }
    }

    fn write_u8(&mut self, value: &u8) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Uint8) {
            Ok(_) => Ok(WriteBytesExt::write_u8(self, *value)?),
            Err(_) => Err(EncodingError::Uint8WriteError),
        }
    }

    fn write_u16(&mut self, value: &u16) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Uint16) {
            Ok(_) => Ok(WriteBytesExt::write_u16::<BigEndian>(self, *value)?),
            Err(_) => Err(EncodingError::Uint16WriteError),
        }
    }

    fn write_u32(&mut self, value: &u32) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Uint32) {
            Ok(_) => Ok(WriteBytesExt::write_u32::<BigEndian>(self, *value)?),
            Err(_) => Err(EncodingError::Uint32WriteError),
        }
    }

    fn write_u64(&mut self, value: &u64) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Uint64) {
            Ok(_) => Ok(WriteBytesExt::write_u64::<BigEndian>(self, *value)?),
            Err(_) => Err(EncodingError::Uint64WriteError),
        }
    }

    fn write_f32(&mut self, value: &f32) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Float32) {
            Ok(_) => Ok(WriteBytesExt::write_f32::<BigEndian>(self, *value)?),
            Err(_) => Err(EncodingError::Float32WriteError),
        }
    }

    fn write_f64(&mut self, value: &f64) -> Result<(), EncodingError> {
        match Format::set_format(self, Format::Float64) {
            Ok(_) => Ok(WriteBytesExt::write_f64::<BigEndian>(self, *value)?),
            Err(_) => Err(EncodingError::Float64WriteError),
        }
    }

    fn write_string_length(&mut self, length: &u32) -> Result<(), EncodingError> {
        if *length < 32 {
            Format::set_format(self, Format::FixStr(*length as u8))?;
        } else if *length <= u8::MAX as u32 {
            Format::set_format(self, Format::Str8)?;
            WriteBytesExt::write_u8(self, *length as u8)?;
        } else if *length <= u16::MAX as u32 {
            Format::set_format(self, Format::Str16)?;
            WriteBytesExt::write_u16::<BigEndian>(self, *length as u16)?;
        } else {
            Format::set_format(self, Format::Str32)?;
            WriteBytesExt::write_u32::<BigEndian>(self, *length)?;
        }
        Ok(())
    }

    fn write_string(&mut self, value: &String) -> Result<(), EncodingError> {
        match self.write_string_length(&(value.len() as u32)) {
            Ok(_) => Ok(self.write_all(value.as_bytes())?),
            Err(_) => Err(EncodingError::StrWriteError),
        }
    }

    fn write_str(&mut self, value: &str) -> Result<(), EncodingError> {
        match self.write_string_length(&(value.len() as u32)) {
            Ok(_) => Ok(self.write_all(value.as_bytes())?),
            Err(_) => Err(EncodingError::StrWriteError),
        }
    }

    fn write_bytes_length(&mut self, length: &u32) -> Result<(), EncodingError> {
        if *length <= u8::MAX as u32 {
            Format::set_format(self, Format::Bin8)?;
            WriteBytesExt::write_u8(self, *length as u8)?;
        } else if *length <= u16::MAX as u32 {
            Format::set_format(self, Format::Bin16)?;
            WriteBytesExt::write_u16::<BigEndian>(self, *length as u16)?;
        } else {
            Format::set_format(self, Format::Bin32)?;
            WriteBytesExt::write_u32::<BigEndian>(self, *length)?;
        }
        Ok(())
    }

    fn write_bytes(&mut self, buf: &[u8]) -> Result<(), EncodingError> {
        match self.write_bytes_length(&(buf.len() as u32)) {
            Ok(_) => Ok(self.write_all(buf)?),
            Err(_) => Err(EncodingError::BinWriteError),
        }
    }

    fn write_bigint(&mut self, value: &BigInt) -> Result<(), EncodingError> {
        match self.write_string(&value.to_string()) {
            Ok(_) => Ok(()),
            Err(_) => Err(EncodingError::BigIntWriteError),
        }
    }

    fn write_json(&mut self, value: &JSON::Value) -> Result<(), EncodingError> {
        match JSON::to_string(value) {
            Ok(s) => Ok(self.write_string(&s)?),
            Err(e) => Err(EncodingError::from(e)),
        }
    }

    fn write_array_length(&mut self, length: &u32) -> Result<(), EncodingError> {
        if *length < 16 {
            Format::set_format(self, Format::FixArray(*length as u8))?;
        } else if *length <= u16::MAX as u32 {
            Format::set_format(self, Format::Array16)?;
            WriteBytesExt::write_u16::<BigEndian>(self, *length as u16)?;
        } else {
            Format::set_format(self, Format::Array32)?;
            WriteBytesExt::write_u32::<BigEndian>(self, *length)?;
        }
        Ok(())
    }

    fn write_array<T: Clone>(
        &mut self,
        a: &[T],
        mut arr_fn: impl FnMut(&mut Self, &T),
    ) -> Result<(), EncodingError> {
        match self.write_array_length(&(a.len() as u32)) {
            Ok(_) => {
                for element in a {
                    arr_fn(self, element);
                }
                Ok(())
            }
            Err(_) => Err(EncodingError::ArrayWriteError),
        }
    }

    fn write_map_length(&mut self, length: &u32) -> Result<(), EncodingError> {
        if *length < 16 {
            Format::set_format(self, Format::FixMap(*length as u8))?;
        } else if *length <= u16::MAX as u32 {
            Format::set_format(self, Format::Map16)?;
            WriteBytesExt::write_u16::<BigEndian>(self, *length as u16)?;
        } else {
            Format::set_format(self, Format::Map32)?;
            WriteBytesExt::write_u32::<BigEndian>(self, *length)?;
        }
        Ok(())
    }

    fn write_map<K, V: Clone>(
        &mut self,
        map: &BTreeMap<K, V>,
        mut key_fn: impl FnMut(&mut Self, &K),
        mut val_fn: impl FnMut(&mut Self, &V),
    ) -> Result<(), EncodingError>
    where
        K: Clone + Eq + Hash + Ord,
    {
        match self.write_map_length(&(map.len() as u32)) {
            Ok(_) => {
                let keys: Vec<_> = map.keys().into_iter().collect();
                for key in keys {
                    let value = &map[key];
                    key_fn(self, key);
                    val_fn(self, &value);
                }
                Ok(())
            }
            Err(_) => Err(EncodingError::MapWriteError),
        }
    }

    fn write_nullable_bool(&mut self, value: &Option<bool>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_bool(self, v)?),
        }
    }

    fn write_nullable_i8(&mut self, value: &Option<i8>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_i8(self, v)?),
        }
    }

    fn write_nullable_i16(&mut self, value: &Option<i16>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_i16(self, v)?),
        }
    }

    fn write_nullable_i32(&mut self, value: &Option<i32>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_i32(self, v)?),
        }
    }

    fn write_nullable_i64(&mut self, value: &Option<i64>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_i64(self, v)?),
        }
    }

    fn write_nullable_u8(&mut self, value: &Option<u8>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_u8(self, v)?),
        }
    }

    fn write_nullable_u16(&mut self, value: &Option<u16>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_u16(self, v)?),
        }
    }

    fn write_nullable_u32(&mut self, value: &Option<u32>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_u32(self, v)?),
        }
    }

    fn write_nullable_u64(&mut self, value: &Option<u64>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_u64(self, v)?),
        }
    }

    fn write_nullable_f32(&mut self, value: &Option<f32>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_f32(self, v)?),
        }
    }

    fn write_nullable_f64(&mut self, value: &Option<f64>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_f64(self, v)?),
        }
    }

    fn write_nullable_string(&mut self, value: &Option<String>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(s) => Ok(Write::write_string(self, s)?),
        }
    }

    fn write_nullable_bytes(&mut self, value: &Option<Vec<u8>>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(b) => Ok(Write::write_bytes(self, b)?),
        }
    }

    fn write_nullable_bigint(&mut self, value: &Option<BigInt>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(val) => Ok(Write::write_bigint(self, val)?),
        }
    }

    fn write_nullable_json(&mut self, value: &Option<JSON::Value>) -> Result<(), EncodingError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(json) => Ok(Write::write_json(self, json)?),
        }
    }

    fn write_nullable_array<T: Clone>(
        &mut self,
        a: &Option<Vec<T>>,
        arr_fn: impl FnMut(&mut Self, &T),
    ) -> Result<(), EncodingError> {
        match a {
            None => Ok(Write::write_nil(self)?),
            Some(arr) => Ok(Write::write_array(self, arr, arr_fn)?),
        }
    }

    fn write_nullable_map<K, V: Clone>(
        &mut self,
        map: &Option<BTreeMap<K, V>>,
        key_fn: impl FnMut(&mut Self, &K),
        val_fn: impl FnMut(&mut Self, &V),
    ) -> Result<(), EncodingError>
    where
        K: Clone + Eq + Hash + Ord,
    {
        match map {
            None => Ok(Write::write_nil(self)?),
            Some(m) => Ok(Write::write_map(self, m, key_fn, val_fn)?),
        }
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
