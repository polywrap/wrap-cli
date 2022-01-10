use super::error::DecodingError;
use super::{Context, DataView, Format, Read};
use crate::{BigInt, JSON};
use byteorder::{BigEndian, ReadBytesExt};
use core::hash::Hash;
use std::io::Read as StdioRead;
use std::{collections::BTreeMap, str::FromStr};

#[derive(Clone, Debug, Default)]
pub struct ReadDecoder {
    pub(crate) context: Context,
    pub(crate) view: DataView,
}

impl ReadDecoder {
    pub fn new(buf: &[u8], context: Context) -> Self {
        Self {
            context: context.clone(),
            view: DataView::new(buf, context).expect("Failed to create new data view"),
        }
    }

    fn get_bytes(&mut self, n_bytes_to_read: u64) -> Result<Vec<u8>, DecodingError> {
        let mut buf = vec![];
        let mut chunk = self.take(n_bytes_to_read);
        match chunk.read_to_end(&mut buf) {
            Ok(_n) => Ok(buf),
            Err(_e) => Err(DecodingError::BytesReadError),
        }
    }
}

impl StdioRead for ReadDecoder {
    fn read(&mut self, buf: &mut [u8]) -> std::io::Result<usize> {
        self.view.buffer.read(buf)
    }
}

impl Read for ReadDecoder {
    fn read_nil(&mut self) -> Result<(), DecodingError> {
        match Format::get_format(self)? {
            Format::Nil => Ok(()),
            _ => Err(DecodingError::NilReadError),
        }
    }

    fn read_bool(&mut self) -> Result<bool, DecodingError> {
        match Format::get_format(self)? {
            Format::True => Ok(true),
            Format::False => Ok(false),
            _ => Err(DecodingError::BooleanReadError),
        }
    }

    fn read_i8(&mut self) -> Result<i8, DecodingError> {
        match Format::get_format(self)? {
            Format::Int8 => Ok(ReadBytesExt::read_i8(self)?),
            _ => Err(DecodingError::Int8ReadError),
        }
    }

    fn read_i16(&mut self) -> Result<i16, DecodingError> {
        match Format::get_format(self)? {
            Format::Int16 => Ok(ReadBytesExt::read_i16::<BigEndian>(self)?),
            _ => Err(DecodingError::Int16ReadError),
        }
    }

    fn read_i32(&mut self) -> Result<i32, DecodingError> {
        match Format::get_format(self)? {
            Format::Int32 => Ok(ReadBytesExt::read_i32::<BigEndian>(self)?),
            _ => Err(DecodingError::Int32ReadError),
        }
    }

    fn read_i64(&mut self) -> Result<i64, DecodingError> {
        match Format::get_format(self)? {
            Format::Int64 => Ok(ReadBytesExt::read_i64::<BigEndian>(self)?),
            _ => Err(DecodingError::Int64ReadError),
        }
    }

    fn read_u8(&mut self) -> Result<u8, DecodingError> {
        match Format::get_format(self)? {
            Format::Uint8 => Ok(ReadBytesExt::read_u8(self)?),
            _ => Err(DecodingError::Uint8ReadError),
        }
    }

    fn read_u16(&mut self) -> Result<u16, DecodingError> {
        match Format::get_format(self)? {
            Format::Uint16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)?),
            _ => Err(DecodingError::Uint16ReadError),
        }
    }

    fn read_u32(&mut self) -> Result<u32, DecodingError> {
        match Format::get_format(self)? {
            Format::Uint32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            _ => Err(DecodingError::Uint32ReadError),
        }
    }

    fn read_u64(&mut self) -> Result<u64, DecodingError> {
        match Format::get_format(self)? {
            Format::Uint64 => Ok(ReadBytesExt::read_u64::<BigEndian>(self)?),
            _ => Err(DecodingError::Uint64ReadError),
        }
    }

    fn read_f32(&mut self) -> Result<f32, DecodingError> {
        match Format::get_format(self)? {
            Format::Float32 => Ok(ReadBytesExt::read_f32::<BigEndian>(self)?),
            _ => Err(DecodingError::Float32ReadError),
        }
    }

    fn read_f64(&mut self) -> Result<f64, DecodingError> {
        match Format::get_format(self)? {
            Format::Float64 => Ok(ReadBytesExt::read_f64::<BigEndian>(self)?),
            _ => Err(DecodingError::Float64ReadError),
        }
    }

    fn read_string_length(&mut self) -> Result<u32, DecodingError> {
        match Format::get_format(self)? {
            Format::FixStr(len) => Ok(len as u32),
            Format::Str8 => Ok(ReadBytesExt::read_u8(self)? as u32),
            Format::Str16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Str32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            _ => Err(DecodingError::StrReadError),
        }
    }

    fn read_string(&mut self) -> Result<String, DecodingError> {
        let str_len = self.read_string_length()?;
        let bytes = self.get_bytes(str_len as u64)?;
        match String::from_utf8(bytes) {
            Ok(s) => Ok(s),
            Err(_e) => Err(DecodingError::StrReadError),
        }
    }

    fn read_bytes_length(&mut self) -> Result<u32, DecodingError> {
        match Format::get_format(self)? {
            Format::Bin8 => Ok(ReadBytesExt::read_u8(self)? as u32),
            Format::Bin16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Bin32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            _ => Err(DecodingError::BinReadError),
        }
    }

    fn read_bytes(&mut self) -> Result<Vec<u8>, DecodingError> {
        let bytes_len = self.read_bytes_length()?;
        match self.get_bytes(bytes_len as u64) {
            Ok(b) => Ok(b),
            Err(e) => Err(e),
        }
    }

    fn read_bigint(&mut self) -> Result<BigInt, DecodingError> {
        let bigint = self.read_string()?;
        match BigInt::from_str(&bigint) {
            Ok(b) => Ok(b),
            Err(_e) => Err(DecodingError::ParseBigIntError),
        }
    }

    fn read_json(&mut self) -> Result<JSON::Value, DecodingError> {
        let json = self.read_string()?;
        match JSON::to_value(json) {
            Ok(v) => Ok(v),
            Err(e) => Err(DecodingError::from(e)),
        }
    }

    fn read_array_length(&mut self) -> Result<u32, DecodingError> {
        match Format::get_format(self)? {
            Format::FixArray(len) => Ok(len as u32),
            Format::Array16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Array32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            _ => Err(DecodingError::ArrayReadError),
        }
    }

    fn read_array<T>(
        &mut self,
        mut reader: impl FnMut(&mut Self) -> T,
    ) -> Result<Vec<T>, DecodingError> {
        match self.read_array_length() {
            Ok(len) => {
                let mut array: Vec<T> = vec![];
                for i in 0..len {
                    self.context.push("array[", &i.to_string(), "]");
                    let item = reader(self);
                    array.push(item);
                    self.context.pop();
                }
                Ok(array)
            }
            Err(e) => Err(e),
        }
    }

    fn read_map_length(&mut self) -> Result<u32, DecodingError> {
        match Format::get_format(self)? {
            Format::FixMap(len) => Ok(len as u32),
            Format::Map16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Map32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            _ => Err(DecodingError::MapReadError),
        }
    }

    fn read_map<K, V>(
        &mut self,
        mut key_fn: impl FnMut(&mut Self) -> K,
        mut val_fn: impl FnMut(&mut Self) -> V,
    ) -> Result<BTreeMap<K, V>, DecodingError>
    where
        K: Eq + Hash + Ord,
    {
        match self.read_map_length() {
            Ok(len) => {
                let mut map: BTreeMap<K, V> = BTreeMap::new();
                for i in 0..len {
                    self.context.push("map[", &i.to_string(), "]");
                    let key = key_fn(self);
                    let value = val_fn(self);
                    map.insert(key, value);
                    self.context.pop();
                }
                Ok(map)
            }
            Err(e) => Err(e),
        }
    }

    fn read_nullable_bool(&mut self) -> Result<Option<bool>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_bool()?))
    }

    fn read_nullable_i8(&mut self) -> Result<Option<i8>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_i8(self)?))
    }

    fn read_nullable_i16(&mut self) -> Result<Option<i16>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_i16(self)?))
    }

    fn read_nullable_i32(&mut self) -> Result<Option<i32>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_i32(self)?))
    }

    fn read_nullable_i64(&mut self) -> Result<Option<i64>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_i64(self)?))
    }

    fn read_nullable_u8(&mut self) -> Result<Option<u8>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_u8(self)?))
    }

    fn read_nullable_u16(&mut self) -> Result<Option<u16>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_u16(self)?))
    }

    fn read_nullable_u32(&mut self) -> Result<Option<u32>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_u32(self)?))
    }

    fn read_nullable_u64(&mut self) -> Result<Option<u64>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_u64(self)?))
    }

    fn read_nullable_f32(&mut self) -> Result<Option<f32>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_f32(self)?))
    }

    fn read_nullable_f64(&mut self) -> Result<Option<f64>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_f64(self)?))
    }

    fn read_nullable_string(&mut self) -> Result<Option<String>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_string()?))
    }

    fn read_nullable_bytes(&mut self) -> Result<Option<Vec<u8>>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_bytes()?))
    }

    fn read_nullable_bigint(&mut self) -> Result<Option<BigInt>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_bigint()?))
    }

    fn read_nullable_json(&mut self) -> Result<Option<JSON::Value>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_json()?))
    }

    fn read_nullable_array<T>(
        &mut self,
        reader: impl FnMut(&mut Self) -> T,
    ) -> Result<Option<Vec<T>>, DecodingError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_array(reader)?))
    }

    fn read_nullable_map<K, V>(
        &mut self,
        key_fn: impl FnMut(&mut Self) -> K,
        val_fn: impl FnMut(&mut Self) -> V,
    ) -> Result<Option<BTreeMap<K, V>>, DecodingError>
    where
        K: Eq + Hash + Ord,
    {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_map(key_fn, val_fn)?))
    }

    fn is_next_nil(&mut self) -> Result<bool, DecodingError> {
        match self.read_nil() {
            Ok(_r) => Ok(true),
            Err(e) => Err(e),
        }
    }

    fn is_next_string(&mut self) -> Result<bool, DecodingError> {
        if let Ok(f) = Format::get_format(self) {
            Ok(f == Format::FixStr(f.to_u8())
                || f == Format::Str8
                || f == Format::Str16
                || f == Format::Str32)
        } else {
            Err(DecodingError::StrReadError)
        }
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
