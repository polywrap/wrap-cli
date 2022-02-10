use super::{error::EncodeError, Context, Write};
use crate::{BigInt, JSON};
use core::hash::Hash;
use std::collections::BTreeMap;

#[derive(Clone, Debug, Default)]
pub struct WriteSizer {
    pub(crate) length: i32,
    pub(crate) context: Context,
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

impl std::io::Write for WriteSizer {
    fn write(&mut self, _buf: &[u8]) -> std::io::Result<usize> {
        unimplemented!()
    }

    fn flush(&mut self) -> std::io::Result<()> {
        unimplemented!()
    }
}

impl Write for WriteSizer {
    fn write_nil(&mut self) -> Result<(), EncodeError> {
        self.length += 1;
        Ok(())
    }

    fn write_bool(&mut self, _value: &bool) -> Result<(), EncodeError> {
        self.length += 1;
        Ok(())
    }

    fn write_i8(&mut self, value: &i8) -> Result<(), EncodeError> {
        self.write_i32(&(*value as i32))
    }

    fn write_i16(&mut self, value: &i16) -> Result<(), EncodeError> {
        self.write_i32(&(*value as i32))
    }

    fn write_i32(&mut self, value: &i32) -> Result<(), EncodeError> {
        if *value >= -(1 << 5) && *value < 1 << 7 {
            self.length += 1;
        } else if *value < 1 << 7 && *value >= -(1 << 7) {
            self.length += 2;
        } else if *value < 1 << 15 && *value >= -(1 << 15) {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_i64(&mut self, _value: &i64) -> Result<(), EncodeError> {
        unimplemented!()
    }

    fn write_u8(&mut self, value: &u8) -> Result<(), EncodeError> {
        self.write_u32(&(*value as u32))
    }

    fn write_u16(&mut self, value: &u16) -> Result<(), EncodeError> {
        self.write_u32(&(*value as u32))
    }

    fn write_u32(&mut self, value: &u32) -> Result<(), EncodeError> {
        if *value < (1 << 7) {
            self.length += 1;
        } else if *value < (1 << 8) {
            self.length += 2;
        } else if *value < (1 << 16) {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_u64(&mut self, _value: &u64) -> Result<(), EncodeError> {
        unimplemented!()
    }

    fn write_f32(&mut self, _valuee: &f32) -> Result<(), EncodeError> {
        self.length += 5;
        Ok(())
    }

    fn write_f64(&mut self, _value: &f64) -> Result<(), EncodeError> {
        self.length += 9;
        Ok(())
    }

    fn write_string_length(&mut self, length: &u32) -> Result<(), EncodeError> {
        if *length < 32 {
            self.length += 1;
        } else if *length <= u8::MAX as u32 {
            self.length += 2;
        } else if *length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_string(&mut self, value: &String) -> Result<(), EncodeError> {
        self.write_string_length(&(value.len() as u32))?;
        self.length += value.len() as i32;
        Ok(())
    }

    fn write_str(&mut self, value: &str) -> Result<(), EncodeError> {
        self.write_string_length(&(value.len() as u32))?;
        self.length += value.len() as i32;
        Ok(())
    }

    fn write_bytes_length(&mut self, length: &u32) -> Result<(), EncodeError> {
        if *length <= u8::MAX as u32 {
            self.length += 2;
        } else if *length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_bytes(&mut self, buf: &[u8]) -> Result<(), EncodeError> {
        if buf.is_empty() {
            self.length += 1;
        } else {
            self.write_bytes_length(&(buf.len() as u32))?;
            self.length += buf.len() as i32;
        }
        Ok(())
    }

    fn write_bigint(&mut self, value: &BigInt) -> Result<(), EncodeError> {
        self.write_string(&value.to_string())
    }

    fn write_json(&mut self, value: &JSON::Value) -> Result<(), EncodeError> {
        let res: Result<String, JSON::Error> = JSON::from_value(value.clone());
        match res {
            Ok(s) => {
                self.write_string(&s)?;
                Ok(())
            }
            Err(e) => Err(EncodeError::from(e)),
        }
    }

    fn write_array_length(&mut self, length: &u32) -> Result<(), EncodeError> {
        if *length < 16 {
            self.length += 1;
        } else if *length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
        }
        Ok(())
    }

    fn write_array<T: Clone>(
        &mut self,
        a: &[T],
        mut arr_fn: impl FnMut(&mut Self, &T) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError> {
        self.write_array_length(&(a.len() as u32))?;
        for element in a {
            arr_fn(self, element)?;
        }
        Ok(())
    }

    fn write_map_length(&mut self, length: &u32) -> Result<(), EncodeError> {
        if *length < 16 {
            self.length += 1;
        } else if *length <= u16::MAX as u32 {
            self.length += 3;
        } else {
            self.length += 5;
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
        self.write_map_length(&(map.len() as u32))?;
        let keys: Vec<_> = map.keys().into_iter().collect();
        let values: Vec<_> = map.values().into_iter().collect();
        for key in keys {
            for value in &values {
                key_fn(self, key)?;
                val_fn(self, value)?;
            }
        }
        Ok(())
    }

    fn write_nullable_bool(&mut self, value: &Option<bool>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_bool(v)?),
        }
    }

    fn write_nullable_i8(&mut self, value: &Option<i8>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_i8(v)?),
        }
    }

    fn write_nullable_i16(&mut self, value: &Option<i16>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_i16(v)?),
        }
    }

    fn write_nullable_i32(&mut self, value: &Option<i32>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_i32(v)?),
        }
    }

    fn write_nullable_i64(&mut self, value: &Option<i64>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_i64(v)?),
        }
    }

    fn write_nullable_u8(&mut self, value: &Option<u8>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_u8(v)?),
        }
    }

    fn write_nullable_u16(&mut self, value: &Option<u16>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_u16(v)?),
        }
    }

    fn write_nullable_u32(&mut self, value: &Option<u32>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_u32(v)?),
        }
    }

    fn write_nullable_u64(&mut self, value: &Option<u64>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_u64(v)?),
        }
    }

    fn write_nullable_f32(&mut self, value: &Option<f32>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_f32(v)?),
        }
    }

    fn write_nullable_f64(&mut self, value: &Option<f64>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(v) => Ok(self.write_f64(v)?),
        }
    }

    fn write_nullable_string(&mut self, value: &Option<String>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(s) => Ok(self.write_string(s)?),
        }
    }

    fn write_nullable_bytes(&mut self, value: &Option<Vec<u8>>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(b) => Ok(self.write_bytes(b)?),
        }
    }

    fn write_nullable_bigint(&mut self, value: &Option<BigInt>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(val) => Ok(self.write_bigint(val)?),
        }
    }

    fn write_nullable_json(&mut self, value: &Option<JSON::Value>) -> Result<(), EncodeError> {
        match value {
            None => Ok(self.write_nil()?),
            Some(json) => Ok(self.write_json(json)?),
        }
    }

    fn write_nullable_array<T: Clone>(
        &mut self,
        a: &Option<Vec<T>>,
        arr_fn: impl FnMut(&mut Self, &T) -> Result<(), EncodeError>,
    ) -> Result<(), EncodeError> {
        match a {
            None => Ok(self.write_nil()?),
            Some(arr) => Ok(self.write_array(arr, arr_fn)?),
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
            None => Ok(self.write_nil()?),
            Some(m) => Ok(self.write_map(m, key_fn, val_fn)?),
        }
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
