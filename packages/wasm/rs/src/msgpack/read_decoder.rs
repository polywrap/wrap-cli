use super::{context::Context, data_view::DataView, format::Format, read::Read};
use num_bigint::BigInt;
use std::collections::HashMap;
use std::hash::Hash;
use std::str::FromStr;

#[derive(Clone, Debug, Default)]
pub struct ReadDecoder {
    context: Context,
    view: DataView,
}

impl ReadDecoder {
    #[allow(dead_code)]
    pub fn new(buf: &[u8], context: Context) -> Self {
        Self {
            context: context.clone(),
            view: DataView::new(buf, Some(context), None, None)
                .expect("Failed to create new data view"),
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
        let lead_byte = self.view.get_u8().unwrap(); // will discard one
        let mut objects_to_discard: i32 = 0;
        // handle for fixed values
        if Format::is_negative_fixed_int(lead_byte) || Format::is_fixed_int(lead_byte) {
            // noop, will just discard the leadbyte
            self.view
                .discard(lead_byte as i32)
                .expect("Failed to discard fixed int");
        } else if Format::is_fixed_string(lead_byte) {
            let str_len = lead_byte & 0x1f;
            self.view
                .discard(str_len as i32)
                .expect("Failed to discard fixed string");
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
                    let length = self.view.get_u8().unwrap();
                    self.view
                        .discard(length as i32)
                        .expect("Failed to discard BIN8");
                }
                Format::BIN16 => {
                    let length = self.view.get_u16().unwrap();
                    self.view
                        .discard(length as i32)
                        .expect("Failed to discard BIN16");
                }
                Format::BIN32 => {
                    let length = self.view.get_u32().unwrap();
                    self.view
                        .discard(length as i32)
                        .expect("Failed to discard BIN32");
                }
                Format::FLOAT32 => {
                    self.view.discard(4).expect("Failed to discard FLOAT32");
                }
                Format::FLOAT64 => {
                    self.view.discard(8).expect("Failed to discard FLOAT64");
                }
                Format::UINT8 => {
                    self.view.discard(1).expect("Failed to discard UINT8");
                }
                Format::UINT16 => {
                    self.view.discard(2).expect("Failed to discard UINT16");
                }
                Format::UINT32 => {
                    self.view.discard(4).expect("Failed to discard UINT32");
                }
                Format::UINT64 => {
                    self.view.discard(8).expect("Failed to discard UINT64");
                }
                Format::INT8 => {
                    self.view.discard(1).expect("Failed to discard INT8");
                }
                Format::INT16 => {
                    self.view.discard(2).expect("Failed to discard INT16");
                }
                Format::INT32 => {
                    self.view.discard(4).expect("Failed to discard INT32");
                }
                Format::INT64 => {
                    self.view.discard(8).expect("Failed to discard INT64");
                }
                Format::FIXEXT1 => {
                    self.view.discard(2).expect("Failed to discard FIXEXT1");
                }
                Format::FIXEXT2 => {
                    self.view.discard(3).expect("Failed to discard FIXEXT2");
                }
                Format::FIXEXT4 => {
                    self.view.discard(5).expect("Failed to discard FIXEXT4");
                }
                Format::FIXEXT8 => {
                    self.view.discard(9).expect("Failed to discard FIXEXT8");
                }
                Format::FIXEXT16 => {
                    self.view.discard(17).expect("Failed to discard FIXEXT16");
                }
                Format::STR8 => {
                    let length = self.view.get_u8().unwrap();
                    self.view
                        .discard(length as i32)
                        .expect("Failed to discard STR8");
                }
                Format::STR16 => {
                    let length = self.view.get_u16().unwrap();
                    self.view
                        .discard(length as i32)
                        .expect("Failed to discard STR16");
                }
                Format::STR32 => {
                    let length = self.view.get_u32().unwrap();
                    self.view
                        .discard(length as i32)
                        .expect("Failed to discard STR32");
                }
                Format::ARRAY16 => {
                    objects_to_discard = self.view.get_u16().unwrap() as i32;
                }
                Format::ARRAY32 => {
                    objects_to_discard = self.view.get_u32().unwrap() as i32;
                }
                Format::MAP16 => {
                    objects_to_discard = 2 * (self.view.get_u16().unwrap() as i32);
                }
                Format::MAP32 => {
                    objects_to_discard = 2 * (self.view.get_u32().unwrap() as i32);
                }
                _ => {
                    let custom_error = format!(
                        "invalid prefix, bad encoding for val: {}",
                        lead_byte.to_string()
                    );
                    return Err(custom_error);
                }
            }
        }

        Ok(objects_to_discard)
    }

    fn get_error_message(lead_byte: u8) -> Result<String, String> {
        if Format::is_negative_fixed_int(lead_byte) || Format::is_fixed_int(lead_byte) {
            Ok("Found `int`".to_string())
        } else if Format::is_fixed_string(lead_byte) {
            Ok("Found `string`".to_string())
        } else if Format::is_fixed_array(lead_byte) {
            Ok("Found `array`".to_string())
        } else if Format::is_fixed_map(lead_byte) {
            Ok("Found `map`".to_string())
        } else {
            match lead_byte {
                Format::NIL => Ok("Found `nil`".to_string()),
                Format::TRUE => Ok("Found `bool`".to_string()),
                Format::FALSE => Ok("Found `bool`".to_string()),
                Format::BIN8 => Ok("Found `BIN8`".to_string()),
                Format::BIN16 => Ok("Found `BIN16`".to_string()),
                Format::BIN32 => Ok("Found `BIN32`".to_string()),
                Format::FLOAT32 => Ok("Found `float32`".to_string()),
                Format::FLOAT64 => Ok("Found `float64`".to_string()),
                Format::UINT8 => Ok("Found `uint8`".to_string()),
                Format::UINT16 => Ok("Found `uint16`".to_string()),
                Format::UINT32 => Ok("Found `uint32`".to_string()),
                Format::UINT64 => Ok("Found `uint64`".to_string()),
                Format::INT8 => Ok("Found `int8`".to_string()),
                Format::INT16 => Ok("Found `int16`".to_string()),
                Format::INT32 => Ok("Found `int32`".to_string()),
                Format::INT64 => Ok("Found `int64`".to_string()),
                Format::FIXEXT1 => Ok("Found `FIXEXT1`".to_string()),
                Format::FIXEXT2 => Ok("Found `FIXEXT2`".to_string()),
                Format::FIXEXT4 => Ok("Found `FIXEXT4`".to_string()),
                Format::FIXEXT8 => Ok("Found `FIXEXT8`".to_string()),
                Format::FIXEXT16 => Ok("Found `FIXEXT16`".to_string()),
                Format::STR8 => Ok("Found `string`".to_string()),
                Format::STR16 => Ok("Found `string`".to_string()),
                Format::STR32 => Ok("Found `string`".to_string()),
                Format::ARRAY16 => Ok("Found `array`".to_string()),
                Format::ARRAY32 => Ok("Found `array`".to_string()),
                Format::MAP16 => Ok("Found `map`".to_string()),
                Format::MAP32 => Ok("Found `map`".to_string()),
                _ => {
                    let custom_error = format!(
                        "invalid prefix, bad encoding for val: {}",
                        lead_byte.to_string()
                    );
                    Err(custom_error)
                }
            }
        }
    }
}

impl Read for ReadDecoder {
    fn read_bool(&mut self) -> Result<bool, String> {
        let value = self.view.get_u8().unwrap();
        if value == Format::TRUE {
            return Ok(true);
        } else if value == Format::FALSE {
            return Ok(false);
        }
        let mut custom_error = String::new();
        custom_error.push_str("Property must be of type `bool`");
        let msg = Self::get_error_message(value).unwrap();
        custom_error.push_str(&msg);
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_i8(&mut self) -> Result<i8, String> {
        let value = self.read_i64().unwrap();
        if (value <= i8::MAX as i64) && (value >= i8::MIN as i64) {
            return Ok(value as i8);
        }
        let custom_error = format!("integer overflow: value = {}; bits = 8", value.to_string());
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_i16(&mut self) -> Result<i16, String> {
        let value = self.read_i64().unwrap();
        if (value <= i16::MAX as i64) && (value >= i16::MIN as i64) {
            return Ok(value as i16);
        }
        let custom_error = format!("integer overflow: value = {}; bits = 16", value.to_string());
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_i32(&mut self) -> Result<i32, String> {
        let value = self.read_i64().unwrap();
        if (value <= i32::MAX as i64) && (value >= i32::MIN as i64) {
            return Ok(value as i32);
        }
        let custom_error = format!("integer overflow: value = {}; bits = 32", value.to_string());
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_i64(&mut self) -> Result<i64, String> {
        let prefix = self.view.get_u8().unwrap();
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
                let msg = Self::get_error_message(prefix).unwrap();
                custom_error.push_str(&msg);
                Err(self.context.print_with_context(&custom_error))
            }
        }
    }

    fn read_u8(&mut self) -> Result<u8, String> {
        let value = self.read_u64().unwrap();
        if (value <= u8::MAX as u64) && (value >= u8::MIN as u64) {
            return Ok(value as u8);
        }
        let custom_error = format!(
            "unsigned integer overflow: value = {}; bits = 8",
            value.to_string()
        );
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_u16(&mut self) -> Result<u16, String> {
        let value = self.read_u64().unwrap();
        if (value <= u16::MAX as u64) && (value >= u16::MIN as u64) {
            return Ok(value as u16);
        }
        let custom_error = format!(
            "unsigned integer overflow: value = {}; bits = 16",
            value.to_string()
        );
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_u32(&mut self) -> Result<u32, String> {
        let value = self.read_u64().unwrap();
        if (value <= u32::MAX as u64) && (value >= u32::MIN as u64) {
            return Ok(value as u32);
        }
        let custom_error = format!(
            "unsigned integer overflow: value = {}; bits = 32",
            value.to_string()
        );
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_u64(&mut self) -> Result<u64, String> {
        let prefix = self.view.get_u8().unwrap();
        if Format::is_fixed_int(prefix) {
            return Ok(prefix as u64);
        } else if Format::is_negative_fixed_int(prefix) {
            let custom_error = format!(
                "unsigned integer cannot be negative: prefix = {}",
                prefix.to_string()
            );
            return Err(custom_error);
        }
        match prefix {
            Format::UINT8 => Ok(self.view.get_u8().unwrap() as u64),
            Format::UINT16 => Ok(self.view.get_u16().unwrap() as u64),
            Format::UINT32 => Ok(self.view.get_u32().unwrap() as u64),
            Format::UINT64 => Ok(self.view.get_u64().unwrap()),
            _ => {
                let mut custom_error = String::from("Property must be of type `uint`");
                let msg = Self::get_error_message(prefix).unwrap();
                custom_error.push_str(&msg);
                Err(self.context.print_with_context(&custom_error))
            }
        }
    }

    fn read_f32(&mut self) -> Result<f32, String> {
        let prefix = self.view.get_u8().unwrap();
        if Format::is_float_32(prefix) {
            return Ok(self.view.get_f32().unwrap());
        }
        let mut custom_error = String::from("Property must be of type `float32`");
        let msg = Self::get_error_message(prefix).unwrap();
        custom_error.push_str(&msg);
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_f64(&mut self) -> Result<f64, String> {
        let prefix = self.view.get_u8().unwrap();
        if Format::is_float_64(prefix) {
            return Ok(self.view.get_f64().unwrap());
        }
        let mut custom_error = String::from("Property must be of type `float64`");
        let msg = Self::get_error_message(prefix).unwrap();
        custom_error.push_str(&msg);
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_string_length(&mut self) -> Result<u32, String> {
        let lead_byte = self.view.get_u8().unwrap();
        if Format::is_fixed_string(lead_byte) {
            return Ok((lead_byte & 0x1f) as u32);
        }
        if Format::is_fixed_array(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        }
        match lead_byte {
            Format::STR8 => Ok(self.view.get_u8().unwrap() as u32),
            Format::STR16 => Ok(self.view.get_u16().unwrap() as u32),
            Format::STR32 => Ok(self.view.get_u32().unwrap()),
            _ => {
                let mut custom_error = String::from("Property must be of type `string`");
                let msg = Self::get_error_message(lead_byte).unwrap();
                custom_error.push_str(&msg);
                Err(self.context.print_with_context(&custom_error))
            }
        }
    }

    fn read_string(&mut self) -> Result<String, String> {
        let str_len = self.read_string_length().unwrap();
        let str_bytes = self.view.get_bytes(str_len as i32).unwrap();
        Ok(String::from_utf8(str_bytes).unwrap())
    }

    fn read_bytes_length(&mut self) -> Result<u32, String> {
        if self.is_next_nil() {
            return Ok(0);
        }
        let lead_byte = self.view.get_u8().unwrap();
        if Format::is_fixed_string(lead_byte) {
            return Ok((lead_byte & 0x1f) as u32);
        }
        if Format::is_fixed_array(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        }
        match lead_byte {
            Format::STR8 => Ok(self.view.get_u8().unwrap() as u32),
            Format::STR16 => Ok(self.view.get_u16().unwrap() as u32),
            Format::STR32 => Ok(self.view.get_u32().unwrap()),
            _ => {
                let mut custom_error = String::from("Property must be of type `bytes`");
                let msg = Self::get_error_message(lead_byte).unwrap();
                custom_error.push_str(&msg);
                Err(self.context.print_with_context(&custom_error))
            }
        }
    }

    fn read_bytes(&mut self) -> Result<Vec<u8>, String> {
        let array_length = self.read_bytes_length().unwrap();
        Ok(self.view.get_bytes(array_length as i32).unwrap())
    }

    fn read_bigint(&mut self) -> Result<BigInt, String> {
        let s = self.read_string().unwrap();
        Ok(BigInt::from_str(&s).unwrap())
    }

    fn read_array_length(&mut self) -> Result<u32, String> {
        let lead_byte = self.view.get_u8().unwrap();
        if Format::is_fixed_array(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        } else if lead_byte == Format::ARRAY16 {
            let r = self.view.get_u16().unwrap();
            return Ok(r as u32);
        } else if lead_byte == Format::ARRAY32 {
            return Ok(self.view.get_u32().unwrap());
        } else if lead_byte == Format::NIL {
            return Ok(0);
        }
        let mut custom_error = String::from("Property must be of type `array`");
        let msg = Self::get_error_message(lead_byte).unwrap();
        custom_error.push_str(&msg);
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_array<T>(&mut self, mut reader: impl FnMut(&mut Self) -> T) -> Result<Vec<T>, String> {
        let size = self.read_array_length().unwrap();
        let mut array: Vec<T> = vec![];
        for i in 0..size {
            self.context.push("array[", i.to_string().as_str(), "]");
            let item = reader(self);
            array.push(item);
            self.context.pop();
        }
        Ok(array)
    }

    fn read_map_length(&mut self) -> Result<u32, String> {
        let lead_byte = self.view.get_u8().unwrap();
        if Format::is_fixed_map(lead_byte) {
            return Ok((lead_byte & Format::FOUR_LEAST_SIG_BITS_IN_BYTE) as u32);
        } else if lead_byte == Format::MAP16 {
            return Ok((self.view.get_u16().unwrap()) as u32);
        } else if lead_byte == Format::MAP32 {
            return Ok(self.view.get_u32().unwrap());
        }
        let mut custom_error = String::from("Property must be of type `map`");
        let msg = Self::get_error_message(lead_byte).unwrap();
        custom_error.push_str(&msg);
        Err(self.context.print_with_context(&custom_error))
    }

    fn read_map<K: Eq + Hash, V>(
        &mut self,
        mut key_fn: impl FnMut(&mut Self) -> K,
        mut val_fn: impl FnMut(&mut Self) -> V,
    ) -> HashMap<K, V> {
        let size = self.read_map_length().unwrap();
        let mut map: HashMap<K, V> = HashMap::new();
        for i in 0..size {
            self.context.push("map[", i.to_string().as_str(), "]");
            let key = key_fn(self);
            let value = val_fn(self);
            map.insert(key, value);
            self.context.pop();
        }
        map
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

    fn read_nullable_i64(&mut self) -> Option<i64> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_i64().unwrap())
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

    fn read_nullable_u64(&mut self) -> Option<u64> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_u64().unwrap())
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

    fn read_nullable_array<T>(&mut self, reader: impl FnMut(&mut Self) -> T) -> Option<Vec<T>> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_array(reader).unwrap())
    }

    fn read_nullable_map<K: Eq + Hash, V>(
        &mut self,
        key_fn: impl FnMut(&mut Self) -> K,
        val_fn: impl FnMut(&mut Self) -> V,
    ) -> Option<HashMap<K, V>> {
        if self.is_next_nil() {
            return None;
        }
        Some(self.read_map(key_fn, val_fn))
    }

    fn is_next_nil(&mut self) -> bool {
        let format = self.view.peek_u8().unwrap();
        if format == Format::NIL {
            self.view.discard(1).expect("Failed to discard value");
            return true;
        }
        false
    }

    fn is_next_string(&mut self) -> bool {
        let format = self.view.peek_u8().unwrap();
        Format::is_fixed_string(format)
            || format == Format::STR8
            || format == Format::STR16
            || format == Format::STR32
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
