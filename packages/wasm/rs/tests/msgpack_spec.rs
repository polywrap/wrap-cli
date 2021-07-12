use polywrap_wasm_rs::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use std::collections::HashMap;
use std::io::{Error, ErrorKind, Result};

#[derive(Debug, Clone)]
pub struct Sanity {
    nil: Option<String>,
    int8: i8,
    int16: i16,
    int32: i32,
    int64: i64,
    uint8: u8,
    uint16: u16,
    uint32: u32,
    uint64: u64,
    boolean: bool,
    opt_uint32: Option<u32>,
    opt_uint64: Option<u64>,
    opt_bool: Option<bool>,
    float32: f32,
    float64: f64,
    string: String,
    large_string: String,
    bytes: Vec<u8>,
    large_bytes: Vec<u8>,
    array: Vec<u8>,
    large_string_array: Vec<String>,
    large_bytes_array: Vec<Vec<u8>>,
    map: HashMap<String, Vec<i32>>,
}

impl Sanity {
    fn new() -> Self {
        Self {
            nil: None,
            int8: 0,
            int16: 0,
            int32: 0,
            int64: 0,
            uint8: 0,
            uint16: 0,
            uint32: 0,
            uint64: 0,
            boolean: false,
            opt_uint32: None,
            opt_uint64: None,
            opt_bool: None,
            float32: 0.0,
            float64: 0.0,
            string: String::new(),
            large_string: String::new(),
            bytes: vec![],
            large_bytes: vec![],
            array: vec![],
            large_string_array: vec![],
            large_bytes_array: vec![],
            map: HashMap::new(),
        }
    }

    fn init(&mut self) -> Self {
        let huge_vec = vec!["web3api".to_string(); 10_000];
        let huge_string = huge_vec.join(",");
        let huge_bytes = huge_string.as_bytes();

        let mut large_string_array: Vec<String> = vec![];
        let mut large_bytes_array: Vec<Vec<u8>> = vec![];
        for _ in 0..100 {
            large_string_array.push(huge_string.clone());
            large_bytes_array.push(huge_bytes.to_vec());
        }

        let big_vec = vec!["web3api".to_string(); 10];
        let large_string = big_vec.join(",");

        let mut map: HashMap<String, Vec<i32>> = HashMap::new();
        map.insert("foo".to_string(), vec![1, -1, 42]);
        map.insert("baz".to_string(), vec![12412, -98987]);

        Self {
            nil: None,
            int8: -128,
            int16: -32768,
            int32: -2147483648,
            int64: -9223372036854775808,
            uint8: 255,
            uint16: 65535,
            uint32: 4294967295,
            uint64: 18446744073709551615,
            boolean: true,
            opt_uint32: Some(234234234),
            opt_uint64: None,
            opt_bool: Some(true),
            float32: 3.40282344818115234375,
            float64: 3124124512.598273468017578125,
            string: "Hello, world!".to_string(),
            large_string,
            bytes: Vec::with_capacity(12),
            large_bytes: huge_bytes.to_vec(),
            array: vec![10, 20, 30],
            map,
            large_string_array,
            large_bytes_array,
        }
    }

    fn to_buffer(&mut self) -> Vec<u8> {
        let mut context = Context::new();
        context.description = "Serialize sanity (to buffer)...".to_string();
        let sizer = WriteSizer::new(context.clone());
        serialize_sanity(sizer.clone(), self);
        let buffer: Vec<u8> = Vec::with_capacity(sizer.length as usize);
        let encoder = WriteEncoder::new(buffer.as_slice(), context);
        serialize_sanity(encoder, self);
        buffer.to_vec()
    }

    fn from_buffer(&mut self, buffer: &[u8]) -> Result<()> {
        let mut context = Context::new();
        context.description = "Deserialize sanity (from buffer)...".to_string();
        let decoder = ReadDecoder::new(buffer, context);
        deserialize_sanity(decoder, self)
    }

    fn from_buffer_with_invalid_types(&mut self, buffer: &[u8]) -> Result<()> {
        let mut context = Context::new();
        context.description = "Deserialize sanity (from buffer with invalid types)...".to_string();
        let decoder = ReadDecoder::new(buffer, context);
        deserialize_with_invalid_types(decoder, self)
    }

    fn from_buffer_with_overflows(&mut self, buffer: &[u8]) -> Result<()> {
        let mut context = Context::new();
        context.description = "Deserialize sanity (from buffer with overflows)...".to_string();
        let decoder = ReadDecoder::new(buffer, context);
        deserialize_with_overflow(decoder, self)
    }
}

fn serialize_sanity<W: Write>(mut writer: W, sanity: &mut Sanity) {
    writer.write_map_length(23);
    writer.write_string(&"nil".to_string());
    writer.write_nullable_string(&sanity.nil);
    writer.write_string(&"int8".to_string());
    writer.write_i8(sanity.int8);
    writer.write_string(&"int16".to_string());
    writer.write_i16(sanity.int16);
    writer.write_string(&"int32".to_string());
    writer.write_i32(&sanity.int32);
    writer.write_string(&"int64".to_string());
    writer.write_i64(sanity.int64);
    writer.write_string(&"uint8".to_string());
    writer.write_u8(&sanity.uint8);
    writer.write_string(&"uint16".to_string());
    writer.write_u16(sanity.uint16);
    writer.write_string(&"uint32".to_string());
    writer.write_u32(&sanity.uint32);
    writer.write_string(&"uint64".to_string());
    writer.write_u64(&sanity.uint64);
    writer.write_string(&"boolean".to_string());
    writer.write_bool(sanity.boolean);
    writer.write_string(&"opt_uint32".to_string());
    writer.write_nullable_u32(&sanity.opt_uint32);
    writer.write_string(&"opt_uint64".to_string());
    writer.write_nullable_u64(&sanity.opt_uint64);
    writer.write_string(&"opt_bool".to_string());
    writer
        .write_nullable_bool(sanity.opt_bool)
        .expect("Failed to write nullable bool");
    writer.write_string(&"float32".to_string());
    writer.write_f32(sanity.float32);
    writer.write_string(&"float64".to_string());
    writer.write_f64(sanity.float64);
    writer.write_string(&"string".to_string());
    writer.write_string(&sanity.string);
    writer.write_string(&"large_string".to_string());
    writer.write_string(&sanity.large_string.clone());
    writer.write_string(&"bytes".to_string());
    writer.write_bytes(&sanity.bytes);
    writer.write_string(&"large_bytes".to_string());
    writer.write_bytes(&sanity.large_bytes);
    writer.write_string(&"array".to_string());
    writer.write_array(sanity.array.as_slice(), W::write_u8);
    writer.write_string(&"large_string_array".to_string());
    writer.write_array(sanity.large_string_array.as_slice(), W::write_string);
    writer.write_string(&"large_bytes_array".to_string());
    writer.write_array(sanity.large_bytes_array.as_slice(), W::write_bytes);
    writer.write_string(&"map".to_string());
    writer.write_map(
        sanity.map.clone(),
        |writer: &mut W, key| writer.write_string(key),
        |writer: &mut W, value| writer.write_array(value.as_slice(), Write::write_i32),
    );
}

fn deserialize_sanity<R: Read>(mut reader: R, sanity: &mut Sanity) -> Result<()> {
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();
    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "nil" => {
                sanity.nil = reader.read_nullable_string();
            }
            "int8" => {
                sanity.int8 = reader.read_i8().unwrap_or_default();
            }
            "int16" => {
                sanity.int16 = reader.read_i16().unwrap_or_default();
            }
            "int32" => {
                sanity.int32 = reader.read_i32().unwrap_or_default();
            }
            "int64" => {
                sanity.int64 = reader.read_i64().unwrap_or_default();
            }
            "uint8" => {
                sanity.uint8 = reader.read_u8().unwrap_or_default();
            }
            "uint16" => {
                sanity.uint16 = reader.read_u16().unwrap_or_default();
            }
            "uint32" => {
                sanity.uint32 = reader.read_u32().unwrap_or_default();
            }
            "uint64" => {
                sanity.uint64 = reader.read_u64().unwrap_or_default();
            }
            "boolean" => {
                sanity.boolean = reader.read_bool().unwrap_or_default();
            }
            "opt_uint32" => {
                sanity.opt_uint32 = reader.read_nullable_u32();
            }
            "opt_uint64" => {
                sanity.opt_uint64 = reader.read_nullable_u64();
            }
            "opt_bool" => {
                sanity.opt_bool = reader.read_nullable_bool();
            }
            "float32" => {
                sanity.float32 = reader.read_f32().unwrap_or_default();
            }
            "float64" => {
                sanity.float64 = reader.read_f64().unwrap_or_default();
            }
            "string" => {
                sanity.string = reader.read_string().unwrap_or_default();
            }
            "large_string" => {
                sanity.large_string = reader.read_string().unwrap_or_default();
            }
            "bytes" => {
                sanity.bytes = reader.read_bytes().unwrap_or_default();
            }
            "large_bytes" => {
                sanity.large_bytes = reader.read_bytes().unwrap_or_default();
            }
            "array" => {}
            "large_string_array" => {}
            "large_bytes_array" => {}
            "map" => {}
            _ => {
                let custom_error = format!("Sanity.decode: Unknown field name '{}'", field);
                return Err(Error::new(ErrorKind::InvalidInput, custom_error));
            }
        }
    }
    Ok(())
}

fn deserialize_with_overflow<R: Read>(mut reader: R, sanity: &mut Sanity) -> Result<()> {
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();
    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "nil" => {
                sanity.nil = reader.read_nullable_string();
            }
            "int8" => {
                sanity.int8 = reader.read_i16().unwrap_or_default() as i8;
            }
            "int16" => {
                sanity.int16 = reader.read_i8().unwrap_or_default() as i16;
            }
            "int32" => {
                sanity.int32 = reader.read_i16().unwrap_or_default() as i32;
            }
            "int64" => {
                sanity.int64 = reader.read_i8().unwrap_or_default() as i64;
            }
            "uint8" => {
                sanity.uint8 = reader.read_u64().unwrap_or_default() as u8;
            }
            "uint16" => {
                sanity.uint16 = reader.read_u8().unwrap_or_default() as u16;
            }
            "uint32" => {
                sanity.uint32 = reader.read_u16().unwrap_or_default() as u32;
            }
            "uint64" => {
                sanity.uint64 = reader.read_u8().unwrap_or_default() as u64;
            }
            "boolean" => {
                sanity.boolean = reader.read_bool().unwrap_or_default();
            }
            "opt_uint32" => {
                sanity.opt_uint32 = reader.read_nullable_u32();
            }
            "opt_uint64" => {
                sanity.opt_uint64 = reader.read_nullable_u64();
            }
            "opt_bool" => {
                sanity.opt_bool = reader.read_nullable_bool();
            }
            "float32" => {
                sanity.float32 = reader.read_f64().unwrap_or_default() as f32;
            }
            "float64" => {
                sanity.float64 = reader.read_f32().unwrap_or_default() as f64;
            }
            "string" => {
                sanity.string = reader.read_string().unwrap_or_default();
            }
            "large_string" => {
                sanity.large_string = reader.read_string().unwrap_or_default();
            }
            "bytes" => {
                sanity.bytes = reader.read_bytes().unwrap_or_default();
            }
            "large_bytes" => {
                sanity.large_bytes = reader.read_bytes().unwrap_or_default();
            }
            "array" => {}
            "large_string_array" => {}
            "large_bytes_array" => {}
            "map" => {}
            _ => {
                let custom_error = format!("Sanity.decode: Unknown field name '{}'", field);
                return Err(Error::new(ErrorKind::InvalidInput, custom_error));
            }
        }
    }
    Ok(())
}

fn deserialize_with_invalid_types<R: Read>(mut reader: R, sanity: &mut Sanity) -> Result<()> {
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();
    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "nil" => {
                sanity.nil = reader.read_nullable_string();
            }
            "int8" => {
                sanity.int8 = reader.read_i8().unwrap_or_default();
            }
            "int16" => {
                sanity.int16 = reader.read_i16().unwrap_or_default();
            }
            "int32" => {
                sanity.int32 = reader.read_i32().unwrap_or_default();
            }
            "int64" => {
                sanity.int64 = reader.read_i64().unwrap_or_default();
            }
            "uint8" => {
                sanity.uint8 = reader.read_u8().unwrap_or_default();
            }
            "uint16" => {
                sanity.uint16 = reader.read_u16().unwrap_or_default();
            }
            "uint32" => {
                sanity.uint32 = reader.read_u32().unwrap_or_default();
            }
            "uint64" => {
                sanity.uint64 = reader.read_u64().unwrap_or_default();
            }
            "boolean" => {
                sanity.boolean = reader.read_bool().unwrap_or_default();
            }
            "opt_uint32" => {
                sanity.opt_uint32 = reader.read_nullable_u32();
            }
            "opt_uint64" => {
                sanity.opt_uint64 = reader.read_nullable_u64();
            }
            "opt_bool" => {
                sanity.opt_bool = reader.read_nullable_bool();
            }
            "float32" => {
                sanity.float32 = reader.read_f32().unwrap_or_default();
            }
            "float64" => {
                sanity.float64 = reader.read_f64().unwrap_or_default();
            }
            "string" => {
                sanity.string = reader.read_string().unwrap_or_default();
            }
            "large_string" => {
                sanity.large_string = reader.read_string().unwrap_or_default();
            }
            "bytes" => {
                sanity.bytes = reader.read_bytes().unwrap_or_default();
            }
            "large_bytes" => {
                sanity.large_bytes = reader.read_bytes().unwrap_or_default();
            }
            "array" => {}
            "large_string_array" => {}
            "large_bytes_array" => {}
            "map" => {}
            _ => {
                let custom_error = format!("Sanity.decode: Unknown field name '{}'", field);
                return Err(Error::new(ErrorKind::InvalidInput, custom_error));
            }
        }
    }
    Ok(())
}

impl PartialEq for Sanity {
    fn eq(&self, other: &Self) -> bool {
        self.float32 == other.float32 && self.float64 == other.float64
    }
}

impl Eq for Sanity {}

#[test]
fn serialize_and_deserialize() {
    let mut sanity_input = Sanity::new();
    let mut input = sanity_input.init();
    let mut output = Sanity::new();
    output
        .from_buffer(input.to_buffer().as_slice())
        .expect("Failed to to write output from buffer");
    assert_ne!(output, input);
}

#[test]
fn serialize_and_deserialize_with_overflow() {
    let mut sanity_input = Sanity::new();
    let mut input = sanity_input.init();
    let mut output = Sanity::new();
    assert!(output
        .from_buffer_with_overflows(input.to_buffer().as_slice())
        .is_ok());
}

#[test]
fn throw_error_if_invalid_type_found() {
    let mut sanity_input = Sanity::new();
    let mut input = sanity_input.init();
    let mut output = Sanity::new();
    assert!(output
        .from_buffer_with_invalid_types(input.to_buffer().as_slice())
        .is_ok());
}
