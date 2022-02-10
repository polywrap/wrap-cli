use super::{
    error::{get_error_message, DecodeError},
    Context, DataView, Format, Read,
};
use crate::{BigInt, JSON};
use byteorder::{BigEndian, ReadBytesExt};
use core::hash::Hash;
use std::{collections::BTreeMap, io::Read as StdioRead, str::FromStr};

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

    pub fn get_bytes(&mut self, n_bytes_to_read: u64) -> Result<Vec<u8>, DecodeError> {
        let mut buf = vec![];
        let mut chunk = self.take(n_bytes_to_read);
        match chunk.read_to_end(&mut buf) {
            Ok(_n) => Ok(buf),
            Err(e) => Err(DecodeError::BytesReadError(e.to_string())),
        }
    }

    pub fn _read_i64(&mut self) -> Result<i64, DecodeError> {
        match Format::get_format(self) {
            Ok(f) => {
                let prefix = f.to_u8();

                if Format::is_positive_fixed_int(prefix) || Format::is_negative_fixed_int(prefix) {
                    return Ok(prefix as i64);
                } else {
                    match f {
                        Format::Int8 => Ok(ReadBytesExt::read_i8(self)? as i64),
                        Format::Int16 => Ok(ReadBytesExt::read_i16::<BigEndian>(self)? as i64),
                        Format::Int32 => Ok(ReadBytesExt::read_i32::<BigEndian>(self)? as i64),
                        Format::Int64 => Ok(ReadBytesExt::read_i64::<BigEndian>(self)?),
                        Format::Uint8 => Ok(ReadBytesExt::read_u8(self)? as i64),
                        Format::Uint16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as i64),
                        Format::Uint32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)? as i64),
                        Format::Uint64 => Ok(ReadBytesExt::read_u64::<BigEndian>(self)? as i64),
                        err_f => {
                            let err_msg = format!(
                                "Property must be of type 'int'. {}",
                                get_error_message(err_f)
                            );
                            Err(DecodeError::WrongMsgPackFormat(err_msg))
                        }
                    }
                }
            }
            Err(e) => Err(DecodeError::Int64ReadError(e.to_string())),
        }
    }

    pub fn _read_u64(&mut self) -> Result<u64, DecodeError> {
        match Format::get_format(self) {
            Ok(f) => {
                let prefix = f.to_u8();

                if Format::is_positive_fixed_int(prefix) || Format::is_negative_fixed_int(prefix) {
                    return Ok(prefix as u64);
                } else {
                    match f {
                        Format::Int8 => Ok(ReadBytesExt::read_i8(self)? as u64),
                        Format::Int16 => Ok(ReadBytesExt::read_i16::<BigEndian>(self)? as u64),
                        Format::Int32 => Ok(ReadBytesExt::read_i32::<BigEndian>(self)? as u64),
                        Format::Int64 => Ok(ReadBytesExt::read_i64::<BigEndian>(self)? as u64),
                        Format::Uint8 => Ok(ReadBytesExt::read_u8(self)? as u64),
                        Format::Uint16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u64),
                        Format::Uint32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)? as u64),
                        Format::Uint64 => Ok(ReadBytesExt::read_u64::<BigEndian>(self)?),
                        err_f => {
                            let err_msg = format!(
                                "Property must be of type 'uint'. {}",
                                get_error_message(err_f)
                            );
                            Err(DecodeError::WrongMsgPackFormat(err_msg))
                        }
                    }
                }
            }
            Err(e) => Err(DecodeError::Uint64ReadError(e.to_string())),
        }
    }
}

impl StdioRead for ReadDecoder {
    fn read(&mut self, buf: &mut [u8]) -> std::io::Result<usize> {
        self.view.buffer.read(buf)
    }
}

impl Read for ReadDecoder {
    fn read_nil(&mut self) -> Result<(), DecodeError> {
        match Format::get_format(self)? {
            Format::Nil => Ok(()),
            err_f => {
                let err_msg = format!(
                    "Property must be of type 'nil'. {}",
                    get_error_message(err_f)
                );
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_bool(&mut self) -> Result<bool, DecodeError> {
        match Format::get_format(self)? {
            Format::True => Ok(true),
            Format::False => Ok(false),
            err_f => {
                let err_msg = format!(
                    "Property must be of type 'bool'. {}",
                    get_error_message(err_f)
                );
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_i8(&mut self) -> Result<i8, DecodeError> {
        let v = self._read_i64()?;
        // check for integer overflow
        if v <= i8::MAX as i64 && v >= i8::MIN as i64 {
            Ok(v as i8)
        } else {
            let err_msg = format!("integer overflow: value = {}; bits = 8", v.to_string());
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_i16(&mut self) -> Result<i16, DecodeError> {
        let v = self._read_i64()?;
        // check for integer overflow
        if v <= i16::MAX as i64 && v >= i16::MIN as i64 {
            Ok(v as i16)
        } else {
            let err_msg = format!("integer overflow: value = {}; bits = 16", v.to_string());
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_i32(&mut self) -> Result<i32, DecodeError> {
        let v = self._read_i64()?;
        // check for integer overflow
        if v <= i32::MAX as i64 && v >= i32::MIN as i64 {
            Ok(v as i32)
        } else {
            let err_msg = format!("integer overflow: value = {}; bits = 32", v.to_string());
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_u8(&mut self) -> Result<u8, DecodeError> {
        let v = self._read_u64()?;
        // check for integer overflow
        if v <= u8::MAX as u64 && v >= u8::MIN as u64 {
            Ok(v as u8)
        } else {
            let err_msg = format!("integer overflow: value = {}; bits = 8", v.to_string());
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_u16(&mut self) -> Result<u16, DecodeError> {
        let v = self._read_u64()?;
        // check for integer overflow
        if v <= u16::MAX as u64 && v >= u16::MIN as u64 {
            Ok(v as u16)
        } else {
            let err_msg = format!("integer overflow: value = {}; bits = 16", v.to_string());
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_u32(&mut self) -> Result<u32, DecodeError> {
        let v = self._read_u64()?;
        // check for integer overflow
        if v <= u32::MAX as u64 && v >= u32::MIN as u64 {
            Ok(v as u32)
        } else {
            let err_msg = format!("integer overflow: value = {}; bits = 32", v.to_string());
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_f32(&mut self) -> Result<f32, DecodeError> {
        match Format::get_format(self)? {
            Format::Float32 => Ok(ReadBytesExt::read_f32::<BigEndian>(self)?),
            err_f => {
                let err_msg = format!(
                    "Property must be of type 'float32'. {}",
                    get_error_message(err_f)
                );
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_f64(&mut self) -> Result<f64, DecodeError> {
        match Format::get_format(self)? {
            Format::Float64 => Ok(ReadBytesExt::read_f64::<BigEndian>(self)?),
            err_f => {
                let err_msg = format!(
                    "Property must be of type 'float64'. {}",
                    get_error_message(err_f)
                );
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_string_length(&mut self) -> Result<u32, DecodeError> {
        match Format::get_format(self)? {
            Format::FixStr(len) => Ok(len as u32),
            Format::Str8 => Ok(ReadBytesExt::read_u8(self)? as u32),
            Format::Str16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Str32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            err_f => {
                let err_msg = format!(
                    "Property must be of type 'string'. {}",
                    get_error_message(err_f)
                );
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_string(&mut self) -> Result<String, DecodeError> {
        let str_len = self.read_string_length()?;
        let bytes = self.get_bytes(str_len as u64)?;
        match String::from_utf8(bytes) {
            Ok(s) => Ok(s),
            Err(e) => Err(DecodeError::StrReadError(e.to_string())),
        }
    }

    fn read_bytes_length(&mut self) -> Result<u32, DecodeError> {
        match Format::get_format(self)? {
            Format::Bin8 => Ok(ReadBytesExt::read_u8(self)? as u32),
            Format::Bin16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Bin32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            err_f => {
                let err_msg = format!(
                    "Property must be of type 'bytes'. {}",
                    get_error_message(err_f)
                );
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_bytes(&mut self) -> Result<Vec<u8>, DecodeError> {
        let bytes_len = self.read_bytes_length()?;
        self.get_bytes(bytes_len as u64)
            .map_err(|e| DecodeError::BytesReadError(e.to_string()))
    }

    fn read_bigint(&mut self) -> Result<BigInt, DecodeError> {
        let bigint_str = self.read_string()?;
        BigInt::from_str(&bigint_str).map_err(|e| DecodeError::ParseBigIntError(e.to_string()))
    }

    fn read_json(&mut self) -> Result<JSON::Value, DecodeError> {
        let json_str = self.read_string()?;
        JSON::from_str(&json_str).map_err(|e| DecodeError::JSONReadError(e.to_string()))
    }

    fn read_array_length(&mut self) -> Result<u32, DecodeError> {
        match Format::get_format(self)? {
            Format::FixArray(len) => Ok(len as u32),
            Format::Array16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Array32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            err_f => {
                let err_msg = format!(
                    "Property must be of type 'array'. {}",
                    get_error_message(err_f)
                );
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_array<T>(
        &mut self,
        mut reader: impl FnMut(&mut Self) -> Result<T, DecodeError>,
    ) -> Result<Vec<T>, DecodeError> {
        let arr_len = self.read_array_length()?;
        let mut array: Vec<T> = vec![];
        for i in 0..arr_len {
            self.context.push("array[", &i.to_string(), "]");
            let item = reader(self)?;
            array.push(item);
            self.context.pop();
        }
        Ok(array)
    }

    fn read_map_length(&mut self) -> Result<u32, DecodeError> {
        match Format::get_format(self)? {
            Format::FixMap(len) => Ok(len as u32),
            Format::Map16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Map32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            err_f => {
                let err_msg = format!(
                    "Property must be of type 'map'. {}",
                    get_error_message(err_f)
                );
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_map<K, V>(
        &mut self,
        mut key_fn: impl FnMut(&mut Self) -> Result<K, DecodeError>,
        mut val_fn: impl FnMut(&mut Self) -> Result<V, DecodeError>,
    ) -> Result<BTreeMap<K, V>, DecodeError>
    where
        K: Eq + Hash + Ord,
    {
        let map_len = self.read_map_length()?;
        let mut map: BTreeMap<K, V> = BTreeMap::new();
        for i in 0..map_len {
            self.context.push("map[", &i.to_string(), "]");
            let key = key_fn(self)?;
            let value = val_fn(self)?;
            map.insert(key, value);
            self.context.pop();
        }
        Ok(map)
    }

    fn read_nullable_bool(&mut self) -> Result<Option<bool>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_bool()?))
    }

    fn read_nullable_i8(&mut self) -> Result<Option<i8>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_i8(self)?))
    }

    fn read_nullable_i16(&mut self) -> Result<Option<i16>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_i16(self)?))
    }

    fn read_nullable_i32(&mut self) -> Result<Option<i32>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_i32(self)?))
    }

    fn read_nullable_u8(&mut self) -> Result<Option<u8>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_u8(self)?))
    }

    fn read_nullable_u16(&mut self) -> Result<Option<u16>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_u16(self)?))
    }

    fn read_nullable_u32(&mut self) -> Result<Option<u32>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_u32(self)?))
    }

    fn read_nullable_f32(&mut self) -> Result<Option<f32>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_f32(self)?))
    }

    fn read_nullable_f64(&mut self) -> Result<Option<f64>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(Read::read_f64(self)?))
    }

    fn read_nullable_string(&mut self) -> Result<Option<String>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_string()?))
    }

    fn read_nullable_bytes(&mut self) -> Result<Option<Vec<u8>>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_bytes()?))
    }

    fn read_nullable_bigint(&mut self) -> Result<Option<BigInt>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_bigint()?))
    }

    fn read_nullable_json(&mut self) -> Result<Option<JSON::Value>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_json()?))
    }

    fn read_nullable_array<T>(
        &mut self,
        reader: impl FnMut(&mut Self) -> Result<T, DecodeError>,
    ) -> Result<Option<Vec<T>>, DecodeError> {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_array(reader)?))
    }

    fn read_nullable_map<K, V>(
        &mut self,
        key_fn: impl FnMut(&mut Self) -> Result<K, DecodeError>,
        val_fn: impl FnMut(&mut Self) -> Result<V, DecodeError>,
    ) -> Result<Option<BTreeMap<K, V>>, DecodeError>
    where
        K: Eq + Hash + Ord,
    {
        if self.is_next_nil()? {
            return Ok(None);
        }
        Ok(Some(self.read_map(key_fn, val_fn)?))
    }

    fn is_next_nil(&mut self) -> Result<bool, DecodeError> {
        let format = Format::get_format(self)?;
        Ok(format == Format::Nil)
    }

    fn is_next_string(&mut self) -> Result<bool, DecodeError> {
        let format = Format::get_format(self)?;
        Ok(format == Format::FixStr(format.to_u8())
            || format == Format::Str8
            || format == Format::Str16
            || format == Format::Str32)
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
