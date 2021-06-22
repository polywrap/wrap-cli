use super::context::Context;
use super::data_view::DataView;
use super::format::Format;
use super::read::Read;
use num_bigint::BigInt;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::hash::Hash;
use std::io::{Error, ErrorKind, Result};
use std::str::FromStr;

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct ReadDecoder {
    context: Context,
    view: DataView,
}

impl ReadDecoder {
    #[allow(dead_code)]
    pub fn new(buf: &[u8], context: Context) -> Self {
        Self {
            context: context.clone(),
            view: DataView::new(buf, context).unwrap(),
        }
    }

    #[allow(dead_code)]
    fn skip(&mut self) {
        // get_size handles discarding `msgpack header` info
        let mut num_of_objects_to_discard = self.get_size().unwrap_or_default();
        while num_of_objects_to_discard > 0 {
            let _ = self.get_size().unwrap(); // discard next object
            num_of_objects_to_discard -= 1;
        }
    }

    fn get_size(&mut self) -> Result<i32> {
        let lead_byte = self.view.get_u8().unwrap_or_default(); // will discard one
        let mut objects_to_discard: i32 = 0;
        // handle for fixed values
        if Format::is_negative_fixed_int(lead_byte) {
            // noop, will just discard the leadbyte
        } else if Format::is_fixed_int(lead_byte) {
            // noop, will just discard the leadbyte
        } else if Format::is_fixed_string(lead_byte) {
            let str_len = lead_byte & 0x1f;
            let _ = self.view.discard(str_len as i32);
        } else if Format::is_fixed_array(lead_byte) {
            objects_to_discard = (lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as i32;
        } else if Format::is_fixed_map(lead_byte) {
            objects_to_discard = 2 * (lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as i32;
        } else {
            match lead_byte {
                Format::NIL => {}
                Format::TRUE => {}
                Format::FALSE => {}
                Format::BIN8 => {
                    let length = self.view.get_u8().unwrap_or_default();
                    let _ = self.view.discard(length as i32);
                }
                Format::BIN16 => {
                    let length = self.view.get_u16().unwrap_or_default();
                    let _ = self.view.discard(length as i32);
                }
                Format::BIN32 => {
                    let length = self.view.get_u32().unwrap_or_default();
                    let _ = self.view.discard(length as i32);
                }
                Format::FLOAT32 => {
                    let _ = self.view.discard(4);
                }
                Format::FLOAT64 => {
                    let _ = self.view.discard(8);
                }
                Format::UINT8 => {
                    let _ = self.view.discard(1);
                }
                Format::UINT16 => {
                    let _ = self.view.discard(2);
                }
                Format::UINT32 => {
                    let _ = self.view.discard(4);
                }
                Format::UINT64 => {
                    let _ = self.view.discard(8);
                }
                Format::INT8 => {
                    let _ = self.view.discard(1);
                }
                Format::INT16 => {
                    let _ = self.view.discard(2);
                }
                Format::INT32 => {
                    let _ = self.view.discard(4);
                }
                Format::INT64 => {
                    let _ = self.view.discard(8);
                }
                Format::FIXEXT1 => {
                    let _ = self.view.discard(2);
                }
                Format::FIXEXT2 => {
                    let _ = self.view.discard(3);
                }
                Format::FIXEXT4 => {
                    let _ = self.view.discard(5);
                }
                Format::FIXEXT8 => {
                    let _ = self.view.discard(9);
                }
                Format::FIXEXT16 => {
                    let _ = self.view.discard(17);
                }
                Format::STR8 => {
                    let length = self.view.get_u8().unwrap_or_default();
                    let _ = self.view.discard(length as i32);
                }
                Format::STR16 => {
                    let length = self.view.get_u16().unwrap_or_default();
                    let _ = self.view.discard(length as i32);
                }
                Format::STR32 => {
                    let length = self.view.get_u32().unwrap_or_default();
                    let _ = self.view.discard(length as i32);
                }
                Format::ARRAY16 => {
                    objects_to_discard = self.view.get_u16().unwrap_or_default() as i32;
                }
                Format::ARRAY32 => {
                    objects_to_discard = self.view.get_u32().unwrap_or_default() as i32;
                }
                Format::MAP16 => {
                    objects_to_discard = 2 * (self.view.get_u16().unwrap_or_default() as i32);
                }
                Format::MAP32 => {
                    objects_to_discard = 2 * (self.view.get_u32().unwrap_or_default() as i32);
                }
                _ => {
                    let custom_error = format!(
                        "invalid prefix, bad encoding for val: {}",
                        lead_byte.to_string()
                    );
                    return Err(Error::new(ErrorKind::Other, custom_error));
                }
            }
        }

        Ok(objects_to_discard)
    }

    fn get_error_message(lead_byte: u8) -> Result<String> {
        if Format::is_negative_fixed_int(lead_byte) {
            return Ok("Found `int`".to_string());
        } else if Format::is_fixed_int(lead_byte) {
            return Ok("Found `int`".to_string());
        } else if Format::is_fixed_string(lead_byte) {
            return Ok("Found `string`".to_string());
        } else if Format::is_fixed_array(lead_byte) {
            return Ok("Found `array`".to_string());
        } else if Format::is_fixed_map(lead_byte) {
            return Ok("Found `map`".to_string());
        } else {
            match lead_byte {
                Format::NIL => {
                    return Ok("Found `nil`".to_string());
                }
                Format::TRUE => {
                    return Ok("Found `bool`".to_string());
                }
                Format::FALSE => {
                    return Ok("Found `bool`".to_string());
                }
                Format::BIN8 => {
                    return Ok("Found `BIN8`".to_string());
                }
                Format::BIN16 => {
                    return Ok("Found `BIN16`".to_string());
                }
                Format::BIN32 => {
                    return Ok("Found `BIN32`".to_string());
                }
                Format::FLOAT32 => {
                    return Ok("Found `float32`".to_string());
                }
                Format::FLOAT64 => {
                    return Ok("Found `float64`".to_string());
                }
                Format::UINT8 => {
                    return Ok("Found `uint8`".to_string());
                }
                Format::UINT16 => {
                    return Ok("Found `uint16`".to_string());
                }
                Format::UINT32 => {
                    return Ok("Found `uint32`".to_string());
                }
                Format::UINT64 => {
                    return Ok("Found `uint64`".to_string());
                }
                Format::INT8 => {
                    return Ok("Found `int8`".to_string());
                }
                Format::INT16 => {
                    return Ok("Found `int16`".to_string());
                }
                Format::INT32 => {
                    return Ok("Found `int32`".to_string());
                }
                Format::INT64 => {
                    return Ok("Found `int64`".to_string());
                }
                Format::FIXEXT1 => {
                    return Ok("Found `FIXEXT1`".to_string());
                }
                Format::FIXEXT2 => {
                    return Ok("Found `FIXEXT2`".to_string());
                }
                Format::FIXEXT4 => {
                    return Ok("Found `FIXEXT4`".to_string());
                }
                Format::FIXEXT8 => {
                    return Ok("Found `FIXEXT8`".to_string());
                }
                Format::FIXEXT16 => {
                    return Ok("Found `FIXEXT16`".to_string());
                }
                Format::STR8 => {
                    return Ok("Found `string`".to_string());
                }
                Format::STR16 => {
                    return Ok("Found `string`".to_string());
                }
                Format::STR32 => {
                    return Ok("Found `string`".to_string());
                }
                Format::ARRAY16 => {
                    return Ok("Found `array`".to_string());
                }
                Format::ARRAY32 => {
                    return Ok("Found `array`".to_string());
                }
                Format::MAP16 => {
                    return Ok("Found `map`".to_string());
                }
                Format::MAP32 => {
                    return Ok("Found `map`".to_string());
                }
                _ => {
                    let custom_error = format!(
                        "invalid prefix, bad encoding for val: {}",
                        lead_byte.to_string()
                    );
                    return Err(Error::new(ErrorKind::Other, custom_error));
                }
            }
        }
    }
}

impl Read for ReadDecoder {
    fn read_bool(&mut self) -> Result<bool> {
        let value = self.view.get_u8().unwrap_or_default();
        if value == Format::TRUE {
            return Ok(true);
        } else if value == Format::FALSE {
            return Ok(false);
        }
        let mut custom_error = String::new();
        custom_error.push_str("Property must be of type `bool`");
        let msg = Self::get_error_message(value).unwrap_or_default();
        custom_error.push_str(&msg);
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_i8(&mut self) -> Result<i8> {
        let value = self.read_i64().unwrap_or_default();
        if (value <= i8::MAX as i64) && (value >= i8::MIN as i64) {
            return Ok(value as i8);
        }
        let custom_error = format!("integer overflow: value = {}; bits = 8", value.to_string());
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_i16(&mut self) -> Result<i16> {
        let value = self.read_i64().unwrap_or_default();
        if (value <= i16::MAX as i64) && (value >= i16::MIN as i64) {
            return Ok(value as i16);
        }
        let custom_error = format!("integer overflow: value = {}; bits = 16", value.to_string());
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_i32(&mut self) -> Result<i32> {
        let value = self.read_i64().unwrap_or_default();
        if (value <= i32::MAX as i64) && (value >= i32::MIN as i64) {
            return Ok(value as i32);
        }
        let custom_error = format!("integer overflow: value = {}; bits = 32", value.to_string());
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_i64(&mut self) -> Result<i64> {
        let prefix = self.view.get_u8().unwrap_or_default();
        if Format::is_fixed_int(prefix) {
            return Ok(prefix as i64);
        }
        if Format::is_negative_fixed_int(prefix) {
            return Ok((prefix as i8) as i64);
        }
        match prefix {
            Format::INT8 => Ok(self.view.get_i8()? as i64),
            Format::INT16 => Ok(self.view.get_i16()? as i64),
            Format::INT32 => Ok(self.view.get_i32()? as i64),
            Format::INT64 => Ok(self.view.get_i64()?),
            _ => {
                let mut custom_error = String::from("Property must be of type `int`");
                let msg = Self::get_error_message(prefix).unwrap_or_default();
                custom_error.push_str(&msg);
                Err(Error::new(
                    ErrorKind::Other,
                    self.context.print_with_context(&custom_error),
                ))
            }
        }
    }

    fn read_u8(&mut self) -> Result<u8> {
        let value = self.read_u64().unwrap_or_default();
        if (value <= u8::MAX as u64) && (value >= u8::MIN as u64) {
            return Ok(value as u8);
        }
        let custom_error = format!(
            "unsigned integer overflow: value = {}; bits = 8",
            value.to_string()
        );
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_u16(&mut self) -> Result<u16> {
        let value = self.read_u64().unwrap_or_default();
        if (value <= u16::MAX as u64) && (value >= u16::MIN as u64) {
            return Ok(value as u16);
        }
        let custom_error = format!(
            "unsigned integer overflow: value = {}; bits = 16",
            value.to_string()
        );
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_u32(&mut self) -> Result<u32> {
        let value = self.read_u64().unwrap_or_default();
        if (value <= u32::MAX as u64) && (value >= u32::MIN as u64) {
            return Ok(value as u32);
        }
        let custom_error = format!(
            "unsigned integer overflow: value = {}; bits = 32",
            value.to_string()
        );
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_u64(&mut self) -> Result<u64> {
        let prefix = self.view.get_u8().unwrap_or_default();
        if Format::is_fixed_int(prefix) {
            return Ok(prefix as u64);
        } else if Format::is_negative_fixed_int(prefix) {
            let custom_error = format!(
                "unsigned integer cannot be negative: prefix = {}",
                prefix.to_string()
            );
            return Err(Error::new(ErrorKind::Other, custom_error));
        }
        match prefix {
            Format::UINT8 => Ok(self.view.get_u8().unwrap_or_default() as u64),
            Format::UINT16 => Ok(self.view.get_u16().unwrap_or_default() as u64),
            Format::UINT32 => Ok(self.view.get_u32().unwrap_or_default() as u64),
            Format::UINT64 => Ok(self.view.get_u64().unwrap_or_default()),
            _ => {
                let mut custom_error = String::from("Property must be of type `uint`");
                let msg = Self::get_error_message(prefix).unwrap_or_default();
                custom_error.push_str(&msg);
                Err(Error::new(
                    ErrorKind::Other,
                    self.context.print_with_context(&custom_error),
                ))
            }
        }
    }

    fn read_f32(&mut self) -> Result<f32> {
        let prefix = self.view.get_u8().unwrap_or_default();
        if Format::is_float_32(prefix) {
            return Ok(self.view.get_f32().unwrap_or_default());
        }
        let mut custom_error = String::from("Property must be of type `float32`");
        let msg = Self::get_error_message(prefix).unwrap_or_default();
        custom_error.push_str(&msg);
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_f64(&mut self) -> Result<f64> {
        let prefix = self.view.get_u8().unwrap_or_default();
        if Format::is_float_64(prefix) {
            return Ok(self.view.get_f64().unwrap_or_default());
        }
        let mut custom_error = String::from("Property must be of type `float64`");
        let msg = Self::get_error_message(prefix).unwrap_or_default();
        custom_error.push_str(&msg);
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_string_length(&mut self) -> Result<u32> {
        let lead_byte = self.view.get_u8().unwrap_or_default();
        if Format::is_fixed_string(lead_byte) {
            return Ok((lead_byte & 0x1f) as u32);
        }
        if Format::is_fixed_array(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        }
        match lead_byte {
            Format::STR8 => Ok(self.view.get_u8().unwrap_or_default() as u32),
            Format::STR16 => Ok(self.view.get_u16().unwrap_or_default() as u32),
            Format::STR32 => Ok(self.view.get_u32().unwrap_or_default()),
            _ => {
                let mut custom_error = String::from("Property must be of type `string`");
                let msg = Self::get_error_message(lead_byte).unwrap_or_default();
                custom_error.push_str(&msg);
                Err(Error::new(
                    ErrorKind::Other,
                    self.context.print_with_context(&custom_error),
                ))
            }
        }
    }

    fn read_string(&mut self) -> Result<String> {
        let str_len = self.read_string_length().unwrap_or_default();
        let str_bytes = self.view.get_bytes(str_len as i32).unwrap_or_default();
        Ok(String::from_utf8(str_bytes).unwrap_or_default())
    }

    fn read_bytes_length(&mut self) -> Result<u32> {
        if self.is_next_nil() {
            return Ok(0);
        }
        let lead_byte = self.view.get_u8().unwrap_or_default();
        if Format::is_fixed_string(lead_byte) {
            return Ok((lead_byte & 0x1f) as u32);
        }
        if Format::is_fixed_array(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        }
        match lead_byte {
            Format::STR8 => Ok(self.view.get_u8().unwrap_or_default() as u32),
            Format::STR16 => Ok(self.view.get_u16().unwrap_or_default() as u32),
            Format::STR32 => Ok(self.view.get_u32().unwrap_or_default()),
            _ => {
                let mut custom_error = String::from("Property must be of type `bytes`");
                let msg = Self::get_error_message(lead_byte).unwrap_or_default();
                custom_error.push_str(&msg);
                Err(Error::new(
                    ErrorKind::Other,
                    self.context.print_with_context(&custom_error),
                ))
            }
        }
    }

    fn read_bytes(&mut self) -> Result<Vec<u8>> {
        let array_length = self.read_bytes_length().unwrap_or_default();
        Ok(self.view.get_bytes(array_length as i32).unwrap_or_default())
    }

    fn read_bigint(&mut self) -> Result<BigInt> {
        let s = self.read_string().unwrap_or_default();
        Ok(BigInt::from_str(&s).unwrap_or_default())
    }

    fn read_array_length(&mut self) -> Result<u32> {
        let lead_byte = self.view.get_u8().unwrap_or_default();
        if Format::is_fixed_array(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        } else if lead_byte == Format::ARRAY16 {
            let r = self.view.get_u16().unwrap_or_default();
            return Ok(r as u32);
        } else if lead_byte == Format::ARRAY32 {
            return Ok(self.view.get_u32().unwrap_or_default());
        } else if lead_byte == Format::NIL {
            return Ok(0);
        }
        let mut custom_error = String::from("Property must be of type `array`");
        let msg = Self::get_error_message(lead_byte).unwrap_or_default();
        custom_error.push_str(&msg);
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_array<T>(&mut self, reader: fn() -> T) -> Result<Vec<T>> {
        let size = self.read_array_length().unwrap_or_default();
        let mut array: Vec<T> = vec![];
        for i in 0..size {
            self.context.push("array[", i.to_string().as_str(), "]");
            let item = reader();
            array.push(item);
            let _ = self.context.pop();
        }
        Ok(array)
    }

    fn read_map_length(&mut self) -> Result<u32> {
        let lead_byte = self.view.get_u8().unwrap_or_default();
        if Format::is_fixed_map(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        } else if lead_byte == Format::MAP16 {
            return Ok((self.view.get_u16().unwrap_or_default()) as u32);
        } else if lead_byte == Format::MAP32 {
            return Ok(self.view.get_u32().unwrap_or_default());
        }
        let mut custom_error = String::from("Property must be of type `map`");
        let msg = Self::get_error_message(lead_byte).unwrap_or_default();
        custom_error.push_str(&msg);
        Err(Error::new(
            ErrorKind::Other,
            self.context.print_with_context(&custom_error),
        ))
    }

    fn read_map<K: Eq + Hash, V>(&mut self, key_fn: fn() -> K, val_fn: fn() -> V) -> HashMap<K, V> {
        let size = self.read_map_length().unwrap_or_default();
        let mut map: HashMap<K, V> = HashMap::new();
        for i in 0..size {
            self.context.push("map[", i.to_string().as_str(), "]");
            let key = key_fn();
            let value = val_fn();
            map.insert(key, value);
            let _ = self.context.pop();
        }
        map
    }

    fn read_nullable_bool(&mut self) -> Option<bool> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_bool().unwrap_or_default())
    }

    fn read_nullable_i8(&mut self) -> Option<i8> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_i8().unwrap_or_default())
    }

    fn read_nullable_i16(&mut self) -> Option<i16> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_i16().unwrap_or_default())
    }

    fn read_nullable_i32(&mut self) -> Option<i32> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_i32().unwrap_or_default())
    }

    fn read_nullable_i64(&mut self) -> Option<i64> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_i64().unwrap_or_default())
    }

    fn read_nullable_u8(&mut self) -> Option<u8> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_u8().unwrap_or_default())
    }

    fn read_nullable_u16(&mut self) -> Option<u16> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_u16().unwrap_or_default())
    }

    fn read_nullable_u32(&mut self) -> Option<u32> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_u32().unwrap_or_default())
    }

    fn read_nullable_u64(&mut self) -> Option<u64> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_u64().unwrap_or_default())
    }

    fn read_nullable_f32(&mut self) -> Option<f32> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_f32().unwrap_or_default())
    }

    fn read_nullable_f64(&mut self) -> Option<f64> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_f64().unwrap_or_default())
    }

    fn read_nullable_string(&mut self) -> Option<String> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_string().unwrap_or_default())
    }

    fn read_nullable_bytes(&mut self) -> Option<Vec<u8>> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_bytes().unwrap_or_default())
    }

    fn read_nullable_bigint(&mut self) -> Option<BigInt> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_bigint().unwrap_or_default())
    }

    fn read_nullable_array<T>(&mut self, reader: fn() -> T) -> Option<Vec<T>> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_array(reader).unwrap_or_default())
    }

    fn read_nullable_map<K: Eq + Hash, V>(
        &mut self,
        key_fn: fn() -> K,
        val_fn: fn() -> V,
    ) -> Option<HashMap<K, V>> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_map(key_fn, val_fn))
    }

    fn is_next_nil(&mut self) -> bool {
        let format = self.view.peek_u8().unwrap_or_default();
        if format == Format::NIL {
            let _ = self.view.discard(1);
            return true;
        }
        false
    }

    fn is_next_string(&mut self) -> bool {
        let format = self.view.peek_u8().unwrap_or_default();
        return Format::is_fixed_string(format)
            || format == Format::STR8
            || format == Format::STR16
            || format == Format::STR32;
    }

    fn context(&self) -> &Context {
        &self.context
    }
}
