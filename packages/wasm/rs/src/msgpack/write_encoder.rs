use super::{error::EncodeError, DataView, Format, Write, ExtensionType};
use crate::{BigInt, BigNumber, JSON, Context};
use byteorder::{BigEndian, WriteBytesExt};
use core::hash::Hash;
use std::{collections::BTreeMap, io::Write as StdioWrite};

#[derive(Debug)]
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

    pub fn write_negative_fixed_int(&mut self, value: i8) -> Result<(), EncodeError> {
        // From 0xe0 (0b11100000) taking last 5 bits, to 0xff (0b11111111), taking last 5 bits
        assert!(-32 <= value && value <= 0);
        Format::set_format(self, Format::NegativeFixInt(value))
            .map_err(|e| EncodeError::FormatWriteError(e.to_string()))
    }

    pub fn write_positive_fixed_int(&mut self, value: u8) -> Result<(), EncodeError> {
        assert!(value < 128);
        Format::set_format(self, Format::PositiveFixInt(value))
            .map_err(|e| EncodeError::FormatWriteError(e.to_string()))
    }

    /// Encodes a `u64` value into the buffer using the most efficient representation.
    ///
    /// The MessagePack spec requires that the serializer should use
    /// the format which represents the data in the smallest number of bytes.
    #[doc(hidden)]
    pub fn write_u64(&mut self, value: &u64) -> Result<(), EncodeError> {
        let val = *value;
        if val < 1 << 7 {
            Ok(self.write_positive_fixed_int(val as u8)?)
        } else if val <= u8::MAX as u64 {
            Format::set_format(self, Format::Uint8)?;
            Ok(WriteBytesExt::write_u8(self, val as u8)?)
        } else if val <= u16::MAX as u64 {
            Format::set_format(self, Format::Uint16)?;
            Ok(WriteBytesExt::write_u16::<BigEndian>(self, val as u16)?)
        } else if val <= u32::MAX as u64 {
            Format::set_format(self, Format::Uint32)?;
            Ok(WriteBytesExt::write_u32::<BigEndian>(self, val as u32)?)
        } else {
            Format::set_format(self, Format::Uint64)?;
            Ok(WriteBytesExt::write_u64::<BigEndian>(self, val as u64)?)
        }
    }

    /// Encodes an `i64` value into the buffer using the most efficient representation.
    ///
    /// The MessagePack spec requires that the serializer should use
    /// the format which represents the data in the smallest number of bytes, with the exception of
    /// sized/unsized types.
    #[doc(hidden)]
    pub fn write_i64(&mut self, value: &i64) -> Result<(), EncodeError> {
        let val = *value;

        if val >= 0 && val < 1 << 7 {
          Ok(self.write_positive_fixed_int(val as u8)?)
        } else if val < 0 && val >= -(1 << 5) {
          Ok(self.write_negative_fixed_int(val as i8)?)
        } else if val <= i8::MAX as i64 && val >= i8::MIN as i64 {
          Format::set_format(self, Format::Int8)?;
          Ok(WriteBytesExt::write_i8(self, val as i8)?)
        } else if val <= i16::MAX as i64 && val >= i16::MIN as i64 {
          Format::set_format(self, Format::Int16)?;
          Ok(WriteBytesExt::write_i16::<BigEndian>(self, val as i16)?)
        } else if val <= i32::MAX as i64 && val >= i32::MIN as i64 {
          Format::set_format(self, Format::Int32)?;
          Ok(WriteBytesExt::write_i32::<BigEndian>(self, val as i32)?)
        } else {
          Format::set_format(self, Format::Int64)?;
          Ok(WriteBytesExt::write_i64::<BigEndian>(self, val as i64)?)
        }
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
        Format::set_format(self, Format::Nil).map_err(|e| EncodeError::NilWriteError(e.to_string()))
    }

    fn write_bool(&mut self, value: &bool) -> Result<(), EncodeError> {
        let format = if *value { Format::True } else { Format::False };
        Format::set_format(self, format).map_err(|e| EncodeError::BooleanWriteError(e.to_string()))
    }

    fn write_i8(&mut self, value: &i8) -> Result<(), EncodeError> {
        self.write_i64(&(*value as i64))
            .map_err(|e| EncodeError::Int8WriteError(e.to_string()))
    }

    fn write_i16(&mut self, value: &i16) -> Result<(), EncodeError> {
        self.write_i64(&(*value as i64))
            .map_err(|e| EncodeError::Int16WriteError(e.to_string()))
    }

    fn write_i32(&mut self, value: &i32) -> Result<(), EncodeError> {
        self.write_i64(&(*value as i64))
            .map_err(|e| EncodeError::Int32WriteError(e.to_string()))
    }

    fn write_u8(&mut self, value: &u8) -> Result<(), EncodeError> {
        self.write_u64(&(*value as u64))
            .map_err(|e| EncodeError::Uint8WriteError(e.to_string()))
    }

    fn write_u16(&mut self, value: &u16) -> Result<(), EncodeError> {
        self.write_u64(&(*value as u64))
            .map_err(|e| EncodeError::Uint16WriteError(e.to_string()))
    }

    fn write_u32(&mut self, value: &u32) -> Result<(), EncodeError> {
        self.write_u64(&(*value as u64))
            .map_err(|e| EncodeError::Uint32WriteError(e.to_string()))
    }

    fn write_f32(&mut self, value: &f32) -> Result<(), EncodeError> {
        Format::set_format(self, Format::Float32)?;
        WriteBytesExt::write_f32::<BigEndian>(self, *value)
            .map_err(|e| EncodeError::Float32WriteError(e.to_string()))
    }

    fn write_f64(&mut self, value: &f64) -> Result<(), EncodeError> {
        Format::set_format(self, Format::Float64)?;
        WriteBytesExt::write_f64::<BigEndian>(self, *value)
            .map_err(|e| EncodeError::Float64WriteError(e.to_string()))
    }

    fn write_string_length(&mut self, length: &u32) -> Result<(), EncodeError> {
        let length = *length;
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

    fn write_string(&mut self, value: &str) -> Result<(), EncodeError> {
        self.write_string_length(&(value.len() as u32))?;
        self.write_all(value.as_bytes())
            .map_err(|e| EncodeError::StrWriteError(e.to_string()))
    }

    fn write_bytes_length(&mut self, length: &u32) -> Result<(), EncodeError> {
        let length = *length;
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

    fn write_bytes(&mut self, buf: &[u8]) -> Result<(), EncodeError> {
        if buf.is_empty() {
            return self.write_nil();
        }
        self.write_bytes_length(&(buf.len() as u32))?;
        self.write_all(buf)
            .map_err(|e| EncodeError::BinWriteError(e.to_string()))
    }

    fn write_bigint(&mut self, value: &BigInt) -> Result<(), EncodeError> {
        self.write_string(&value.to_string())
            .map_err(|e| EncodeError::BigIntWriteError(e.to_string()))
    }

    fn write_bignumber(&mut self, value: &BigNumber) -> Result<(), EncodeError> {
        self.write_string(&value.to_string())
            .map_err(|e| EncodeError::BigIntWriteError(e.to_string()))
    }

    fn write_json(&mut self, value: &JSON::Value) -> Result<(), EncodeError> {
        let json_str = JSON::to_string(value)?;
        self.write_string(&json_str)
            .map_err(|e| EncodeError::JSONWriteError(e.to_string()))
    }

    fn write_array_length(&mut self, length: &u32) -> Result<(), EncodeError> {
        let length = *length;
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
        array: &[T],
        mut item_writer: impl FnMut(&mut Self, &T) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError> {
        self.write_array_length(&(array.len() as u32))?;
        for element in array {
            item_writer(self, element)?;
        }
        Ok(())
    }

    fn write_map_length(&mut self, length: &u32) -> Result<(), EncodeError> {
        let length = *length;
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
        mut key_writer: impl FnMut(&mut Self, &K) -> Result<(), EncodeError>,
        mut val_writer: impl FnMut(&mut Self, &V) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError>
    where
        K: Clone + Eq + Hash + Ord,
    {
        self.write_map_length(&(map.len() as u32))?;
        let keys: Vec<_> = map.keys().into_iter().collect();
        for key in keys {
            let value = &map[key];
            key_writer(self, key)?;
            val_writer(self, value)?;
        }
        Ok(())
    }

    fn write_ext_generic_map<K, V: Clone>(
        &mut self,
        map: &BTreeMap<K, V>,
        mut key_writer: impl FnMut(&mut Self, &K) -> Result<(), EncodeError>,
        mut val_writer: impl FnMut(&mut Self, &V) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError>
    where
        K: Clone + Eq + Hash + Ord,
    {
        let mut encoder = WriteEncoder::new(&[], self.context.clone());
        encoder.write_map(map, key_writer, val_writer)?;

        let buf = encoder.get_buffer();
        let bytelength = buf.len();

        // Encode the extension format + bytelength
        if bytelength <= u8::MAX as usize {
            Format::set_format(self, Format::Ext8)?;
            WriteBytesExt::write_u8(self, bytelength.try_into().unwrap())?;
        } else if bytelength <= u16::MAX as usize {
            Format::set_format(self, Format::Ext16)?;
            WriteBytesExt::write_u16::<BigEndian>(self, bytelength.try_into().unwrap())?;
        } else {
            Format::set_format(self, Format::Ext32)?;
            WriteBytesExt::write_u32::<BigEndian>(self, bytelength.try_into().unwrap())?;
        }

        // Set the extension type
        WriteBytesExt::write_u8(self, ExtensionType::GenericMap.to_u8())?;

        // Copy the map's encoded buffer
        self.view.buffer.write_all(&buf)?;

        Ok(())
    }

    fn write_optional_bool(&mut self, value: &Option<bool>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(v) => Write::write_bool(self, v),
        }
    }

    fn write_optional_i8(&mut self, value: &Option<i8>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(v) => Write::write_i8(self, v),
        }
    }

    fn write_optional_i16(&mut self, value: &Option<i16>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(v) => Write::write_i16(self, v),
        }
    }

    fn write_optional_i32(&mut self, value: &Option<i32>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(v) => Write::write_i32(self, v),
        }
    }

    fn write_optional_u8(&mut self, value: &Option<u8>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(v) => Write::write_u8(self, v),
        }
    }

    fn write_optional_u16(&mut self, value: &Option<u16>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(v) => Write::write_u16(self, v),
        }
    }

    fn write_optional_u32(&mut self, value: &Option<u32>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(v) => Write::write_u32(self, v),
        }
    }

    fn write_optional_f32(&mut self, value: &Option<f32>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(v) => Write::write_f32(self, v),
        }
    }

    fn write_optional_f64(&mut self, value: &Option<f64>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(v) => Write::write_f64(self, v),
        }
    }

    fn write_optional_string(&mut self, value: &Option<String>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(s) => Write::write_string(self, s),
        }
    }

    fn write_optional_bytes(&mut self, value: &Option<Vec<u8>>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(bytes) => Write::write_bytes(self, bytes),
        }
    }

    fn write_optional_bigint(&mut self, value: &Option<BigInt>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(bigint) => Write::write_bigint(self, bigint),
        }
    }

    fn write_optional_bignumber(&mut self, value: &Option<BigNumber>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(bignumber) => Write::write_bignumber(self, bignumber)
        }
    }

    fn write_optional_json(&mut self, value: &Option<JSON::Value>) -> Result<(), EncodeError> {
        match value {
            None => Write::write_nil(self),
            Some(json) => Write::write_json(self, json),
        }
    }

    fn write_optional_array<T: Clone>(
        &mut self,
        opt_array: &Option<Vec<T>>,
        item_writer: impl FnMut(&mut Self, &T) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError> {
        match opt_array {
            None => Write::write_nil(self),
            Some(array) => Write::write_array(self, array, item_writer),
        }
    }

    fn write_optional_map<K, V: Clone>(
        &mut self,
        opt_map: &Option<BTreeMap<K, V>>,
        key_writer: impl FnMut(&mut Self, &K) -> Result<(), EncodeError>,
        val_writer: impl FnMut(&mut Self, &V) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError>
    where
        K: Clone + Eq + Hash + Ord,
    {
        match opt_map {
            None => Write::write_nil(self),
            Some(map) => Write::write_map(self, map, key_writer, val_writer),
        }
    }

    fn write_optional_ext_generic_map<K, V: Clone>(
        &mut self,
        opt_map: &Option<BTreeMap<K, V>>,
        key_writer: impl FnMut(&mut Self, &K) -> Result<(), EncodeError>,
        val_writer: impl FnMut(&mut Self, &V) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError>
    where
        K: Clone + Eq + Hash + Ord,
    {
        match opt_map {
            None => Write::write_nil(self),
            Some(map) => Write::write_ext_generic_map(self, map, key_writer, val_writer),
        }
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
