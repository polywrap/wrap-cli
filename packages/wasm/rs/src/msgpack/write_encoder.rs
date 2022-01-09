use super::error::EncodingError;
use super::{Context, Format, Write};
use crate::{BigInt, JSON};
use byteorder::{BigEndian, WriteBytesExt};
use core::hash::Hash;
use std::collections::BTreeMap;
use std::io::Write as IoWrite;

#[derive(Clone, Debug, Default)]
pub struct WriteEncoder {
    buffer: Vec<u8>,
    context: Context,
}

impl WriteEncoder {
    pub fn new(buf: &[u8], context: Context) -> Self {
        Self {
            buffer: buf.to_vec(),
            context,
        }
    }

    pub fn get_buffer(&self) -> Vec<u8> {
        self.buffer.clone()
    }
}

impl std::io::Write for WriteEncoder {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        self.buffer.write(buf)
    }

    fn flush(&mut self) -> std::io::Result<()> {
        self.buffer.flush()
    }
}

impl Write for WriteEncoder {
    fn write_nil(&mut self) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Nil).map_err(From::from)
    }

    fn write_bool(&mut self, value: bool) -> Result<(), EncodingError> {
        let format = if value { Format::True } else { Format::False };
        Format::set_format(self, format).map_err(From::from)
    }

    fn write_i8(&mut self, value: i8) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Int8)?;
        WriteBytesExt::write_i8(self, value).map_err(EncodingError)
    }

    fn write_i16(&mut self, value: i16) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Int16)?;
        WriteBytesExt::write_i16::<BigEndian>(self, value).map_err(EncodingError)
    }

    fn write_i32(&mut self, value: i32) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Int32)?;
        WriteBytesExt::write_i32::<BigEndian>(self, value).map_err(EncodingError)
    }

    fn write_i64(&mut self, value: i64) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Int64)?;
        WriteBytesExt::write_i64::<BigEndian>(self, value).map_err(EncodingError)
    }

    fn write_u8(&mut self, value: u8) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Uint8)?;
        WriteBytesExt::write_u8(self, value).map_err(EncodingError)
    }

    fn write_u16(&mut self, value: u16) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Uint16)?;
        WriteBytesExt::write_u16::<BigEndian>(self, value).map_err(EncodingError)
    }

    fn write_u32(&mut self, value: u32) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Uint32)?;
        WriteBytesExt::write_u32::<BigEndian>(self, value).map_err(EncodingError)
    }

    fn write_u64(&mut self, value: u64) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Uint64)?;
        WriteBytesExt::write_u64::<BigEndian>(self, value).map_err(EncodingError)
    }

    fn write_f32(&mut self, value: f32) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Float32)?;
        WriteBytesExt::write_f32::<BigEndian>(self, value).map_err(EncodingError)
    }

    fn write_f64(&mut self, value: f64) -> Result<(), EncodingError> {
        Format::set_format(self, Format::Float64)?;
        WriteBytesExt::write_f64::<BigEndian>(self, value).map_err(EncodingError)
    }

    fn write_string_length(&mut self, length: u32) -> Result<(), EncodingError> {
        if length < 32 {
            Format::set_format(self, Format::FixStr(length as u8))?;
        } else if length <= u8::MAX as u32 {
            Format::set_format(self, Format::Str8)?;
            WriteBytesExt::write_u8(self, length as u8)?;
        } else if length <= u16::MAX as u32 {
            Format::set_format(self, Format::Str16)?;
            WriteBytesExt::write_u16::<BigEndian>(self, length as u16)?;
        } else {
            Format::set_format(self, Format::Str32)?;
            WriteBytesExt::write_u32::<BigEndian>(self, length)?;
        }
        Ok(())
    }

    fn write_string(&mut self, value: &String) -> Result<(), EncodingError> {
        self.write_string_length(value.len() as u32)?;
        self.write_all(value.as_bytes()).map_err(EncodingError)?;
        Ok(())
    }

    fn write_str(&mut self, value: &str) -> Result<(), EncodingError> {
        self.write_string_length(value.len() as u32)?;
        self.write_all(value.as_bytes()).map_err(EncodingError)?;
        Ok(())
    }

    fn write_bytes_length(&mut self, length: u32) -> Result<(), EncodingError> {
        if length <= u8::MAX as u32 {
            Format::set_format(self, Format::Bin8)?;
            WriteBytesExt::write_u8(self, length as u8)?;
        } else if length <= u16::MAX as u32 {
            Format::set_format(self, Format::Bin16)?;
            WriteBytesExt::write_u16::<BigEndian>(self, length as u16)?;
        } else {
            Format::set_format(self, Format::Bin32)?;
            WriteBytesExt::write_u32::<BigEndian>(self, length)?;
        }
        Ok(())
    }

    fn write_bytes(&mut self, buf: &[u8]) -> Result<(), EncodingError> {
        self.write_bytes_length(buf.len() as u32)?;
        self.write_all(buf).map_err(EncodingError)?;
        Ok(())
    }

    fn write_bigint(&mut self, value: BigInt) -> Result<(), EncodingError> {
        self.write_string(&value.to_string())
    }

    fn write_json(&mut self, value: &JSON::Value) -> Result<(), EncodingError> {
        let res: Result<String, JSON::Error> = JSON::from_value(value.clone());
        match res {
            Ok(s) => {
                self.write_string(&s)?;
                Ok(())
            }
            Err(e) => Err(EncodingError::from(e)),
        }
    }

    fn write_array_length(&mut self, length: u32) -> Result<(), EncodingError> {
        if length < 16 {
            Format::set_format(self, Format::FixArray(length as u8))?;
        } else if length <= u16::MAX as u32 {
            Format::set_format(self, Format::Array16)?;
            WriteBytesExt::write_u16::<BigEndian>(self, length as u16)?;
        } else {
            Format::set_format(self, Format::Array32)?;
            WriteBytesExt::write_u32::<BigEndian>(self, length)?;
        }
        Ok(())
    }

    fn write_array<T: Clone>(
        &mut self,
        a: &[T],
        mut arr_fn: impl FnMut(&mut Self, &T),
    ) -> Result<(), EncodingError> {
        self.write_array_length(a.len() as u32)?;
        for element in a {
            arr_fn(self, element);
        }
        Ok(())
    }

    fn write_map_length(&mut self, length: u32) -> Result<(), EncodingError> {
        if length < 16 {
            Format::set_format(self, Format::FixMap(length as u8))?;
        } else if length <= u16::MAX as u32 {
            Format::set_format(self, Format::Map16)?;
            WriteBytesExt::write_u16::<BigEndian>(self, length as u16)?;
        } else {
            Format::set_format(self, Format::Map32)?;
            WriteBytesExt::write_u32::<BigEndian>(self, length)?;
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
        self.write_map_length(map.len() as u32)?;
        let keys: Vec<_> = map.keys().into_iter().collect();
        let values: Vec<_> = map.values().into_iter().collect();
        for key in keys {
            for value in &values {
                key_fn(self, key);
                val_fn(self, value);
            }
        }
        Ok(())
    }

    fn write_nullable_bool(&mut self, value: &Option<bool>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                self.write_bool(*v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_i8(&mut self, value: &Option<i8>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                WriteBytesExt::write_i8(self, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_i16(&mut self, value: &Option<i16>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                WriteBytesExt::write_i16::<BigEndian>(self, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_i32(&mut self, value: &Option<i32>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                WriteBytesExt::write_i32::<BigEndian>(self, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_i64(&mut self, value: &Option<i64>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                WriteBytesExt::write_i64::<BigEndian>(self, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_u8(&mut self, value: &Option<u8>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                WriteBytesExt::write_u8(self, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_u16(&mut self, value: &Option<u16>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                WriteBytesExt::write_u16::<BigEndian>(self, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_u32(&mut self, value: &Option<u32>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                WriteBytesExt::write_u32::<BigEndian>(self, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_u64(&mut self, value: &Option<u64>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                WriteBytesExt::write_u64::<BigEndian>(self, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_f32(&mut self, value: &Option<f32>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                WriteBytesExt::write_f32::<BigEndian>(self, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_f64(&mut self, value: &Option<f64>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(v) => {
                WriteBytesExt::write_f64::<BigEndian>(self, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_string(&mut self, value: &Option<String>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(s) => {
                self.write_string(s)?;
                Ok(())
            }
        }
    }

    fn write_nullable_bytes(&mut self, value: &Option<Vec<u8>>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(b) => {
                self.write_bytes(b)?;
                Ok(())
            }
        }
    }

    fn write_nullable_bigint(&mut self, value: &Option<BigInt>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(val) => {
                self.write_bigint(val.to_owned())?;
                Ok(())
            }
        }
    }

    fn write_nullable_json(&mut self, value: &Option<JSON::Value>) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(json) => {
                self.write_json(json)?;
                Ok(())
            }
        }
    }

    fn write_nullable_array<T: Clone>(
        &mut self,
        a: &Option<Vec<T>>,
        arr_fn: impl FnMut(&mut Self, &T),
    ) -> Result<(), EncodingError> {
        match a {
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(arr) => {
                self.write_array(arr, arr_fn)?;
                Ok(())
            }
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
            None => {
                self.write_nil()?;
                Ok(())
            }
            Some(m) => {
                self.write_map(m, key_fn, val_fn)?;
                Ok(())
            }
        }
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
