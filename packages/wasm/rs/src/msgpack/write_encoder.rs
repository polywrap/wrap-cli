use super::error::MsgPackError;
use super::{Context, DataView, Format, Write};
use crate::{BigInt, JSON};
use byteorder::{BigEndian, WriteBytesExt};
use core::hash::Hash;
use std::collections::BTreeMap;
use std::io::Write as IoWrite;

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

impl std::io::Write for WriteEncoder {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        self.view.buffer.write(buf)
    }

    fn flush(&mut self) -> std::io::Result<()> {
        self.view.buffer.flush()
    }
}

impl Write for WriteEncoder {
    fn write_nil(&mut self) -> Result<(), MsgPackError> {
        Ok(Format::set_format(self, Format::Nil)?)
    }

    fn write_bool(&mut self, value: bool) -> Result<(), MsgPackError> {
        let format = if value { Format::True } else { Format::False };
        Ok(Format::set_format(self, format)?)
    }

    fn write_i8(&mut self, value: i8) -> Result<(), MsgPackError> {
        Format::set_format(self, Format::Int8)?;
        Ok(WriteBytesExt::write_i8(self, value)?)
    }

    fn write_i16(&mut self, value: i16) -> Result<(), MsgPackError> {
        Format::set_format(self, Format::Int16)?;
        Ok(WriteBytesExt::write_i16::<BigEndian>(self, value)?)
    }

    fn write_i32(&mut self, value: i32) -> Result<(), MsgPackError> {
        Format::set_format(self, Format::Int32)?;
        Ok(WriteBytesExt::write_i32::<BigEndian>(self, value)?)
    }

    fn write_i64(&mut self, value: i64) -> Result<(), MsgPackError> {
        Format::set_format(self, Format::Int64)?;
        Ok(WriteBytesExt::write_i64::<BigEndian>(self, value)?)
    }

    fn write_u8(&mut self, value: u8) -> Result<(), MsgPackError> {
        Format::set_format(self, Format::Uint8)?;
        Ok(WriteBytesExt::write_u8(self, value)?)
    }

    fn write_u16(&mut self, value: u16) -> Result<(), MsgPackError> {
        Format::set_format(self, Format::Uint16)?;
        Ok(WriteBytesExt::write_u16::<BigEndian>(self, value)?)
    }

    fn write_u32(&mut self, value: u32) -> Result<(), MsgPackError> {
        Format::set_format(self, Format::Uint32)?;
        Ok(WriteBytesExt::write_u32::<BigEndian>(self, value)?)
    }

    fn write_u64(&mut self, value: u64) -> Result<(), MsgPackError> {
        Format::set_format(self, Format::Uint64)?;
        Ok(WriteBytesExt::write_u64::<BigEndian>(self, value)?)
    }

    fn write_f32(&mut self, value: f32) -> Result<(), MsgPackError> {
        Format::set_format(self, Format::Float32)?;
        Ok(WriteBytesExt::write_f32::<BigEndian>(self, value)?)
    }

    fn write_f64(&mut self, value: f64) -> Result<(), MsgPackError> {
        Format::set_format(self, Format::Float64)?;
        Ok(WriteBytesExt::write_f64::<BigEndian>(self, value)?)
    }

    fn write_string_length(&mut self, length: u32) -> Result<(), MsgPackError> {
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

    fn write_string(&mut self, value: &String) -> Result<(), MsgPackError> {
        self.write_string_length(value.len() as u32)?;
        Ok(self.write_all(value.as_bytes())?)
    }

    fn write_str(&mut self, value: &str) -> Result<(), MsgPackError> {
        self.write_string_length(value.len() as u32)?;
        Ok(self.write_all(value.as_bytes())?)
    }

    fn write_bytes_length(&mut self, length: u32) -> Result<(), MsgPackError> {
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

    fn write_bytes(&mut self, buf: &[u8]) -> Result<(), MsgPackError> {
        self.write_bytes_length(buf.len() as u32)?;
        Ok(self.write_all(buf)?)
    }

    fn write_bigint(&mut self, value: BigInt) -> Result<(), MsgPackError> {
        self.write_string(&value.to_string())
    }

    fn write_json(&mut self, value: &JSON::Value) -> Result<(), MsgPackError> {
        let res: Result<String, JSON::Error> = JSON::from_value(value.clone());
        match res {
            Ok(s) => {
                self.write_string(&s)?;
                Ok(())
            }
            Err(e) => Err(MsgPackError::from(e)),
        }
    }

    fn write_array_length(&mut self, length: u32) -> Result<(), MsgPackError> {
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
    ) -> Result<(), MsgPackError> {
        self.write_array_length(a.len() as u32)?;
        for element in a {
            arr_fn(self, element);
        }
        Ok(())
    }

    fn write_map_length(&mut self, length: u32) -> Result<(), MsgPackError> {
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
    ) -> Result<(), MsgPackError>
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

    fn write_nullable_bool(&mut self, value: &Option<bool>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_bool(*v)?),
        }
    }

    fn write_nullable_i8(&mut self, value: &Option<i8>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(WriteBytesExt::write_i8(self, *v)?),
        }
    }

    fn write_nullable_i16(&mut self, value: &Option<i16>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(WriteBytesExt::write_i16::<BigEndian>(self, *v)?),
        }
    }

    fn write_nullable_i32(&mut self, value: &Option<i32>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(WriteBytesExt::write_i32::<BigEndian>(self, *v)?),
        }
    }

    fn write_nullable_i64(&mut self, value: &Option<i64>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(WriteBytesExt::write_i64::<BigEndian>(self, *v)?),
        }
    }

    fn write_nullable_u8(&mut self, value: &Option<u8>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(WriteBytesExt::write_u8(self, *v)?),
        }
    }

    fn write_nullable_u16(&mut self, value: &Option<u16>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(WriteBytesExt::write_u16::<BigEndian>(self, *v)?),
        }
    }

    fn write_nullable_u32(&mut self, value: &Option<u32>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(WriteBytesExt::write_u32::<BigEndian>(self, *v)?),
        }
    }

    fn write_nullable_u64(&mut self, value: &Option<u64>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(WriteBytesExt::write_u64::<BigEndian>(self, *v)?),
        }
    }

    fn write_nullable_f32(&mut self, value: &Option<f32>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(WriteBytesExt::write_f32::<BigEndian>(self, *v)?),
        }
    }

    fn write_nullable_f64(&mut self, value: &Option<f64>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(WriteBytesExt::write_f64::<BigEndian>(self, *v)?),
        }
    }

    fn write_nullable_string(&mut self, value: &Option<String>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(s) => Ok(self.write_string(s)?),
        }
    }

    fn write_nullable_bytes(&mut self, value: &Option<Vec<u8>>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(b) => Ok(self.write_bytes(b)?),
        }
    }

    fn write_nullable_bigint(&mut self, value: &Option<BigInt>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(val) => Ok(self.write_bigint(val.to_owned())?),
        }
    }

    fn write_nullable_json(&mut self, value: &Option<JSON::Value>) -> Result<(), MsgPackError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(json) => Ok(self.write_json(json)?),
        }
    }

    fn write_nullable_array<T: Clone>(
        &mut self,
        a: &Option<Vec<T>>,
        arr_fn: impl FnMut(&mut Self, &T),
    ) -> Result<(), MsgPackError> {
        match a {
            None => Ok(self.write_nil()?),
            Some(arr) => Ok(self.write_array(arr, arr_fn)?),
        }
    }

    fn write_nullable_map<K, V: Clone>(
        &mut self,
        map: &Option<BTreeMap<K, V>>,
        key_fn: impl FnMut(&mut Self, &K),
        val_fn: impl FnMut(&mut Self, &V),
    ) -> Result<(), MsgPackError>
    where
        K: Clone + Eq + Hash + Ord,
    {
        match map {
            None => Ok(self.write_nil()?),
            Some(m) => Ok(self.write_map(m, key_fn, val_fn)?),
        }
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
