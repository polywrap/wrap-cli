use polywrap_wasm_rs::{Context, DecodeError, EncodeError, Read, ReadDecoder, Write, WriteEncoder};
// use std::collections::HashMap;

#[derive(Debug, Clone, Default)]
struct Sanity {
    nil: Option<String>,
    int8: i8,
    int16: i16,
    int32: i32,
    uint8: u8,
    uint16: u16,
    uint32: u32,
    boolean: bool,
    // opt_uint32: Option<u32>,
    // opt_bool: Option<bool>,
    // float32: f32,
    // float64: f64,
    // string: String,
    // json: JSON::Value,
    // large_string: String,
    // bytes: Vec<u8>,
    // large_bytes: Vec<u8>,
    // array: Vec<u8>,
    // large_string_array: Vec<String>,
    // large_bytes_array: Vec<Vec<u8>>,
    // map: HashMap<String, Vec<i32>>,
}

impl Sanity {
    fn init(&mut self) -> Self {
        // let v1 = vec!["Polywrap".to_string(); 10_000];
        // let large_s = v1.join(" ");
        // let large_bytes = large_s.as_bytes().to_vec();

        // let mut large_string_array: Vec<String> = vec![];
        // let mut large_bytes_array: Vec<Vec<u8>> = vec![];
        // for _ in 0..100 {
        // 	large_string_array.push(large_s.clone());
        // 	large_bytes_array.push(large_bytes.clone());
        // }

        // let mut map: HashMap<String, Vec<i32>> = HashMap::new();
        // map.insert("foo".to_string(), vec![1, -1, 42]);
        // map.insert("baz".to_string(), vec![12412, -98987]);

        // let v2 = vec!["Polywrap".to_string(); 10];
        // let large_string = v2.join(" ");

        Self {
            nil: Option::None,
            int8: -128,
            int16: -32768,
            int32: -2147483648,
            uint8: 255,
            uint16: 65535,
            uint32: 4294967295,
            boolean: true,
            // opt_uint32: Some(234234234),
            // opt_bool: Some(true),
            // float32: 3.40282344818115234375,
            // float64: 3124124512.598273468017578125,
            // string: "Hello, world!".to_string(),
            // json: JSON::json!({ "foo": "bar", "bar": "baz" }),
            // large_string,
            // bytes: vec![0; 10],
            // large_bytes,
            // array: vec![10, 20, 30],
            // map,
            // large_string_array,
            // large_bytes_array,
        }
    }
}

fn serialize_sanity<W: Write>(writer: &mut W, sanity: &mut Sanity) -> Result<(), EncodeError> {
    writer.write_map_length(&8)?;
    writer.write_string("nil")?;
    writer.write_nil()?;
    writer.write_string("int8")?;
    writer.write_i8(&sanity.int8)?;
    writer.write_string("int16")?;
    writer.write_i16(&sanity.int16)?;
    writer.write_string("int32")?;
    writer.write_i32(&sanity.int32)?;
    writer.write_string("uint8")?;
    writer.write_u8(&sanity.uint8)?;
    writer.write_string("uint16")?;
    writer.write_u16(&sanity.uint16)?;
    writer.write_string("uint32")?;
    writer.write_u32(&sanity.uint32)?;
    writer.write_string("boolean")?;
    writer.write_bool(&sanity.boolean)?;
    // writer.write_string("opt_uint32")?;
    // writer.write_optional_u32(&sanity.opt_uint32)?;
    // writer.write_string("opt_bool")?;
    // writer.write_optional_bool(&sanity.opt_bool)?;
    // writer.write_string("float32")?;
    // writer.write_f32(sanity.float32)?;
    // writer.write_string("float64")?;
    // writer.write_f64(sanity.float64)?;
    // writer.write_string("string")?;
    // writer.write_string(&sanity.string)?;
    // writer.write_string("large_string")?;
    // writer.write_string(&sanity.large_string)?;
    // writer.write_string("json")?;
    // writer.write_json(&sanity.json)?;
    // writer.write_string("bytes")?;
    // writer.write_bytes(&sanity.bytes)?;
    // writer.write_string("large_bytes")?;
    // writer.write_bytes(&sanity.large_bytes)?;
    // writer.write_string("array")?;
    // writer.write_array(&sanity.array, |writer: &mut W, item| {
    // 	writer.write_u8(*item).unwrap();
    // })?;
    // writer.write_string("large_string_array")?;
    // writer.write_array(&sanity.large_string_array, |writer: &mut W, item| {
    // 	writer.write_string(item).unwrap();
    // })?;
    // writer.write_string("large_bytes_array")?;
    // writer.write_array(&sanity.large_bytes_array, |writer: &mut W, item| {
    // 	writer.write_bytes(item).unwrap();
    // })?;
    // writer.write_string("map")?;
    // writer.write_map(
    // 	&sanity.map,
    // 	|writer: &mut W, key| writer.write_string(key).unwrap(),
    // 	|writer: &mut W, value| {
    // 		writer
    // 			.write_array(value, |writer: &mut W, item| {
    // 				writer.write_i32(*item).unwrap();
    // 			})
    // 			.unwrap();
    // 	},
    // )?;
    Ok(())
}

fn deserialize_sanity<R: Read>(reader: &mut R, sanity: &mut Sanity) -> Result<Sanity, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;
    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "nil" => {
                sanity.nil = reader.read_optional_string()?;
            }
            "int8" => {
                sanity.int8 = reader.read_i8()?;
            }
            "int16" => {
                sanity.int16 = reader.read_i16()?;
            }
            "int32" => {
                sanity.int32 = reader.read_i32()?;
            }
            "uint8" => {
                sanity.uint8 = reader.read_u8()?;
            }
            "uint16" => {
                sanity.uint16 = reader.read_u16()?;
            }
            "uint32" => {
                sanity.uint32 = reader.read_u32()?;
            }
            "boolean" => {
                sanity.boolean = reader.read_bool()?;
            }
            // 		"opt_uint32" => {
            // 			sanity.opt_uint32 = reader.read_optional_u32()?;
            // 		},
            // 		"opt_bool" => {
            // 			sanity.opt_bool = reader.read_optional_bool()?;
            // 		},
            // 		"float32" => {
            // 			sanity.float32 = reader.read_f32()?;
            // 		},
            // 		"float64" => {
            // 			sanity.float64 = reader.read_f64()?;
            // 		},
            // 		"string" => {
            // 			sanity.string = reader.read_string()?;
            // 		},
            // 		"json" => {
            // 			sanity.json = reader.read_json()?;
            // 		},
            // 		"large_string" => {
            // 			sanity.large_string = reader.read_string()?;
            // 		},
            // 		"bytes" => {
            // 			sanity.bytes = reader.read_bytes()?;
            // 		},
            // 		"large_bytes" => {
            // 			sanity.large_bytes = reader.read_bytes()?;
            // 		},
            // 		"array" => {
            // 			sanity.array = reader.read_array(|reader| reader.read_u8().unwrap()).unwrap();
            // 		},
            // 		"large_string_array" => {
            // 			sanity.large_string_array =
            // 				reader.read_array(|reader| reader.read_string().unwrap()).unwrap();
            // 		},
            // 		"large_bytes_array" => {
            // 			sanity.large_bytes_array =
            // 				reader.read_array(|reader| reader.read_bytes().unwrap()).unwrap();
            // 		},
            // 		"map" =>
            // 			sanity.map = reader
            // 				.read_map(
            // 					|key_fn| key_fn.read_string().unwrap(),
            // 					|val_fn| val_fn.read_array(|reader| reader.read_i32().unwrap()).unwrap(),
            // 				)
            // 				.unwrap(),
            err_f => return Err(DecodeError::UnknownFieldName(err_f.to_string())),
        }
    }
    Ok(sanity.to_owned())
}

fn deserialize_with_overflow<R: Read>(
    reader: &mut R,
    sanity: &mut Sanity,
) -> Result<Sanity, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;
    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "nil" => {
                sanity.nil = reader.read_optional_string()?;
            }
            "int8" => {
                sanity.int8 = reader.read_i16()? as i8;
            }
            "int16" => {
                sanity.int16 = reader.read_i8()? as i16;
            }
            "int32" => {
                sanity.int32 = reader.read_i16()? as i32;
            }
            "uint8" => {
                sanity.uint8 = reader.read_u32()? as u8;
            }
            "uint16" => {
                sanity.uint16 = reader.read_u8()? as u16;
            }
            "uint32" => {
                sanity.uint32 = reader.read_u16()? as u32;
            }
            "boolean" => {
                sanity.boolean = reader.read_bool()?;
            }
            // 		"opt_uint32" => {
            // 			sanity.opt_uint32 = reader.read_optional_u32()?;
            // 		},
            // 		"opt_bool" => {
            // 			sanity.opt_bool = reader.read_optional_bool()?;
            // 		},
            // 		"float32" => {
            // 			sanity.float32 = reader.read_f64()? as f32;
            // 		},
            // 		"float64" => {
            // 			sanity.float64 = reader.read_f32()? as f64;
            // 		},
            // 		"string" => {
            // 			sanity.string = reader.read_string()?;
            // 		},
            // 		"json" => {
            // 			sanity.json = reader.read_json()?;
            // 		},
            // 		"bytes" => {
            // 			sanity.bytes = reader.read_bytes()?;
            // 		},
            // 		"array" => {
            // 			sanity.array = reader.read_array(|reader| reader.read_u8().unwrap()).unwrap();
            // 		},
            // 		"map" =>
            // 			sanity.map = reader
            // 				.read_map(
            // 					|key_fn| key_fn.read_string().unwrap(),
            // 					|val_fn| val_fn.read_array(|reader| reader.read_i32().unwrap()).unwrap(),
            // 				)
            // 				.unwrap(),
            err_f => return Err(DecodeError::UnknownFieldName(err_f.to_string())),
        }
    }
    Ok(sanity.to_owned())
}

fn deserialize_with_invalid_types<R: Read>(
    reader: &mut R,
    sanity: &mut Sanity,
) -> Result<Sanity, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;
    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "nil" => {
                sanity.nil = reader.read_optional_string()?;
            }
            "int8" => {
                sanity.int8 = reader.read_i8()?;
            }
            "int16" => {
                sanity.int16 = reader.read_i16()?;
            }
            "int32" => {
                sanity.int32 = reader.read_i16()? as i32;
            }
            "uint8" => {
                sanity.uint8 = reader.read_u8()?;
            }
            "uint16" => {
                sanity.uint16 = reader.read_u16()?;
            }
            "uint32" => {
                sanity.uint32 = reader.read_u32()?;
            }
            "boolean" => {
                sanity.boolean = reader.read_bool()?;
            }
            // 		"opt_uint32" => {
            // 			sanity.opt_uint32 = reader.read_optional_u32()?;
            // 		},
            // 		"opt_bool" => {
            // 			sanity.opt_bool = reader.read_optional_bool()?;
            // 		},
            // 		"float32" => {
            // 			sanity.float32 = reader.read_f32()?;
            // 		},
            // 		"float64" => {
            // 			sanity.float64 = reader.read_f64()?;
            // 		},
            // 		"string" => {
            // 			sanity.string = reader.read_string()?;
            // 		},
            // 		"json" => {
            // 			sanity.json = reader.read_json()?;
            // 		},
            // 		"large_string" => {
            // 			sanity.large_string = reader.read_string()?;
            // 		},
            // 		"bytes" => {
            // 			sanity.bytes = reader.read_bytes()?;
            // 		},
            // 		"large_bytes" => {
            // 			sanity.large_bytes = reader.read_bytes()?;
            // 		},
            // 		"array" => {
            // 			sanity.array = reader.read_array(|reader| reader.read_u8().unwrap()).unwrap();
            // 		},
            // 		"large_string_array" => {
            // 			sanity.large_string_array =
            // 				reader.read_array(|reader| reader.read_string().unwrap()).unwrap();
            // 		},
            // 		"large_bytes_array" => {
            // 			sanity.large_bytes_array =
            // 				reader.read_array(|reader| reader.read_bytes().unwrap()).unwrap();
            // 		},
            // 		"map" =>
            // 			sanity.map = reader
            // 				.read_map(
            // 					|key_fn| key_fn.read_string().unwrap(),
            // 					|val_fn| val_fn.read_array(|reader| reader.read_i32().unwrap()).unwrap(),
            // 				)
            // 				.unwrap(),
            err_f => return Err(DecodeError::UnknownFieldName(err_f.to_string())),
        }
    }
    Ok(sanity.to_owned())
}

impl PartialEq for Sanity {
    fn eq(&self, other: &Self) -> bool {
        self.nil == other.nil
    }
}

impl Eq for Sanity {}

fn convert_to_buffer(sanity: &mut Sanity) -> Result<Vec<u8>, EncodeError> {
    let mut context = Context::new();
    context.description = "Serialize sanity (to buffer)...".to_string();
    let mut encoder = WriteEncoder::new(&[], context);
    serialize_sanity(&mut encoder, sanity)?;
    Ok(encoder.get_buffer())
}

fn convert_from_buffer(sanity: &mut Sanity, buffer: &[u8]) -> Result<Sanity, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserialize sanity (from buffer)...".to_string();
    let mut decoder = ReadDecoder::new(buffer, context);
    Ok(deserialize_sanity(&mut decoder, sanity)?)
}

fn from_buffer_with_invalid_types(
    sanity: &mut Sanity,
    buffer: &[u8],
) -> Result<Sanity, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserialize sanity (from buffer with invalid types)...".to_string();
    let mut decoder = ReadDecoder::new(buffer, context);
    Ok(deserialize_with_invalid_types(&mut decoder, sanity)?)
}

fn from_buffer_with_overflows(sanity: &mut Sanity, buffer: &[u8]) -> Result<Sanity, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserialize sanity (from buffer with overflows)...".to_string();
    let mut decoder = ReadDecoder::new(buffer, context);
    Ok(deserialize_with_overflow(&mut decoder, sanity)?)
}

#[test]
fn serializes_and_deserializes() {
    // std::env::set_var("RUST_MIN_STACK", "100388608");
    println!("Serializes and deserializes");
    let mut default_input_sanity = Sanity::default();
    let mut init_input_sanity = default_input_sanity.init();
    let buffer = convert_to_buffer(&mut init_input_sanity).unwrap();

    let mut default_output_sanity = Sanity::default();
    let output_sanity = convert_from_buffer(&mut default_output_sanity, &buffer).unwrap();
    assert_eq!(init_input_sanity, output_sanity);
}

#[test]
fn serializes_and_deserializes_with_overflow() {
    // std::env::set_var("RUST_MIN_STACK", "100388608");
    println!("Serializes and deserializes with overflow");
    let mut default_input_sanity = Sanity::default();
    let mut init_input_sanity = default_input_sanity.init();
    let buffer = convert_to_buffer(&mut init_input_sanity).unwrap();

    let mut default_output_sanity = Sanity::default();
    let output_sanity_result = from_buffer_with_overflows(&mut default_output_sanity, &buffer);
    assert!(output_sanity_result.is_err());
}

#[test]
fn throws_error_if_invalid_type_found() {
    // std::env::set_var("RUST_MIN_STACK", "100388608");
    println!("Throws error if invalid type found");
    let mut default_input_sanity = Sanity::default();
    let mut init_input_sanity = default_input_sanity.init();
    let buffer = convert_to_buffer(&mut init_input_sanity).unwrap();

    let mut default_output_sanity = Sanity::default();
    let output_sanity_result = from_buffer_with_invalid_types(&mut default_output_sanity, &buffer);
    assert!(output_sanity_result.is_err());
}
