use super::{
    error::{get_error_message, DecodeError},
    DataView, Format, Read, ExtensionType,
};
use crate::{BigInt, BigNumber, JSON, Context};
use byteorder::{BigEndian, ReadBytesExt};
use core::hash::Hash;
use std::{collections::HashMap, io::Read as StdioRead, str::FromStr};

#[derive(Debug)]
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

    pub fn read_i64(&mut self) -> Result<i64, DecodeError> {
        let f = Format::get_format(self)?;
        let prefix = f.to_u8();
        if Format::is_positive_fixed_int(prefix) {
            Ok(prefix as i64)
        } else if Format::is_negative_fixed_int(prefix) {
          Ok((prefix as i8) as i64)
        } else {
            match f {
                Format::Int8 => Ok(ReadBytesExt::read_i8(self)? as i64),
                Format::Int16 => Ok(ReadBytesExt::read_i16::<BigEndian>(self)? as i64),
                Format::Int32 => Ok(ReadBytesExt::read_i32::<BigEndian>(self)? as i64),
                Format::Int64 => Ok(ReadBytesExt::read_i64::<BigEndian>(self)?),
                Format::Uint8 => Ok(ReadBytesExt::read_u8(self)? as i64),
                Format::Uint16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as i64),
                Format::Uint32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)? as i64),
                Format::Uint64 => {
                  let v = ReadBytesExt::read_u64::<BigEndian>(self)?;
                  
                  if v <= i64::MAX as u64 {
                    Ok(v as i64)
                  } else {
                    let formatted_err = format!("integer overflow: value = {}; bits = 64", v);
                    let err_msg = self.context().print_with_context(&formatted_err);
                    Err(DecodeError::IntRangeError(err_msg))
                  }
                },
                err_f => {
                    let formatted_err = format!(
                      "Property must be of type 'int'. {}",
                      get_error_message(err_f)
                    );
                    let err_msg = self.context().print_with_context(&formatted_err);
                    Err(DecodeError::WrongMsgPackFormat(err_msg))
                }
            }
        }
    }

    pub fn read_u64(&mut self) -> Result<u64, DecodeError> {
        let f = Format::get_format(self)?;
        let prefix = f.to_u8();
        if Format::is_positive_fixed_int(prefix) {
            return Ok(prefix as u64);
        } else if Format::is_negative_fixed_int(prefix) {
            let formatted_err = format!(
              "unsigned integer cannot be negative. {}",
              get_error_message(f)
            );
            let err_msg = self.context().print_with_context(&formatted_err);

            return Err(DecodeError::IntRangeError(err_msg))
        }

        match f {
            Format::Uint8 => Ok(ReadBytesExt::read_u8(self)? as u64),
            Format::Uint16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u64),
            Format::Uint32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)? as u64),
            Format::Uint64 => Ok(ReadBytesExt::read_u64::<BigEndian>(self)?),
            Format::Int8 => {
              let int8 = ReadBytesExt::read_i8(self)?;

              if int8 >= 0 {
                return Ok(int8 as u64)
              }

              let formatted_err = format!(
                "unsigned integer cannot be negative. {}",
                get_error_message(f)
              );
              let err_msg = self.context().print_with_context(&formatted_err);
  
              Err(DecodeError::IntRangeError(err_msg))
            },
            Format::Int16 => {
              let int16 = ReadBytesExt::read_i16::<BigEndian>(self)?;

              if int16 >= 0 {
                return Ok(int16 as u64)
              }

              let formatted_err = format!(
                "unsigned integer cannot be negative. {}",
                get_error_message(f)
              );
              let err_msg = self.context().print_with_context(&formatted_err);
  
              Err(DecodeError::IntRangeError(err_msg))
            },
            Format::Int32 => {
              let int32 = ReadBytesExt::read_i32::<BigEndian>(self)?;

              if int32 >= 0 {
                return Ok(int32 as u64)
              }

              let formatted_err = format!(
                "unsigned integer cannot be negative. {}",
                get_error_message(f)
              );
              let err_msg = self.context().print_with_context(&formatted_err);
  
              Err(DecodeError::IntRangeError(err_msg))
            },
            Format::Int64 => {
              let int64 = ReadBytesExt::read_i64::<BigEndian>(self)?;

              if int64 >= 0 {
                return Ok(int64 as u64)
              }

              let formatted_err = format!(
                "unsigned integer cannot be negative. {}",
                get_error_message(f)
              );
              let err_msg = self.context().print_with_context(&formatted_err);
  
              Err(DecodeError::IntRangeError(err_msg))
            },

            err_f => {
                let formatted_err = format!(
                  "Property must be of type 'uint'. {}",
                  get_error_message(err_f)
                );
                let err_msg = self.context().print_with_context(&formatted_err);
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
        
    }
}

impl StdioRead for ReadDecoder {
    fn read(&mut self, buf: &mut [u8]) -> std::io::Result<usize> {
        self.view.buffer.read(&mut *buf)
    }
}

impl Read for ReadDecoder {
    fn read_bool(&mut self) -> Result<bool, DecodeError> {
        match Format::get_format(self)? {
            Format::True => Ok(true),
            Format::False => Ok(false),
            err_f => {
                let formatted_err = format!(
                  "Property must be of type 'bool'. {}",
                  get_error_message(err_f)
                );
                let err_msg = self.context().print_with_context(&formatted_err);
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_i8(&mut self) -> Result<i8, DecodeError> {
        let v = self.read_i64()?;
        // check for integer overflow
        if v <= i8::MAX as i64 && v >= i8::MIN as i64 {
            Ok(v as i8)
        } else {
            let formatted_err = format!("integer overflow: value = {}; bits = 8", v);
            let err_msg = self.context().print_with_context(&formatted_err);
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_i16(&mut self) -> Result<i16, DecodeError> {
        let v = self.read_i64()?;
        // check for integer overflow
        if v <= i16::MAX as i64 && v >= i16::MIN as i64 {
            Ok(v as i16)
        } else {
            let formatted_err = format!("integer overflow: value = {}; bits = 16", v);
            let err_msg = self.context().print_with_context(&formatted_err);
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_i32(&mut self) -> Result<i32, DecodeError> {
        let v = self.read_i64()?;
        // check for integer overflow
        if v <= i32::MAX as i64 && v >= i32::MIN as i64 {
            Ok(v as i32)
        } else {
            let formatted_err = format!("integer overflow: value = {}; bits = 32", v);
            let err_msg = self.context().print_with_context(&formatted_err);
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_u8(&mut self) -> Result<u8, DecodeError> {
        let v = self.read_u64()?;
        // check for integer overflow
        if v <= u8::MAX as u64 && v >= u8::MIN as u64 {
            Ok(v as u8)
        } else {
            let formatted_err = format!("unsigned integer overflow: value = {}; bits = 8", v);
            let err_msg = self.context().print_with_context(&formatted_err);
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_u16(&mut self) -> Result<u16, DecodeError> {
        let v = self.read_u64()?;
        // check for integer overflow
        if v <= u16::MAX as u64 && v >= u16::MIN as u64 {
            Ok(v as u16)
        } else {
            let formatted_err = format!("unsigned integer overflow: value = {}; bits = 16", v);
            let err_msg = self.context().print_with_context(&formatted_err);
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_u32(&mut self) -> Result<u32, DecodeError> {
        let v = self.read_u64()?;
        // check for integer overflow
        if v <= u32::MAX as u64 && v >= u32::MIN as u64 {
            Ok(v as u32)
        } else {
            let formatted_err = format!("unsigned integer overflow: value = {}; bits = 32", v);
            let err_msg = self.context().print_with_context(&formatted_err);
            Err(DecodeError::IntRangeError(err_msg))
        }
    }

    fn read_f32(&mut self) -> Result<f32, DecodeError> {
        match Format::get_format(self)? {
            Format::Float32 => Ok(ReadBytesExt::read_f32::<BigEndian>(self)?),
            err_f => {
                let formatted_err = format!(
                  "Property must be of type 'float32'. {}",
                  get_error_message(err_f)
                );
                let err_msg = self.context().print_with_context(&formatted_err);
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_f64(&mut self) -> Result<f64, DecodeError> {
        match Format::get_format(self)? {
            Format::Float64 => Ok(ReadBytesExt::read_f64::<BigEndian>(self)?),
            Format::Float32 => Ok(ReadBytesExt::read_f32::<BigEndian>(self)? as f64),
            err_f => {
                let formatted_err = format!(
                  "Property must be of type 'float64'. {}",
                  get_error_message(err_f)
                );
                let err_msg = self.context().print_with_context(&formatted_err);
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_string_length(&mut self) -> Result<u32, DecodeError> {
        if self.is_next_nil()? {
          return Ok(0)
        }

        match Format::get_format(self)? {
            Format::FixStr(len) => Ok(len as u32),
            Format::FixArray(len) => Ok(len as u32),
            Format::Str8 => Ok(ReadBytesExt::read_u8(self)? as u32),
            Format::Str16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Str32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            Format::Nil => Ok(0),
            err_f => {
                let formatted_err = format!(
                  "Property must be of type 'string'. {}",
                  get_error_message(err_f)
                );
                let err_msg = self.context().print_with_context(&formatted_err);
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
        if self.is_next_nil()? {
          return Ok(0)
        }

        match Format::get_format(self)? {
            Format::FixArray(len) => Ok(len as u32),
            Format::Bin8 => Ok(ReadBytesExt::read_u8(self)? as u32),
            Format::Bin16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Bin32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            Format::Nil => Ok(0),
            err_f => {
                let formatted_err = format!(
                  "Property must be of type 'bytes'. {}",
                  get_error_message(err_f)
                );
                let err_msg = self.context().print_with_context(&formatted_err);
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

    fn read_bignumber(&mut self) -> Result<BigNumber, DecodeError> {
        let bignumber_str = self.read_string()?;
        BigNumber::from_str(&bignumber_str).map_err(|e| DecodeError::ParseBigNumberError(e.to_string()))
    }

    fn read_json(&mut self) -> Result<JSON::Value, DecodeError> {
        let json_str = self.read_string()?;
        JSON::from_str(&json_str).map_err(|e| DecodeError::JSONReadError(e.to_string()))
    }

    fn read_array_length(&mut self) -> Result<u32, DecodeError> {
        if self.is_next_nil()? {
          return Ok(0)
        }

        match Format::get_format(self)? {
            Format::FixArray(len) => Ok(len as u32),
            Format::Array16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Array32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            Format::Nil => Ok(0),
            err_f => {
                let formatted_err = format!(
                  "Property must be of type 'array'. {}",
                  get_error_message(err_f)
                );
                let err_msg = self.context().print_with_context(&formatted_err);
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_array<T>(
        &mut self,
        mut item_reader: impl FnMut(&mut Self) -> Result<T, DecodeError>,
    ) -> Result<Vec<T>, DecodeError> {
        let arr_len = self.read_array_length()?;
        let mut array: Vec<T> = vec![];
        for i in 0..arr_len {
            self.context.push("array[", &i.to_string(), "]");
            let item = item_reader(self)?;
            array.push(item);
            self.context.pop();
        }
        Ok(array)
    }

    fn read_map_length(&mut self) -> Result<u32, DecodeError> {
        if self.is_next_nil()? {
          return Ok(0)
        }

        match Format::get_format(self)? {
            Format::FixMap(len) => Ok(len as u32),
            Format::Map16 => Ok(ReadBytesExt::read_u16::<BigEndian>(self)? as u32),
            Format::Map32 => Ok(ReadBytesExt::read_u32::<BigEndian>(self)?),
            Format::Nil => Ok(0),
            err_f => {
                let formatted_err = format!(
                  "Property must be of type 'map'. {}",
                  get_error_message(err_f)
                );
                let err_msg = self.context().print_with_context(&formatted_err);
                Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        }
    }

    fn read_map<K, V>(
        &mut self,
        mut key_reader: impl FnMut(&mut Self) -> Result<K, DecodeError>,
        mut val_reader: impl FnMut(&mut Self) -> Result<V, DecodeError>,
    ) -> Result<HashMap<K, V>, DecodeError>
    where
        K: Eq + Hash + Ord,
    {
        let map_len = self.read_map_length()?;
        let mut map: HashMap<K, V> = HashMap::new();
        for i in 0..map_len {
            self.context.push("map[", &i.to_string(), "]");
            let key = key_reader(self)?;
            let value = val_reader(self)?;
            map.insert(key, value);
            self.context.pop();
        }
        Ok(map)
    }

    fn read_ext_generic_map<K, V>(
        &mut self,
        mut key_reader: impl FnMut(&mut Self) -> Result<K, DecodeError>,
        mut val_reader: impl FnMut(&mut Self) -> Result<V, DecodeError>,
    ) -> Result<HashMap<K, V>, DecodeError>
    where
        K: Eq + Hash + Ord,
    {
        let position = self.view.buffer.position();
        let format = Format::get_format(self)?;
        self.view.buffer.set_position(position);

        let _byte_length = match format {
            Format::FixMap(_) => {
                return self.read_map(key_reader, val_reader);
            },
            Format::Map16 => {
                return self.read_map(key_reader, val_reader);
            },
            Format::FixExt1 => 1,
            Format::FixExt2 => 2,
            Format::FixExt4 => 4,
            Format::FixExt8 => 8,
            Format::FixExt16 => 16,
            Format::Ext8 => ReadBytesExt::read_u8(self)? as u32,
            Format::Ext16 => {
                ReadBytesExt::read_u16::<BigEndian>(self)? as u32
            },
            Format::Ext32 => {
                ReadBytesExt::read_u32::<BigEndian>(self)?
            },
            err_f => {
                let formatted_err = format!(
                  "Property must be of type 'ext generic map'. {}",
                  get_error_message(err_f)
                );
                let err_msg = self.context().print_with_context(&formatted_err);
                return Err(DecodeError::WrongMsgPackFormat(err_msg))
            }
        };

        // Consume the leadByte
        ReadBytesExt::read_u8(self)?;

        // Get the extension type
        let ext_type = ReadBytesExt::read_u8(self)?;

        if ext_type != ExtensionType::GenericMap.to_u8() {
            let formatted_err = format!(
                "Extension must be of type 'ext generic map'. Found {}",
                ext_type
            );
            let err_msg = self.context().print_with_context(&formatted_err);
            return Err(DecodeError::WrongMsgPackFormat(err_msg))
        }

        self.read_map(key_reader, val_reader)
    }

    fn read_optional_bool(&mut self) -> Result<Option<bool>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match self.read_bool() {
                Ok(v) => Ok(Some(v)),
                Err(e) => Err(DecodeError::BooleanReadError(e.to_string())),
            }
        }
    }

    fn read_optional_i8(&mut self) -> Result<Option<i8>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match Read::read_i8(self) {
                Ok(v) => Ok(Some(v)),
                Err(e) => Err(DecodeError::IntReadError(e.to_string())),
            }
        }
    }

    fn read_optional_i16(&mut self) -> Result<Option<i16>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match Read::read_i16(self) {
                Ok(v) => Ok(Some(v)),
                Err(e) => Err(DecodeError::IntReadError(e.to_string())),
            }
        }
    }

    fn read_optional_i32(&mut self) -> Result<Option<i32>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match Read::read_i32(self) {
                Ok(v) => Ok(Some(v)),
                Err(e) => Err(DecodeError::IntReadError(e.to_string())),
            }
        }
    }

    fn read_optional_u8(&mut self) -> Result<Option<u8>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match Read::read_u8(self) {
                Ok(v) => Ok(Some(v)),
                Err(e) => Err(DecodeError::UintReadError(e.to_string())),
            }
        }
    }

    fn read_optional_u16(&mut self) -> Result<Option<u16>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match Read::read_u16(self) {
                Ok(v) => Ok(Some(v)),
                Err(e) => Err(DecodeError::UintReadError(e.to_string())),
            }
        }
    }

    fn read_optional_u32(&mut self) -> Result<Option<u32>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match Read::read_u32(self) {
                Ok(v) => Ok(Some(v)),
                Err(e) => Err(DecodeError::UintReadError(e.to_string())),
            }
        }
    }

    fn read_optional_f32(&mut self) -> Result<Option<f32>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match Read::read_f32(self) {
                Ok(v) => Ok(Some(v)),
                Err(e) => Err(DecodeError::FloatReadError(e.to_string())),
            }
        }
    }

    fn read_optional_f64(&mut self) -> Result<Option<f64>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match Read::read_f64(self) {
                Ok(v) => Ok(Some(v)),
                Err(e) => Err(DecodeError::FloatReadError(e.to_string())),
            }
        }
    }

    fn read_optional_string(&mut self) -> Result<Option<String>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match self.read_string() {
                Ok(s) => Ok(Some(s)),
                Err(e) => Err(DecodeError::StrReadError(e.to_string())),
            }
        }
    }

    fn read_optional_bytes(&mut self) -> Result<Option<Vec<u8>>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match self.read_bytes() {
                Ok(bytes) => Ok(Some(bytes)),
                Err(e) => Err(DecodeError::BytesReadError(e.to_string())),
            }
        }
    }

    fn read_optional_bigint(&mut self) -> Result<Option<BigInt>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match self.read_bigint() {
                Ok(bigint) => Ok(Some(bigint)),
                Err(e) => Err(DecodeError::BigIntReadError(e.to_string())),
            }
        }
    }

    fn read_optional_bignumber(&mut self) -> Result<Option<BigNumber>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match self.read_bignumber() {
                Ok(bignumber) => Ok(Some(bignumber)),
                Err(e) => Err(DecodeError::BigNumberReadError(e.to_string())),
            }
        }
    }

    fn read_optional_json(&mut self) -> Result<Option<JSON::Value>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match self.read_json() {
                Ok(value) => Ok(Some(value)),
                Err(e) => Err(DecodeError::JSONReadError(e.to_string())),
            }
        }
    }

    fn read_optional_array<T>(
        &mut self,
        item_reader: impl FnMut(&mut Self) -> Result<T, DecodeError>,
    ) -> Result<Option<Vec<T>>, DecodeError> {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match self.read_array(item_reader) {
                Ok(array) => Ok(Some(array)),
                Err(e) => Err(DecodeError::ArrayReadError(e.to_string())),
            }
        }
    }

    fn read_optional_map<K, V>(
        &mut self,
        key_reader: impl FnMut(&mut Self) -> Result<K, DecodeError>,
        val_reader: impl FnMut(&mut Self) -> Result<V, DecodeError>,
    ) -> Result<Option<HashMap<K, V>>, DecodeError>
    where
        K: Eq + Hash + Ord,
    {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match self.read_map(key_reader, val_reader) {
                Ok(map) => Ok(Some(map)),
                Err(e) => Err(DecodeError::MapReadError(e.to_string())),
            }
        }
    }

    fn read_optional_ext_generic_map<K, V>(
        &mut self,
        key_reader: impl FnMut(&mut Self) -> Result<K, DecodeError>,
        val_reader: impl FnMut(&mut Self) -> Result<V, DecodeError>,
    ) -> Result<Option<HashMap<K, V>>, DecodeError>
    where
        K: Eq + Hash + Ord,
    {
        if self.is_next_nil()? {
            Ok(None)
        } else {
            match self.read_ext_generic_map(key_reader, val_reader) {
                Ok(map) => Ok(Some(map)),
                Err(e) => Err(DecodeError::ExtGenericMapReadError(e.to_string())),
            }
        }
    }

    fn is_next_nil(&mut self) -> Result<bool, DecodeError> {
        let position = self.view.buffer.position();
        let format = Format::get_format(self)?;
        if format == Format::Nil {
            Ok(true)
        } else {
            self.view.buffer.set_position(position);
            Ok(false)
        }
    }

    fn is_next_string(&mut self) -> Result<bool, DecodeError> {
        let position = self.view.buffer.position();
        let format = Format::get_format(self)?;
        self.view.buffer.set_position(position);
        
        match format {
          Format::FixStr(_) | Format::Str8 | Format::Str16 | Format::Str32 => Ok(true),
          _ => Ok(false)
        }
    }

    fn context(&mut self) -> &mut Context {
        &mut self.context
    }
}
