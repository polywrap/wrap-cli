// use polywrap_wasm_rs::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer, JSON};
// use std::collections::BTreeMap;

// #[derive(Debug, Clone, Default)]
// struct Sanity {
//     nil: Option<String>,
//     int8: i8,
//     int16: i16,
//     int32: i32,
//     uint8: u8,
//     uint16: u16,
//     uint32: u32,
//     boolean: bool,
//     opt_uint32: Option<u32>,
//     opt_bool: Option<bool>,
//     float32: f32,
//     float64: f64,
//     string: String,
//     json: JSON::Value,
//     large_string: String,
//     bytes: Vec<u8>,
//     large_bytes: Vec<u8>,
//     array: Vec<u8>,
//     large_string_array: Vec<String>,
//     large_bytes_array: Vec<Vec<u8>>,
//     map: BTreeMap<String, Vec<i32>>,
// }

// impl Sanity {
//     fn init(&mut self) -> Self {
//         let large_string = vec!["Polywrap".to_string(); 10_000].join(",");
//         let large_bytes = large_string.as_bytes().to_vec();

//         let mut large_string_array: Vec<String> = vec![];
//         let mut large_bytes_array: Vec<Vec<u8>> = vec![];
//         for _ in 0..100 {
//             large_string_array.push(large_string.clone());
//             large_bytes_array.push(large_bytes.clone());
//         }

//         let mut map: BTreeMap<String, Vec<i32>> = BTreeMap::new();
//         map.insert("foo".to_string(), vec![1, -1, 42]);
//         map.insert("baz".to_string(), vec![12412, -98987]);

//         Self {
//             nil: None,
//             int8: -128,
//             int16: -32768,
//             int32: -2147483648,
//             uint8: 255,
//             uint16: 65535,
//             uint32: 4294967295,
//             boolean: true,
//             opt_uint32: Some(234234234),
//             opt_bool: Some(true),
//             float32: 3.402_823_4,
//             float64: 3_124_124_512.598_273_3,
//             string: "Hello, world!".to_string(),
//             json: JSON::json!({ "foo": "bar", "bar": "baz" }),
//             large_string,
//             bytes: vec![0; 12],
//             large_bytes,
//             array: vec![10, 20, 30],
//             map,
//             large_string_array,
//             large_bytes_array,
//         }
//     }

//     fn convert_to_buffer(&mut self) -> Vec<u8> {
//         let mut context = Context::new();
//         context.description = "Serialize sanity (to buffer)...".to_string();
//         let mut sizer = WriteSizer::new(context.clone());
//         serialize_sanity(&mut sizer, self);
//         let mut buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
//         buffer.resize(sizer.get_length() as usize, 0);
//         let mut encoder = WriteEncoder::new(&buffer, context);
//         serialize_sanity(&mut encoder, self);
//         encoder.get_buffer()
//     }

//     fn convert_from_buffer(&mut self, buffer: &[u8]) -> Result<&mut Sanity, String> {
//         let mut context = Context::new();
//         context.description = "Deserialize sanity (from buffer)...".to_string();
//         let decoder = ReadDecoder::new(buffer, context);
//         deserialize_sanity(decoder, self)
//     }

//     fn from_buffer_with_invalid_types(&mut self, buffer: &[u8]) -> Result<&mut Sanity, String> {
//         let mut context = Context::new();
//         context.description = "Deserialize sanity (from buffer with invalid types)...".to_string();
//         let decoder = ReadDecoder::new(buffer, context);
//         deserialize_with_invalid_types(decoder, self)
//     }

//     fn from_buffer_with_overflows(&mut self, buffer: &[u8]) -> Result<&mut Sanity, String> {
//         let mut context = Context::new();
//         context.description = "Deserialize sanity (from buffer with overflows)...".to_string();
//         let decoder = ReadDecoder::new(buffer, context);
//         deserialize_with_overflow(decoder, self)
//     }
// }

// fn serialize_sanity<W: Write>(writer: &mut W, sanity: &mut Sanity) {
//     writer.write_map_length(20);
//     writer.write_str("nil");
//     writer.write_nullable_string(&sanity.nil);
//     writer.write_str("int8");
//     writer.write_i8(&sanity.int8);
//     writer.write_str("int16");
//     writer.write_i16(&sanity.int16);
//     writer.write_str("int32");
//     writer.write_i32(&sanity.int32);
//     writer.write_str("uint8");
//     writer.write_u8(&sanity.uint8);
//     writer.write_str("uint16");
//     writer.write_u16(&sanity.uint16);
//     writer.write_str("uint32");
//     writer.write_u32(&sanity.uint32);
//     writer.write_str("boolean");
//     writer.write_bool(&sanity.boolean);
//     writer.write_str("opt_uint32");
//     writer.write_nullable_u32(&sanity.opt_uint32);
//     writer.write_str("opt_bool");
//     writer.write_nullable_bool(&sanity.opt_bool);
//     writer.write_str("float32");
//     writer.write_f32(&sanity.float32);
//     writer.write_str("float64");
//     writer.write_f64(&sanity.float64);
//     writer.write_str("string");
//     writer.write_string(&sanity.string);
//     writer.write_str("large_string");
//     writer.write_string(&sanity.large_string);
//     writer.write_str("json");
//     writer.write_json(&sanity.json);
//     writer.write_str("bytes");
//     writer.write_bytes(&sanity.bytes);
//     writer.write_str("large_bytes");
//     writer.write_bytes(&sanity.large_bytes);
//     writer.write_str("array");
//     writer.write_array(&sanity.array, |writer: &mut W, item| {
//         writer.write_u8(item);
//     });
//     writer.write_str("large_string_array");
//     writer.write_array(&sanity.large_string_array, |writer: &mut W, item| {
//         writer.write_string(item);
//     });
//     writer.write_str("large_bytes_array");
//     writer.write_array(&sanity.large_bytes_array, |writer: &mut W, item| {
//         writer.write_bytes(item);
//     });
//     writer.write_str("map");
//     writer.write_map(
//         &sanity.map,
//         |writer: &mut W, key| writer.write_string(key),
//         |writer: &mut W, value| {
//             writer.write_array(value, |writer: &mut W, item| {
//                 writer.write_i32(item);
//             });
//         },
//     );
// }

// fn deserialize_sanity<R: Read>(mut reader: R, sanity: &mut Sanity) -> Result<&mut Sanity, String> {
//     let mut num_of_fields = reader.read_map_length()?;
//     while num_of_fields > 0 {
//         num_of_fields -= 1;
//         let field = reader.read_string()?;

//         match field.as_str() {
//             "nil" => {
//                 sanity.nil = reader.read_nullable_string();
//             }
//             "int8" => {
//                 sanity.int8 = reader.read_i8()?;
//             }
//             "int16" => {
//                 sanity.int16 = reader.read_i16()?;
//             }
//             "int32" => {
//                 sanity.int32 = reader.read_i32()?;
//             }
//             "uint8" => {
//                 sanity.uint8 = reader.read_u8()?;
//             }
//             "uint16" => {
//                 sanity.uint16 = reader.read_u16()?;
//             }
//             "uint32" => {
//                 sanity.uint32 = reader.read_u32()?;
//             }
//             "boolean" => {
//                 sanity.boolean = reader.read_bool()?;
//             }
//             "opt_uint32" => {
//                 sanity.opt_uint32 = reader.read_nullable_u32();
//             }
//             "opt_bool" => {
//                 sanity.opt_bool = reader.read_nullable_bool();
//             }
//             "float32" => {
//                 sanity.float32 = reader.read_f32()?;
//             }
//             "float64" => {
//                 sanity.float64 = reader.read_f64()?;
//             }
//             "string" => {
//                 sanity.string = reader.read_string()?;
//             }
//             "json" => {
//                 sanity.json = reader.read_json()?;
//             }
//             "large_string" => {
//                 sanity.large_string = reader.read_string()?;
//             }
//             "bytes" => {
//                 sanity.bytes = reader.read_bytes()?;
//             }
//             "large_bytes" => {
//                 sanity.large_bytes = reader.read_bytes()?;
//             }
//             "array" => {
//                 sanity.array = reader
//                     .read_array(|reader| reader.read_u8().unwrap())
//                     .unwrap();
//             }
//             "large_string_array" => {
//                 sanity.large_string_array = reader
//                     .read_array(|reader| reader.read_string().unwrap())
//                     .unwrap();
//             }
//             "large_bytes_array" => {
//                 sanity.large_bytes_array = reader
//                     .read_array(|reader| reader.read_bytes().unwrap())
//                     .unwrap();
//             }
//             "map" => {
//                 sanity.map = reader
//                     .read_map(
//                         |key_fn| key_fn.read_string().unwrap(),
//                         |val_fn| {
//                             val_fn
//                                 .read_array(|reader| reader.read_i32().unwrap())
//                                 .unwrap()
//                         },
//                     )
//                     .unwrap()
//             }
//             _ => return Err(format!("Sanity.decode: Unknown field name '{}'", field)),
//         }
//     }
//     Ok(sanity)
// }

// fn deserialize_with_overflow<R: Read>(
//     mut reader: R,
//     sanity: &mut Sanity,
// ) -> Result<&mut Sanity, String> {
//     let mut num_of_fields = reader.read_map_length()?;
//     while num_of_fields > 0 {
//         num_of_fields -= 1;
//         let field = reader.read_string()?;

//         match field.as_str() {
//             "nil" => {
//                 sanity.nil = reader.read_nullable_string();
//             }
//             "int8" => {
//                 sanity.int8 = reader.read_i16()? as i8;
//             }
//             "int16" => {
//                 sanity.int16 = reader.read_i8()? as i16;
//             }
//             "int32" => {
//                 sanity.int32 = reader.read_i16()? as i32;
//             }
//             "uint8" => {
//                 sanity.uint8 = reader.read_u32()? as u8;
//             }
//             "uint16" => {
//                 sanity.uint16 = reader.read_u8()? as u16;
//             }
//             "uint32" => {
//                 sanity.uint32 = reader.read_u16()? as u32;
//             }
//             "boolean" => {
//                 sanity.boolean = reader.read_bool()?;
//             }
//             "opt_uint32" => {
//                 sanity.opt_uint32 = reader.read_nullable_u32();
//             }
//             "opt_bool" => {
//                 sanity.opt_bool = reader.read_nullable_bool();
//             }
//             "float32" => {
//                 sanity.float32 = reader.read_f64()? as f32;
//             }
//             "float64" => {
//                 sanity.float64 = reader.read_f32()? as f64;
//             }
//             "string" => {
//                 sanity.string = reader.read_string()?;
//             }
//             "json" => {
//                 sanity.json = reader.read_json()?;
//             }
//             "bytes" => {
//                 sanity.bytes = reader.read_bytes()?;
//             }
//             "array" => {
//                 sanity.array = reader
//                     .read_array(|reader| reader.read_u8().unwrap())
//                     .unwrap();
//             }
//             "map" => {
//                 sanity.map = reader
//                     .read_map(
//                         |key_fn| key_fn.read_string().unwrap(),
//                         |val_fn| {
//                             val_fn
//                                 .read_array(|reader| reader.read_i32().unwrap())
//                                 .unwrap()
//                         },
//                     )
//                     .unwrap()
//             }
//             _ => return Err(format!("Sanity.decode: Unknown field name '{}'", field)),
//         }
//     }
//     Ok(sanity)
// }

// fn deserialize_with_invalid_types<R: Read>(
//     mut reader: R,
//     sanity: &mut Sanity,
// ) -> Result<&mut Sanity, String> {
//     let mut num_of_fields = reader.read_map_length()?;
//     while num_of_fields > 0 {
//         num_of_fields -= 1;
//         let field = reader.read_string()?;

//         match field.as_str() {
//             "nil" => {
//                 sanity.nil = reader.read_nullable_string();
//             }
//             "int8" => {
//                 sanity.int8 = reader.read_i8()?;
//             }
//             "int16" => {
//                 sanity.int16 = reader.read_i16()?;
//             }
//             "int32" => {
//                 sanity.int32 = reader.read_i32()?;
//             }
//             "uint8" => {
//                 sanity.uint8 = reader.read_u8()?;
//             }
//             "uint16" => {
//                 sanity.uint16 = reader.read_u16()?;
//             }
//             "uint32" => {
//                 sanity.uint32 = reader.read_u32()?;
//             }
//             "boolean" => {
//                 sanity.boolean = reader.read_bool()?;
//             }
//             "opt_uint32" => {
//                 sanity.opt_uint32 = reader.read_nullable_u32();
//             }
//             "opt_bool" => {
//                 sanity.opt_bool = reader.read_nullable_bool();
//             }
//             "float32" => {
//                 sanity.float32 = reader.read_f32()?;
//             }
//             "float64" => {
//                 sanity.float64 = reader.read_f64()?;
//             }
//             "string" => {
//                 sanity.string = reader.read_string()?;
//             }
//             "json" => {
//                 sanity.json = reader.read_json()?;
//             }
//             "large_string" => {
//                 sanity.large_string = reader.read_string()?;
//             }
//             "bytes" => {
//                 sanity.bytes = reader.read_bytes()?;
//             }
//             "large_bytes" => {
//                 sanity.large_bytes = reader.read_bytes()?;
//             }
//             "array" => {
//                 sanity.array = reader
//                     .read_array(|reader| reader.read_u8().unwrap())
//                     .unwrap();
//             }
//             "large_string_array" => {
//                 sanity.large_string_array = reader
//                     .read_array(|reader| reader.read_string().unwrap())
//                     .unwrap();
//             }
//             "large_bytes_array" => {
//                 sanity.large_bytes_array = reader
//                     .read_array(|reader| reader.read_bytes().unwrap())
//                     .unwrap();
//             }
//             "map" => {
//                 sanity.map = reader
//                     .read_map(
//                         |key_fn| key_fn.read_string().unwrap(),
//                         |val_fn| {
//                             val_fn
//                                 .read_array(|reader| reader.read_i32().unwrap())
//                                 .unwrap()
//                         },
//                     )
//                     .unwrap()
//             }
//             _ => return Err(format!("Sanity.decode: Unknown field name '{}'", field)),
//         }
//     }
//     Ok(sanity)
// }

// impl PartialEq for Sanity {
//     fn eq(&self, other: &Self) -> bool {
//         self.float32 == other.float32 && self.float64 == other.float64
//     }
// }

// impl Eq for Sanity {}

// #[test]
// fn sanity_init_works() {
//     println!("Sanity initialization works!");
//     let mut default_sanity = Sanity::default();
//     assert!(!default_sanity.boolean);
//     let initialized_sanity = default_sanity.init();
//     assert!(initialized_sanity.boolean);
// }

// // #[test]
// // fn serializes_and_deserializes() {
// //     println!("Serializes and deserializes");
// //     let mut input = Sanity::default().init();
// //     let mut output = Sanity::default();
// //     let result = output.convert_from_buffer(&input.convert_to_buffer());
// //     // assert!(result.is_ok());
// //     assert_eq!(input, output);
// // }

// #[test]
// fn serializes_and_deserializes_with_overflow() {
//     println!("Serializes and deserializes with overflow");
//     let mut input = Sanity::default().init();
//     let mut output = Sanity::default();
//     let result = output.from_buffer_with_overflows(&input.convert_to_buffer());
//     assert!(result.is_err());
// }

// #[test]
// fn throws_error_if_invalid_type_found() {
//     println!("Throws error if invalid type found");
//     let mut input = Sanity::default().init();
//     let mut output = Sanity::default();
//     let result = output.from_buffer_with_invalid_types(&input.convert_to_buffer());
//     assert!(result.is_err());
// }
