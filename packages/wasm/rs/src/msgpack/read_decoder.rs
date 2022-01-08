use super::error::DecodingError;
use super::{Context, DataView, Format, Read};
use crate::{BigInt, JSON};
use byteorder::{BigEndian, ReadBytesExt};
use core::hash::Hash;
use num_traits::cast::FromPrimitive;
use std::io::Read as IoRead;
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

    // #[allow(dead_code)]
    // fn skip(&mut self) {
    //     // get_size handles discarding `msgpack header` info
    //     if let Ok(mut num_of_objects_to_discard) = self.get_size() {
    //         while num_of_objects_to_discard > 0 {
    //             self.get_size().expect("Failed to get size"); // discard next object
    //             num_of_objects_to_discard -= 1;
    //         }
    //     }
    // }

    // fn get_size(&mut self) -> Result<i32, String> {
    //     let lead_byte = self.view.get_u8(); // will discard one
    //     let mut objects_to_discard: i32 = 0;
    //     // handle for fixed values
    //     if Format::is_negative_fixed_int(lead_byte) || Format::is_fixed_int(lead_byte) {
    //         // noop, will just discard the leadbyte
    //         self.view.discard(lead_byte as usize);
    //     } else if Format::is_fixed_string(lead_byte) {
    //         let str_len = lead_byte & 0x1f;
    //         self.view.discard(str_len as usize);
    //     } else if Format::is_fixed_array(lead_byte) {
    //         objects_to_discard =
    //             (lead_byte & Format::to_u8(&Format::FourLeastSigBitsInByte)) as i32;
    //     } else if Format::is_fixed_map(lead_byte) {
    //         objects_to_discard =
    //             2 * (lead_byte & Format::to_u8(&Format::FourLeastSigBitsInByte)) as i32;
    //     } else {
    //         match Format::from_u8(lead_byte) {
    //             Format::Nil => {}
    //             Format::True => {}
    //             Format::False => {}
    //             Format::Bin8 => {
    //                 let length = self.view.get_u8();
    //                 self.view.discard(length as usize);
    //             }
    //             Format::Bin16 => {
    //                 let length = self.view.get_u16();
    //                 self.view.discard(length as usize);
    //             }
    //             Format::Bin32 => {
    //                 let length = self.view.get_u32();
    //                 self.view.discard(length as usize);
    //             }
    //             Format::Float32 => {
    //                 self.view.discard(4);
    //             }
    //             Format::Float64 => {
    //                 self.view.discard(8);
    //             }
    //             Format::Uint8 => {
    //                 self.view.discard(1);
    //             }
    //             Format::Uint16 => {
    //                 self.view.discard(2);
    //             }
    //             Format::Uint32 => {
    //                 self.view.discard(4);
    //             }
    //             Format::Uint64 => {
    //                 self.view.discard(8);
    //             }
    //             Format::Int8 => {
    //                 self.view.discard(1);
    //             }
    //             Format::Int16 => {
    //                 self.view.discard(2);
    //             }
    //             Format::Int32 => {
    //                 self.view.discard(4);
    //             }
    //             Format::Int64 => {
    //                 self.view.discard(8);
    //             }
    //             Format::FixExt1 => {
    //                 self.view.discard(2);
    //             }
    //             Format::FixExt2 => {
    //                 self.view.discard(3);
    //             }
    //             Format::FixExt4 => {
    //                 self.view.discard(5);
    //             }
    //             Format::FixExt8 => {
    //                 self.view.discard(9);
    //             }
    //             Format::FixExt16 => {
    //                 self.view.discard(17);
    //             }
    //             Format::Str8 => {
    //                 let length = self.view.get_u8();
    //                 self.view.discard(length as usize);
    //             }
    //             Format::Str16 => {
    //                 let length = self.view.get_u16();
    //                 self.view.discard(length as usize);
    //             }
    //             Format::Str32 => {
    //                 let length = self.view.get_u32();
    //                 self.view.discard(length as usize);
    //             }
    //             Format::Array16 => {
    //                 objects_to_discard = self.view.get_u16() as i32;
    //             }
    //             Format::Array32 => {
    //                 objects_to_discard = self.view.get_u32() as i32;
    //             }
    //             Format::Map16 => {
    //                 objects_to_discard = 2 * (self.view.get_u16() as i32);
    //             }
    //             Format::Map32 => {
    //                 objects_to_discard = 2 * (self.view.get_u32() as i32);
    //             }
    //             _ => {
    //                 return Err([
    //                     "invalid prefix, bad encoding for val: ",
    //                     &lead_byte.to_string(),
    //                 ]
    //                 .concat())
    //             }
    //         }
    //     }
    //     Ok(objects_to_discard)
    // }

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
            match Format::from_u8(lead_byte) {
                Format::Nil => Ok("Found `nil`"),
                Format::True => Ok("Found `bool`"),
                Format::False => Ok("Found `bool`"),
                Format::Bin8 => Ok("Found `BIN8`"),
                Format::Bin16 => Ok("Found `BIN16`"),
                Format::Bin32 => Ok("Found `BIN32`"),
                Format::Float32 => Ok("Found `float32`"),
                Format::Float64 => Ok("Found `float64`"),
                Format::Uint8 => Ok("Found `uint8`"),
                Format::Uint16 => Ok("Found `uint16`"),
                Format::Uint32 => Ok("Found `uint32`"),
                Format::Uint64 => Ok("Found `uint64`"),
                Format::Int8 => Ok("Found `int8`"),
                Format::Int16 => Ok("Found `int16`"),
                Format::Int32 => Ok("Found `int32`"),
                Format::Int64 => Ok("Found `int64`"),
                Format::FixExt1 => Ok("Found `FIXEXT1`"),
                Format::FixExt2 => Ok("Found `FIXEXT2`"),
                Format::FixExt4 => Ok("Found `FIXEXT4`"),
                Format::FixExt8 => Ok("Found `FIXEXT8`"),
                Format::FixExt16 => Ok("Found `FIXEXT16`"),
                Format::Str8 => Ok("Found `string`"),
                Format::Str16 => Ok("Found `string`"),
                Format::Str32 => Ok("Found `string`"),
                Format::Array16 => Ok("Found `array`"),
                Format::Array32 => Ok("Found `array`"),
                Format::Map16 => Ok("Found `map`"),
                Format::Map32 => Ok("Found `map`"),
                _ => Err([
                    "invalid prefix, bad encoding for val: {}",
                    &lead_byte.to_string(),
                ]
                .concat()),
            }
        }
    }

    fn read_i64(&mut self) -> Result<i64, String> {
        todo!()
    }

    fn read_u64(&mut self) -> Result<u64, String> {
        todo!()
    }
}

impl Read for ReadDecoder {
    fn read_bool<R: IoRead>(&self, reader: &mut R) -> Result<bool, DecodingError> {
        todo!()
    }

    fn read_i8<R: IoRead>(&self, reader: &mut R) -> Result<i8, DecodingError> {
        todo!()
    }

    fn read_i16<R: IoRead>(&self, reader: &mut R) -> Result<i16, DecodingError> {
        todo!()
    }

    fn read_i32<R: IoRead>(&self, reader: &mut R) -> Result<i32, DecodingError> {
        todo!()
    }

    fn read_u8<R: IoRead>(&self, reader: &mut R) -> Result<u8, DecodingError> {
        todo!()
    }

    fn read_u16<R: IoRead>(&self, reader: &mut R) -> Result<u16, DecodingError> {
        todo!()
    }

    fn read_u32<R: IoRead>(&self, reader: &mut R) -> Result<u32, DecodingError> {
        todo!()
    }

    fn read_f32<R: IoRead>(&self, reader: &mut R) -> Result<f32, DecodingError> {
        todo!()
    }

    fn read_f64<R: IoRead>(&self, reader: &mut R) -> Result<f64, DecodingError> {
        todo!()
    }

    fn read_string_length<R: IoRead>(&self, reader: &mut R) -> Result<u32, DecodingError> {
        todo!()
    }

    fn read_string<R: IoRead>(&self, reader: &mut R) -> Result<String, DecodingError> {
        todo!()
    }

    fn read_bytes_length<R: IoRead>(&self, reader: &mut R) -> Result<u32, DecodingError> {
        todo!()
    }

    fn read_bytes<R: IoRead>(&self, reader: &mut R) -> Result<Vec<u8>, DecodingError> {
        todo!()
    }

    fn read_bigint<R: IoRead>(&self, reader: &mut R) -> Result<BigInt, DecodingError> {
        todo!()
    }

    fn read_json<R: IoRead>(&self, reader: &mut R) -> Result<JSON::Value, DecodingError> {
        todo!()
    }

    fn read_array_length<R: IoRead>(&self, reader: &mut R) -> Result<u32, DecodingError> {
        todo!()
    }

    fn read_array<R: IoRead, T>(
        &self,
        reader: impl FnMut(&mut R) -> T,
    ) -> Result<Vec<T>, DecodingError> {
        todo!()
    }

    fn read_map_length<R: IoRead>(&self, reader: &mut R) -> Result<u32, DecodingError> {
        todo!()
    }

    fn read_map<K, V, R: IoRead>(
        &self,
        reader: &mut R,
        key_fn: impl FnMut(&mut R) -> K,
        val_fn: impl FnMut(&mut R) -> V,
    ) -> Result<BTreeMap<K, V>, DecodingError>
    where
        K: Eq + Hash + Ord,
    {
        todo!()
    }

    fn read_nullable_bool<R: IoRead>(&self, reader: &mut R) -> Result<Option<bool>, DecodingError> {
        todo!()
    }

    fn read_nullable_i8<R: IoRead>(&self, reader: &mut R) -> Result<Option<i8>, DecodingError> {
        todo!()
    }

    fn read_nullable_i16<R: IoRead>(&self, reader: &mut R) -> Result<Option<i16>, DecodingError> {
        todo!()
    }

    fn read_nullable_i32<R: IoRead>(&self, reader: &mut R) -> Result<Option<i32>, DecodingError> {
        todo!()
    }

    fn read_nullable_u8<R: IoRead>(&self, reader: &mut R) -> Result<Option<u8>, DecodingError> {
        todo!()
    }

    fn read_nullable_u16<R: IoRead>(&self, reader: &mut R) -> Result<Option<u16>, DecodingError> {
        todo!()
    }

    fn read_nullable_u32<R: IoRead>(&self, reader: &mut R) -> Result<Option<u32>, DecodingError> {
        todo!()
    }

    fn read_nullable_f32<R: IoRead>(&self, reader: &mut R) -> Result<Option<f32>, DecodingError> {
        todo!()
    }

    fn read_nullable_f64<R: IoRead>(&self, reader: &mut R) -> Result<Option<f64>, DecodingError> {
        todo!()
    }

    fn read_nullable_string<R: IoRead>(
        &self,
        reader: &mut R,
    ) -> Result<Option<String>, DecodingError> {
        todo!()
    }

    fn read_nullable_bytes<R: IoRead>(
        &self,
        reader: &mut R,
    ) -> Result<Option<Vec<u8>>, DecodingError> {
        todo!()
    }

    fn read_nullable_bigint<R: IoRead>(
        &self,
        reader: &mut R,
    ) -> Result<Option<BigInt>, DecodingError> {
        todo!()
    }

    fn read_nullable_json<R: IoRead>(
        &self,
        reader: &mut R,
    ) -> Result<Option<JSON::Value>, DecodingError> {
        todo!()
    }

    fn read_nullable_array<R: IoRead, T>(
        &self,
        reader: impl FnMut(&mut R) -> T,
    ) -> Result<Option<Vec<T>>, DecodingError> {
        todo!()
    }

    fn read_nullable_map<R: IoRead, K, V>(
        &self,
        reader: &mut R,
        key_fn: impl FnMut(&mut R) -> K,
        val_fn: impl FnMut(&mut R) -> V,
    ) -> Option<BTreeMap<K, V>>
    where
        K: Eq + Hash + Ord,
    {
        todo!()
    }

    fn is_next_nil(&self) -> bool {
        todo!()
    }

    fn is_next_string(&self) -> bool {
        todo!()
    }

    fn context(&mut self) -> &mut Context {
        todo!()
    }
}
