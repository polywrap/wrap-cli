use super::error::EncodingError;
use super::{Context, Write};
use crate::{BigInt, JSON};
use core::hash::Hash;
use std::collections::BTreeMap;
use std::io::Write as IoWrite;

#[derive(Clone, Debug, Default)]
pub struct WriteSizer {
    pub length: i32,
    context: Context,
}

impl WriteSizer {
    #[allow(dead_code)]
    pub fn new(context: Context) -> Self {
        Self { length: 0, context }
    }

    pub fn get_length(&self) -> i32 {
        self.length
    }
}

impl Write for WriteSizer {
    fn write_nil<W: IoWrite>(&mut self, _writer: &mut W) -> Result<(), EncodingError> {
        self.length += 1;
        Ok(())
    }

    fn write_bool<W: IoWrite>(
        &mut self,
        _writer: &mut W,
        _value: bool,
    ) -> Result<(), EncodingError> {
        self.length += 1;
        Ok(())
    }

    fn write_i8<W: IoWrite>(&mut self, writer: &mut W, value: i8) -> Result<(), EncodingError> {
        self.write_i32(writer, value as i32)
    }

    fn write_i16<W: IoWrite>(&mut self, writer: &mut W, value: i16) -> Result<(), EncodingError> {
        self.write_i32(writer, value as i32)
    }

    fn write_i32<W: IoWrite>(&mut self, _writer: &mut W, value: i32) -> Result<(), EncodingError> {
        if value >= -(1 << 5) && value < 1 << 7 {
            self.length += 1;
        } else if value < 1 << 7 && value >= -(1 << 7) {
            self.length += 2;
        } else if value < 1 << 15 && value >= -(1 << 15) {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_u8<W: IoWrite>(&mut self, writer: &mut W, value: u8) -> Result<(), EncodingError> {
        self.write_u32(writer, value as u32)
    }

    fn write_u16<W: IoWrite>(&mut self, writer: &mut W, value: u16) -> Result<(), EncodingError> {
        self.write_u32(writer, value as u32)
    }

    fn write_u32<W: IoWrite>(&mut self, _writer: &mut W, value: u32) -> Result<(), EncodingError> {
        if value < (1 << 7) {
            self.length += 1;
        } else if value < (1 << 8) {
            self.length += 2;
        } else if value < (1 << 16) {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_f32<W: IoWrite>(
        &mut self,
        _writer: &mut W,
        _valuee: f32,
    ) -> Result<(), EncodingError> {
        self.length += 5;
        Ok(())
    }

    fn write_f64<W: IoWrite>(&mut self, _writer: &mut W, _value: f64) -> Result<(), EncodingError> {
        self.length += 9;
        Ok(())
    }

    fn write_string_length<W: IoWrite>(
        &mut self,
        _writer: &mut W,
        length: u32,
    ) -> Result<(), EncodingError> {
        if length < 32 {
            self.length += 1;
        } else if length <= u8::MAX as u32 {
            self.length += 2;
        } else if length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_string<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &String,
    ) -> Result<(), EncodingError> {
        self.write_string_length(writer, value.len() as u32)?;
        self.length += value.len() as i32;
        Ok(())
    }

    fn write_str<W: IoWrite>(&mut self, writer: &mut W, value: &str) -> Result<(), EncodingError> {
        self.write_string_length(writer, value.len() as u32)?;
        self.length += value.len() as i32;
        Ok(())
    }

    fn write_bytes_length<W: IoWrite>(
        &mut self,
        _writer: &mut W,
        length: u32,
    ) -> Result<(), EncodingError> {
        if length <= u8::MAX as u32 {
            self.length += 2;
        } else if length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_bytes<W: IoWrite>(&mut self, writer: &mut W, buf: &[u8]) -> Result<(), EncodingError> {
        if buf.is_empty() {
            self.length += 1;
        } else {
            self.write_bytes_length(writer, buf.len() as u32)?;
            self.length += buf.len() as i32;
        }
        Ok(())
    }

    fn write_bigint<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: BigInt,
    ) -> Result<(), EncodingError> {
        self.write_string(writer, &value.to_string())
    }

    fn write_json<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &JSON::Value,
    ) -> Result<(), EncodingError> {
        let res: Result<String, JSON::Error> = JSON::from_value(value.clone());
        match res {
            Ok(s) => {
                self.write_string(writer, &s)?;
                Ok(())
            }
            Err(e) => Err(EncodingError::from(e)),
        }
    }

    fn write_array_length<W: IoWrite>(
        &mut self,
        _writer: &mut W,
        length: u32,
    ) -> Result<(), EncodingError> {
        if length < 16 {
            self.length += 1;
        } else if length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_array<T: Clone, W: IoWrite>(
        &mut self,
        writer: &mut W,
        a: &[T],
        mut arr_fn: impl FnMut(&mut W, &T),
    ) -> Result<(), EncodingError> {
        self.write_array_length(writer, a.len() as u32)?;
        for element in a {
            arr_fn(writer, element);
        }
        Ok(())
    }

    fn write_map_length<W: IoWrite>(
        &mut self,
        _writer: &mut W,
        length: u32,
    ) -> Result<(), EncodingError> {
        if length < 16 {
            self.length += 1;
        } else if length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_map<K, V: Clone, W: IoWrite>(
        &mut self,
        writer: &mut W,
        map: &BTreeMap<K, V>,
        mut key_fn: impl FnMut(&mut W, &K),
        mut val_fn: impl FnMut(&mut W, &V),
    ) -> Result<(), EncodingError>
    where
        K: Clone + Eq + Hash + Ord,
    {
        self.write_map_length(writer, map.len() as u32)?;
        let keys: Vec<_> = map.keys().into_iter().collect();
        let values: Vec<_> = map.values().into_iter().collect();
        for key in keys {
            for value in &values {
                key_fn(writer, key);
                val_fn(writer, value);
            }
        }
        Ok(())
    }

    fn write_nullable_bool<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<bool>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(v) => {
                self.write_bool(writer, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_i8<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<i8>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(v) => {
                self.write_i8(writer, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_i16<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<i16>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(v) => {
                self.write_i16(writer, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_i32<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<i32>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(v) => {
                self.write_i32(writer, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_u8<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<u8>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(v) => {
                self.write_u8(writer, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_u16<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<u16>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(v) => {
                self.write_u16(writer, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_u32<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<u32>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(v) => {
                self.write_u32(writer, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_f32<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<f32>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(v) => {
                self.write_f32(writer, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_f64<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<f64>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(v) => {
                self.write_f64(writer, *v)?;
                Ok(())
            }
        }
    }

    fn write_nullable_string<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<String>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(s) => {
                self.write_string(writer, s)?;
                Ok(())
            }
        }
    }

    fn write_nullable_bytes<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<Vec<u8>>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(b) => {
                self.write_bytes(writer, b)?;
                Ok(())
            }
        }
    }

    fn write_nullable_bigint<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<BigInt>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(val) => {
                self.write_bigint(writer, val.to_owned())?;
                Ok(())
            }
        }
    }

    fn write_nullable_json<W: IoWrite>(
        &mut self,
        writer: &mut W,
        value: &Option<JSON::Value>,
    ) -> Result<(), EncodingError> {
        match value {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(json) => {
                self.write_json(writer, json)?;
                Ok(())
            }
        }
    }

    fn write_nullable_array<T: Clone, W: IoWrite>(
        &mut self,
        writer: &mut W,
        a: &Option<Vec<T>>,
        arr_fn: impl FnMut(&mut W, &T),
    ) -> Result<(), EncodingError> {
        match a {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(arr) => {
                self.write_array(writer, arr, arr_fn)?;
                Ok(())
            }
        }
    }

    fn write_nullable_map<K, V: Clone, W: IoWrite>(
        &mut self,
        writer: &mut W,
        map: &Option<BTreeMap<K, V>>,
        key_fn: impl FnMut(&mut W, &K),
        val_fn: impl FnMut(&mut W, &V),
    ) -> Result<(), EncodingError>
    where
        K: Clone + Eq + Hash + Ord,
    {
        match map {
            None => {
                self.write_nil(writer)?;
                Ok(())
            }
            Some(m) => {
                self.write_map(writer, m, key_fn, val_fn)?;
                Ok(())
            }
        }
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
