use super::{error::EncodeError, Context, DataView, Format, Write};
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
    fn write_nil(&mut self) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Nil) {
            Ok(_v) => Ok(()),
            Err(e) => Err(EncodeError::NilWriteError(e.to_string())),
        }
    }

    fn write_bool(&mut self, value: &bool) -> Result<(), EncodeError> {
        let format = if *value { Format::True } else { Format::False };
        match Format::set_format(self, format) {
            Ok(_v) => Ok(()),
            Err(e) => Err(EncodeError::BooleanWriteError(e.to_string())),
        }
    }

    fn write_i8(&mut self, value: &i8) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Int8) {
            Ok(_v) => Ok(WriteBytesExt::write_i8(self, *value)?),
            Err(e) => Err(EncodeError::Int8WriteError(e.to_string())),
        }
    }

    fn write_i16(&mut self, value: &i16) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Int16) {
            Ok(_v) => Ok(WriteBytesExt::write_i16::<BigEndian>(self, *value)?),
            Err(e) => Err(EncodeError::Int16WriteError(e.to_string())),
        }
    }

    fn write_i32(&mut self, value: &i32) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Int32) {
            Ok(_v) => Ok(WriteBytesExt::write_i32::<BigEndian>(self, *value)?),
            Err(e) => Err(EncodeError::Int32WriteError(e.to_string())),
        }
    }

    fn write_i64(&mut self, value: &i64) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Int64) {
            Ok(_v) => Ok(WriteBytesExt::write_i64::<BigEndian>(self, *value)?),
            Err(e) => Err(EncodeError::Int64WriteError(e.to_string())),
        }
    }

    fn write_u8(&mut self, value: &u8) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Uint8) {
            Ok(_v) => Ok(WriteBytesExt::write_u8(self, *value)?),
            Err(e) => Err(EncodeError::Uint8WriteError(e.to_string())),
        }
    }

    fn write_u16(&mut self, value: &u16) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Uint16) {
            Ok(_v) => Ok(WriteBytesExt::write_u16::<BigEndian>(self, *value)?),
            Err(e) => Err(EncodeError::Uint16WriteError(e.to_string())),
        }
    }

    fn write_u32(&mut self, value: &u32) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Uint32) {
            Ok(_v) => Ok(WriteBytesExt::write_u32::<BigEndian>(self, *value)?),
            Err(e) => Err(EncodeError::Uint32WriteError(e.to_string())),
        }
    }

    fn write_u64(&mut self, value: &u64) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Uint64) {
            Ok(_v) => Ok(WriteBytesExt::write_u64::<BigEndian>(self, *value)?),
            Err(e) => Err(EncodeError::Uint64WriteError(e.to_string())),
        }
    }

    fn write_f32(&mut self, value: &f32) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Float32) {
            Ok(_v) => Ok(WriteBytesExt::write_f32::<BigEndian>(self, *value)?),
            Err(e) => Err(EncodeError::Float32WriteError(e.to_string())),
        }
    }

    fn write_f64(&mut self, value: &f64) -> Result<(), EncodeError> {
        match Format::set_format(self, Format::Float64) {
            Ok(_v) => Ok(WriteBytesExt::write_f64::<BigEndian>(self, *value)?),
            Err(e) => Err(EncodeError::Float64WriteError(e.to_string())),
        }
    }

    fn write_string_length(&mut self, length: &u32) -> Result<(), EncodeError> {
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

    fn write_string(&mut self, value: &String) -> Result<(), EncodeError> {
        match self.write_string_length(&(value.len() as u32)) {
            Ok(_v) => Ok(self.write_all(value.as_bytes())?),
            Err(e) => Err(EncodeError::StrWriteError(e.to_string())),
        }
    }

    fn write_str(&mut self, value: &str) -> Result<(), EncodeError> {
        match self.write_string_length(&(value.len() as u32)) {
            Ok(_v) => Ok(self.write_all(value.as_bytes())?),
            Err(e) => Err(EncodeError::StrWriteError(e.to_string())),
        }
    }

    fn write_bytes_length(&mut self, length: &u32) -> Result<(), EncodeError> {
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

    fn write_bytes(&mut self, buf: &[u8]) -> Result<(), EncodeError> {
        match self.write_bytes_length(&(buf.len() as u32)) {
            Ok(_v) => Ok(self.write_all(buf)?),
            Err(e) => Err(EncodeError::BinWriteError(e.to_string())),
        }
    }

    fn write_bigint(&mut self, value: &BigInt) -> Result<(), EncodeError> {
        match self.write_string(&value.to_string()) {
            Ok(_v) => Ok(()),
            Err(e) => Err(EncodeError::BigIntWriteError(e.to_string())),
        }
    }

    fn write_json(&mut self, value: &JSON::Value) -> Result<(), EncodeError> {
        match JSON::to_string(value) {
            Ok(s) => Ok(self.write_string(&s)?),
            Err(e) => Err(EncodeError::from(e)),
        }
    }

    fn write_array_length(&mut self, length: &u32) -> Result<(), EncodeError> {
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
        mut arr_fn: impl FnMut(&mut Self, &T) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError> {
        match self.write_array_length(&(a.len() as u32)) {
            Ok(_v) => {
                for element in a {
                    arr_fn(self, element)?;
                }
                Ok(())
            }
            Err(e) => Err(EncodeError::ArrayWriteError(e.to_string())),
        }
    }

    fn write_map_length(&mut self, length: &u32) -> Result<(), EncodeError> {
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
        mut key_fn: impl FnMut(&mut Self, &K) -> Result<(), EncodeError>,
        mut val_fn: impl FnMut(&mut Self, &V) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError>
    where
        K: Clone + Eq + Hash + Ord,
    {
        match self.write_map_length(&(map.len() as u32)) {
            Ok(_v) => {
                let keys: Vec<_> = map.keys().into_iter().collect();
                for key in keys {
                    let value = &map[key];
                    key_fn(self, key)?;
                    val_fn(self, &value)?;
                }
                Ok(())
            }
            Err(e) => Err(EncodeError::MapWriteError(e.to_string())),
        }
    }

    fn write_nullable_bool(&mut self, value: &Option<bool>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_bool(self, v)?),
        }
    }

    fn write_nullable_i8(&mut self, value: &Option<i8>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_i8(self, v)?),
        }
    }

    fn write_nullable_i16(&mut self, value: &Option<i16>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_i16(self, v)?),
        }
    }

    fn write_nullable_i32(&mut self, value: &Option<i32>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_i32(self, v)?),
        }
    }

    fn write_nullable_i64(&mut self, value: &Option<i64>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_i64(self, v)?),
        }
    }

    fn write_nullable_u8(&mut self, value: &Option<u8>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_u8(self, v)?),
        }
    }

    fn write_nullable_u16(&mut self, value: &Option<u16>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_u16(self, v)?),
        }
    }

    fn write_nullable_u32(&mut self, value: &Option<u32>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_u32(self, v)?),
        }
    }

    fn write_nullable_u64(&mut self, value: &Option<u64>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_u64(self, v)?),
        }
    }

    fn write_nullable_f32(&mut self, value: &Option<f32>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_f32(self, v)?),
        }
    }

    fn write_nullable_f64(&mut self, value: &Option<f64>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(v) => Ok(Write::write_f64(self, v)?),
        }
    }

    fn write_nullable_string(&mut self, value: &Option<String>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(s) => Ok(Write::write_string(self, s)?),
        }
    }

    fn write_nullable_bytes(&mut self, value: &Option<Vec<u8>>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(b) => Ok(Write::write_bytes(self, b)?),
        }
    }

    fn write_nullable_bigint(&mut self, value: &Option<BigInt>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(val) => Ok(Write::write_bigint(self, val)?),
        }
    }

    fn write_nullable_json(&mut self, value: &Option<JSON::Value>) -> Result<(), EncodeError> {
        match value {
            None => Ok(Write::write_nil(self)?),
            Some(json) => Ok(Write::write_json(self, json)?),
        }
    }

    fn write_nullable_array<T: Clone>(
        &mut self,
        a: &Option<Vec<T>>,
        arr_fn: impl FnMut(&mut Self, &T) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError> {
        match a {
            None => Ok(Write::write_nil(self)?),
            Some(arr) => Ok(Write::write_array(self, arr, arr_fn)?),
        }
    }

    fn write_nullable_map<K, V: Clone>(
        &mut self,
        map: &Option<BTreeMap<K, V>>,
        key_fn: impl FnMut(&mut Self, &K) -> Result<(), EncodeError>,
        val_fn: impl FnMut(&mut Self, &V) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError>
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
