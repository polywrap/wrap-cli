use super::{Context, DataView, Format, Read};
use crate::{BigInt, JSON};
use core::hash::Hash;
use std::{collections::BTreeMap, str::FromStr};

#[derive(Clone, Debug, Default)]
pub struct ReadDecoder {
    context: Context,
    view: DataView,
}

impl ReadDecoder {
    pub fn new(buf: &[u8], context: Context) -> Self {
        Self {
            context: context.clone(),
            view: DataView::new(buf, context, 0).expect("Failed to create new data view"),
        }
    }

    #[allow(dead_code)]
    fn skip(&mut self) {
        // get_size handles discarding `msgpack header` info
        let mut num_of_objects_to_discard = self.get_size().unwrap();
        while num_of_objects_to_discard > 0 {
            self.get_size().expect("Failed to get size"); // discard next object
            num_of_objects_to_discard -= 1;
        }
    }

    fn get_size(&mut self) -> Result<i32, String> {
        let lead_byte = self.view.get_u8(); // will discard one
        let mut objects_to_discard: i32 = 0;
        // handle for fixed values
        if Format::is_negative_fixed_int(lead_byte) || Format::is_fixed_int(lead_byte) {
            // noop, will just discard the leadbyte
            self.view.discard(lead_byte as usize);
        } else if Format::is_fixed_string(lead_byte) {
            let str_len = lead_byte & 0x1f;
            self.view.discard(str_len as usize);
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
                    let length = self.view.get_u8();
                    self.view.discard(length as usize);
                }
                Format::BIN16 => {
                    let length = self.view.get_u16();
                    self.view.discard(length as usize);
                }
                Format::BIN32 => {
                    let length = self.view.get_u32();
                    self.view.discard(length as usize);
                }
                Format::FLOAT32 => {
                    self.view.discard(4);
                }
                Format::FLOAT64 => {
                    self.view.discard(8);
                }
                Format::UINT8 => {
                    self.view.discard(1);
                }
                Format::UINT16 => {
                    self.view.discard(2);
                }
                Format::UINT32 => {
                    self.view.discard(4);
                }
                Format::UINT64 => {
                    self.view.discard(8);
                }
                Format::INT8 => {
                    self.view.discard(1);
                }
                Format::INT16 => {
                    self.view.discard(2);
                }
                Format::INT32 => {
                    self.view.discard(4);
                }
                Format::INT64 => {
                    self.view.discard(8);
                }
                Format::FIXEXT1 => {
                    self.view.discard(2);
                }
                Format::FIXEXT2 => {
                    self.view.discard(3);
                }
                Format::FIXEXT4 => {
                    self.view.discard(5);
                }
                Format::FIXEXT8 => {
                    self.view.discard(9);
                }
                Format::FIXEXT16 => {
                    self.view.discard(17);
                }
                Format::STR8 => {
                    let length = self.view.get_u8();
                    self.view.discard(length as usize);
                }
                Format::STR16 => {
                    let length = self.view.get_u16();
                    self.view.discard(length as usize);
                }
                Format::STR32 => {
                    let length = self.view.get_u32();
                    self.view.discard(length as usize);
                }
                Format::ARRAY16 => {
                    objects_to_discard = self.view.get_u16() as i32;
                }
                Format::ARRAY32 => {
                    objects_to_discard = self.view.get_u32() as i32;
                }
                Format::MAP16 => {
                    objects_to_discard = 2 * (self.view.get_u16() as i32);
                }
                Format::MAP32 => {
                    objects_to_discard = 2 * (self.view.get_u32() as i32);
                }
                _ => {
                    return Err([
                        "invalid prefix, bad encoding for val: ",
                        &lead_byte.to_string(),
                    ]
                    .concat());
                }
            }
        }
        Ok(objects_to_discard)
    }

    fn get_error_message(lead_byte: u8) -> Result<&'static str, String> {
        if Format::is_negative_fixed_int(lead_byte) || Format::is_fixed_int(lead_byte) {
            Ok("Found `int`")
        } else if Format::is_fixed_string(lead_byte) {
            Ok("Found `string`")
        } else if Format::is_fixed_array(lead_byte) {
            Ok("Found `array`")
        } else if Format::is_fixed_map(lead_byte) {
            Ok("Found `map`")
        } else {
            match lead_byte {
                Format::NIL => Ok("Found `nil`"),
                Format::TRUE => Ok("Found `bool`"),
                Format::FALSE => Ok("Found `bool`"),
                Format::BIN8 => Ok("Found `BIN8`"),
                Format::BIN16 => Ok("Found `BIN16`"),
                Format::BIN32 => Ok("Found `BIN32`"),
                Format::FLOAT32 => Ok("Found `float32`"),
                Format::FLOAT64 => Ok("Found `float64`"),
                Format::UINT8 => Ok("Found `uint8`"),
                Format::UINT16 => Ok("Found `uint16`"),
                Format::UINT32 => Ok("Found `uint32`"),
                Format::UINT64 => Ok("Found `uint64`"),
                Format::INT8 => Ok("Found `int8`"),
                Format::INT16 => Ok("Found `int16`"),
                Format::INT32 => Ok("Found `int32`"),
                Format::INT64 => Ok("Found `int64`"),
                Format::FIXEXT1 => Ok("Found `FIXEXT1`"),
                Format::FIXEXT2 => Ok("Found `FIXEXT2`"),
                Format::FIXEXT4 => Ok("Found `FIXEXT4`"),
                Format::FIXEXT8 => Ok("Found `FIXEXT8`"),
                Format::FIXEXT16 => Ok("Found `FIXEXT16`"),
                Format::STR8 => Ok("Found `string`"),
                Format::STR16 => Ok("Found `string`"),
                Format::STR32 => Ok("Found `string`"),
                Format::ARRAY16 => Ok("Found `array`"),
                Format::ARRAY32 => Ok("Found `array`"),
                Format::MAP16 => Ok("Found `map`"),
                Format::MAP32 => Ok("Found `map`"),
                _ => Err([
                    "invalid prefix, bad encoding for val: {}",
                    &lead_byte.to_string(),
                ]
                .concat()),
            }
        }
    }

    fn read_i64(&mut self) -> Result<i64, String> {
        let prefix = self.view.get_u8();

        if Format::is_fixed_int(prefix) {
            return Ok(prefix as i64);
        }
        if Format::is_negative_fixed_int(prefix) {
            return Ok((prefix as i8) as i64);
        }
        match prefix {
            Format::INT8 => Ok(self.view.get_i8() as i64),
            Format::INT16 => Ok(self.view.get_i16() as i64),
            Format::INT32 => Ok(self.view.get_i32() as i64),
            Format::INT64 => Ok(self.view.get_i64()),
            Format::UINT8 => Ok(self.view.get_u8() as i64),
            Format::UINT16 => Ok(self.view.get_u16() as i64),
            Format::UINT32 => Ok(self.view.get_u32() as i64),
            Format::UINT64 => {
                let value = self.view.get_u64();
                if value <= i64::MAX as u64 {
                    Ok(value as i64)
                } else {
                    Err(self.context.print_with_context(
                        &[
                            "Integer overflow: value = ",
                            &value.to_string(),
                            "; bits = 64",
                        ]
                        .concat(),
                    ))
                }
            }
            _ => Err(self.context.print_with_context(
                &[
                    "Property must be of type `int`",
                    Self::get_error_message(prefix)?,
                ]
                .concat(),
            )),
        }
    }

    fn read_u64(&mut self) -> Result<u64, String> {
        let prefix = self.view.get_u8();
        if Format::is_fixed_int(prefix) {
            return Ok(prefix as u64);
        } else if Format::is_negative_fixed_int(prefix) {
            return Err([
                "unsigned integer cannot be negative: prefix = ",
                &prefix.to_string(),
            ]
            .concat());
        }
        match prefix {
            Format::UINT8 => Ok(self.view.get_u8() as u64),
            Format::UINT16 => Ok(self.view.get_u16() as u64),
            Format::UINT32 => Ok(self.view.get_u32() as u64),
            Format::UINT64 => Ok(self.view.get_u64()),
            Format::INT8 => {
                let int8 = self.view.get_i8();
                if int8 >= 0 {
                    Ok(int8 as u64)
                } else {
                    return Err(self.context.print_with_context(
                        &[
                            "Unsigned integer cannot be negative. ",
                            Self::get_error_message(prefix)?,
                        ]
                        .concat(),
                    ));
                }
            }
            Format::INT16 => {
                let int16 = self.view.get_i16();
                if int16 >= 0 {
                    Ok(int16 as u64)
                } else {
                    return Err(self.context.print_with_context(
                        &[
                            "Unsigned integer cannot be negative. ",
                            Self::get_error_message(prefix)?,
                        ]
                        .concat(),
                    ));
                }
            }
            Format::INT32 => {
                let int32 = self.view.get_i32();
                if int32 >= 0 {
                    Ok(int32 as u64)
                } else {
                    return Err(self.context.print_with_context(
                        &[
                            "Unsigned integer cannot be negative. ",
                            Self::get_error_message(prefix)?,
                        ]
                        .concat(),
                    ));
                }
            }
            Format::INT64 => {
                let int64 = self.view.get_i64();
                if int64 >= 0 {
                    Ok(int64 as u64)
                } else {
                    return Err(self.context.print_with_context(
                        &[
                            "Unsigned integer cannot be negative. ",
                            Self::get_error_message(prefix)?,
                        ]
                        .concat(),
                    ));
                }
            }
            _ => Err(self.context.print_with_context(
                &[
                    "Property must be of type `uint`",
                    Self::get_error_message(prefix)?,
                ]
                .concat(),
            )),
        }
    }
}

impl Read for ReadDecoder {
    fn read_bool(&mut self) -> Result<bool, String> {
        let value = self.view.get_u8();
        if value == Format::TRUE {
            return Ok(true);
        } else if value == Format::FALSE {
            return Ok(false);
        }
        Err(self.context.print_with_context(
            &[
                "Property must be of type `bool`",
                Self::get_error_message(value)?,
            ]
            .concat(),
        ))
    }

    fn read_i8(&mut self) -> Result<i8, String> {
        let value = self.read_i64()?;
        if (value <= i8::MAX as i64) && (value >= i8::MIN as i64) {
            return Ok(value as i8);
        }
        Err(self.context.print_with_context(
            &["integer overflow: value = ", &value.to_string(), "bits = 8"].concat(),
        ))
    }

    fn read_i16(&mut self) -> Result<i16, String> {
        let value = self.read_i64()?;
        if (value <= i16::MAX as i64) && (value >= i16::MIN as i64) {
            return Ok(value as i16);
        }
        Err(self.context.print_with_context(
            &[
                "integer overflow: value = ",
                &value.to_string(),
                "bits = 16",
            ]
            .concat(),
        ))
    }

    fn read_i32(&mut self) -> Result<i32, String> {
        let value = self.read_i64()?;
        if (value <= i32::MAX as i64) && (value >= i32::MIN as i64) {
            return Ok(value as i32);
        }
        Err(self.context.print_with_context(
            &[
                "integer overflow: value = ",
                &value.to_string(),
                "bits = 32",
            ]
            .concat(),
        ))
    }

    fn read_u8(&mut self) -> Result<u8, String> {
        let value = self.read_u64()?;
        if (value <= u8::MAX as u64) && (value >= u8::MIN as u64) {
            return Ok(value as u8);
        }
        Err(self.context.print_with_context(
            &[
                "unsigned integer overflow: value = ",
                &value.to_string(),
                "bits = 8",
            ]
            .concat(),
        ))
    }

    fn read_u16(&mut self) -> Result<u16, String> {
        let value = self.read_u64()?;
        if (value <= u16::MAX as u64) && (value >= u16::MIN as u64) {
            return Ok(value as u16);
        }
        Err(self.context.print_with_context(
            &[
                "unsigned integer overflow: value = ",
                &value.to_string(),
                "bits = 16",
            ]
            .concat(),
        ))
    }

    fn read_u32(&mut self) -> Result<u32, String> {
        let value = self.read_u64()?;
        if (value <= u32::MAX as u64) && (value >= u32::MIN as u64) {
            return Ok(value as u32);
        }
        Err(self.context.print_with_context(
            &[
                "unsigned integer overflow: value = ",
                &value.to_string(),
                "bits = 32",
            ]
            .concat(),
        ))
    }

    fn read_f32(&mut self) -> Result<f32, String> {
        let prefix = self.view.get_u8();
        if Format::is_float_32(prefix) {
            return Ok(self.view.get_f32());
        }
        Err(self.context.print_with_context(
            &[
                "Property must be of type `float32`",
                Self::get_error_message(prefix)?,
            ]
            .concat(),
        ))
    }

    fn read_f64(&mut self) -> Result<f64, String> {
        let prefix = self.view.get_u8();
        if Format::is_float_64(prefix) {
            return Ok(self.view.get_f64());
        }
        Err(self.context.print_with_context(
            &[
                "Property must be of type `float64`",
                Self::get_error_message(prefix)?,
            ]
            .concat(),
        ))
    }

    fn read_string_length(&mut self) -> Result<u32, String> {
        if self.is_next_nil() {
            return Ok(0);
        }
        let lead_byte = self.view.get_u8();
        if Format::is_fixed_string(lead_byte) {
            return Ok((lead_byte & 0x1f) as u32);
        }
        if Format::is_fixed_array(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        }
        match lead_byte {
            Format::STR8 => Ok(self.view.get_u8() as u32),
            Format::STR16 => Ok(self.view.get_u16() as u32),
            Format::STR32 => Ok(self.view.get_u32()),
            _ => Err(self.context.print_with_context(
                &[
                    "Property must be of type `string`",
                    Self::get_error_message(lead_byte)?,
                ]
                .concat(),
            )),
        }
    }

    fn read_string(&mut self) -> Result<String, String> {
        let str_len = self.read_string_length()?;
        let str_bytes = self.view.get_bytes(str_len as usize);
        Ok(String::from_utf8(str_bytes).unwrap())
    }

    fn read_bytes_length(&mut self) -> Result<u32, String> {
        if self.is_next_nil() {
            return Ok(0);
        }
        let lead_byte = self.view.get_u8();
        if Format::is_fixed_string(lead_byte) {
            return Ok((lead_byte & 0x1f) as u32);
        }
        if Format::is_fixed_array(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        }
        match lead_byte {
            Format::STR8 => Ok(self.view.get_u8() as u32),
            Format::STR16 => Ok(self.view.get_u16() as u32),
            Format::STR32 => Ok(self.view.get_u32()),
            _ => Err(self.context.print_with_context(
                &[
                    "Property must be of type `bytes`",
                    Self::get_error_message(lead_byte)?,
                ]
                .concat(),
            )),
        }
    }

    fn read_bytes(&mut self) -> Result<Vec<u8>, String> {
        let res = self.read_bytes_length();
        match res {
            Ok(len) => Ok(self.view.get_bytes(len as usize)),
            Err(e) => Err(e),
        }
    }

    fn read_bigint(&mut self) -> Result<BigInt, String> {
        let res = self.read_string();
        match res {
            Ok(v) => Ok(BigInt::from_str(&v).unwrap()),
            Err(e) => Err(e),
        }
    }

    fn read_json(&mut self) -> Result<JSON::Value, String> {
        let res = self.read_string();
        match res {
            Ok(v) => Ok(JSON::to_value(v).unwrap()),
            Err(e) => Err(e),
        }
    }

    fn read_array_length(&mut self) -> Result<u32, String> {
        if self.is_next_nil() {
            return Ok(0);
        }
        let lead_byte = self.view.get_u8();
        if Format::is_fixed_array(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        } else if lead_byte == Format::ARRAY16 {
            return Ok(self.view.get_u16() as u32);
        } else if lead_byte == Format::ARRAY32 {
            return Ok(self.view.get_u32());
        } else if lead_byte == Format::NIL {
            return Ok(0);
        }
        Err(self.context.print_with_context(
            &[
                "Property must be of type `array`",
                Self::get_error_message(lead_byte)?,
            ]
            .concat(),
        ))
    }

    fn read_array<T>(&mut self, mut reader: impl FnMut(&mut Self) -> T) -> Result<Vec<T>, String> {
        let size = self.read_array_length()?;
        let mut array: Vec<T> = vec![];
        for i in 0..size {
            self.context.push("array[", &i.to_string(), "]");
            let item = reader(self);
            array.push(item);
            self.context.pop();
        }
        Ok(array)
    }

    fn read_map_length(&mut self) -> Result<u32, String> {
        if self.is_next_nil() {
            return Ok(0);
        }
        let lead_byte = self.view.get_u8();
        if Format::is_fixed_map(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        }
        match lead_byte {
            Format::MAP16 => Ok((self.view.get_u16()) as u32),
            Format::MAP32 => Ok(self.view.get_u32()),
            Format::NIL => Ok(0),
            _ => Err(self.context.print_with_context(
                &[
                    "Property must be of type `map`",
                    Self::get_error_message(lead_byte)?,
                ]
                .concat(),
            )),
        }
    }

    fn read_map<K, V>(
        &mut self,
        mut key_fn: impl FnMut(&mut Self) -> K,
        mut val_fn: impl FnMut(&mut Self) -> V,
    ) -> Result<BTreeMap<K, V>, String>
    where
        K: Eq + Hash + Ord,
    {
        let size = self.read_map_length()?;
        let mut map: BTreeMap<K, V> = BTreeMap::new();
        for i in 0..size {
            self.context.push("map[", &i.to_string(), "]");
            let key = key_fn(self);
            let value = val_fn(self);
            map.insert(key, value);
            self.context.pop();
        }
        Ok(map)
    }

    fn read_nullable_bool(&mut self) -> Option<bool> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_bool().unwrap())
    }

    fn read_nullable_i8(&mut self) -> Option<i8> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_i8().unwrap())
    }

    fn read_nullable_i16(&mut self) -> Option<i16> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_i16().unwrap())
    }

    fn read_nullable_i32(&mut self) -> Option<i32> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_i32().unwrap())
    }

    fn read_nullable_u8(&mut self) -> Option<u8> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_u8().unwrap())
    }

    fn read_nullable_u16(&mut self) -> Option<u16> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_u16().unwrap())
    }

    fn read_nullable_u32(&mut self) -> Option<u32> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_u32().unwrap())
    }

    fn read_nullable_f32(&mut self) -> Option<f32> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_f32().unwrap())
    }

    fn read_nullable_f64(&mut self) -> Option<f64> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_f64().unwrap())
    }

    fn read_nullable_string(&mut self) -> Option<String> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_string().unwrap())
    }

    fn read_nullable_bytes(&mut self) -> Option<Vec<u8>> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_bytes().unwrap())
    }

    fn read_nullable_bigint(&mut self) -> Option<BigInt> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_bigint().unwrap())
    }

    fn read_nullable_json(&mut self) -> Option<JSON::Value> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_json().unwrap())
    }

    fn read_nullable_array<T>(&mut self, reader: impl FnMut(&mut Self) -> T) -> Option<Vec<T>> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_array(reader).unwrap())
    }

    fn read_nullable_map<K, V>(
        &mut self,
        key_fn: impl FnMut(&mut Self) -> K,
        val_fn: impl FnMut(&mut Self) -> V,
    ) -> Option<BTreeMap<K, V>>
    where
        K: Eq + Hash + Ord,
    {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_map(key_fn, val_fn).unwrap())
    }

    fn is_next_nil(&mut self) -> bool {
        let format = self.view.peek_u8();
        if format == Format::NIL {
            self.view.discard(1);
            return true;
        }
        false
    }

    fn is_next_string(&mut self) -> bool {
        let format = self.view.peek_u8();
        Format::is_fixed_string(format)
            || format == Format::STR8
            || format == Format::STR16
            || format == Format::STR32
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
