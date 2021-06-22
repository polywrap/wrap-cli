mod test {
    use std::collections::HashMap;
    use std::io::{Error, ErrorKind, Result};
    use web3api_wasm_rs::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};

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
            let context = Context::new();
            let sizer = WriteSizer::new(context.clone());
            self.serialize_sanity(sizer.clone());
            let buffer: Vec<u8> = Vec::with_capacity(sizer.length as usize);
            let encoder = WriteEncoder::new(buffer.as_slice(), context);
            self.serialize_sanity(encoder);
            buffer.to_vec()
        }

        fn from_buffer(&mut self, buffer: &[u8]) {
            let context = Context::new();
            let decoder = ReadDecoder::new(buffer, context);
            let _ = self.deserialize_sanity(decoder);
        }

        fn from_buffer_with_invalid_types(&mut self, buffer: &[u8]) {
            let context = Context::new();
            let decoder = ReadDecoder::new(buffer, context);
            let _ = self.deserialize_with_invalid_types(decoder);
        }

        fn from_buffer_with_overflows(&mut self, buffer: &[u8]) {
            let context = Context::new();
            let decoder = ReadDecoder::new(buffer, context);
            let _ = self.deserialize_with_overflow(decoder);
        }

        fn serialize_sanity<W: Write>(&self, mut writer: W) {
            writer.write_map_length(23);
            writer.write_string("nil".to_string());
            let _ = writer.write_nullable_string(self.nil.clone());
            writer.write_string("int8".to_string());
            writer.write_i8(self.int8);
            writer.write_string("int16".to_string());
            writer.write_i16(self.int16);
            writer.write_string("int32".to_string());
            writer.write_i32(self.int32);
            writer.write_string("int64".to_string());
            writer.write_i64(self.int64);
            writer.write_string("uint8".to_string());
            writer.write_u8(self.uint8);
            writer.write_string("uint16".to_string());
            writer.write_u16(self.uint16);
            writer.write_string("uint32".to_string());
            writer.write_u32(self.uint32);
            writer.write_string("uint64".to_string());
            writer.write_u64(self.uint64);
            writer.write_string("boolean".to_string());
            writer.write_bool(self.boolean);
            writer.write_string("opt_uint32".to_string());
            let _ = writer.write_nullable_u32(self.opt_uint32);
            writer.write_string("opt_uint64".to_string());
            let _ = writer.write_nullable_u64(self.opt_uint64);
            writer.write_string("opt_bool".to_string());
            let _ = writer.write_nullable_bool(self.opt_bool);
            writer.write_string("float32".to_string());
            writer.write_f32(self.float32);
            writer.write_string("float64".to_string());
            writer.write_f64(self.float64);
            writer.write_string("string".to_string());
            writer.write_string(self.string.clone());
            writer.write_string("large_string".to_string());
            writer.write_string(self.large_string.clone());
            writer.write_string("bytes".to_string());
            let _ = writer.write_bytes(self.bytes.as_slice());
            writer.write_string("large_bytes".to_string());
            let _ = writer.write_bytes(self.large_bytes.as_slice());
            /* writer.write_string("array".to_string()); */
            /* writer.write_array() */
            /* writer.write_string("large_string_array") */
            /* writer.write_array() */
            /* writer.write_string("large_bytes_array") */
            /* writer.write_array() */
            /* writer.write_string("map") */
            /* writer.write_map() */
        }

        fn deserialize_sanity<R: Read>(&mut self, mut reader: R) -> Result<()> {
            let mut num_of_fields = reader.read_map_length().unwrap_or_default();
            while num_of_fields > 0 {
                num_of_fields -= 1;
                let field = reader.read_string().unwrap_or_default();

                if field == "nil".to_string() {
                    self.nil = reader.read_nullable_string();
                } else if field == "int8".to_string() {
                    self.int8 = reader.read_i8().unwrap_or_default();
                } else if field == "int16".to_string() {
                    self.int16 = reader.read_i16().unwrap_or_default();
                } else if field == "int32".to_string() {
                    self.int32 = reader.read_i32().unwrap_or_default();
                } else if field == "int64".to_string() {
                    self.int64 = reader.read_i64().unwrap_or_default();
                } else if field == "uint8".to_string() {
                    self.uint8 = reader.read_u8().unwrap_or_default();
                } else if field == "uint16".to_string() {
                    self.uint16 = reader.read_u16().unwrap_or_default();
                } else if field == "uint32".to_string() {
                    self.uint32 = reader.read_u32().unwrap_or_default();
                } else if field == "uint64".to_string() {
                    self.uint64 = reader.read_u64().unwrap_or_default();
                } else if field == "boolean".to_string() {
                    self.boolean = reader.read_bool().unwrap_or_default();
                } else if field == "opt_uint32".to_string() {
                    self.opt_uint32 = reader.read_nullable_u32();
                } else if field == "opt_uint64".to_string() {
                    self.opt_uint64 = reader.read_nullable_u64();
                } else if field == "opt_bool".to_string() {
                    self.opt_bool = reader.read_nullable_bool();
                } else if field == "float32".to_string() {
                    self.float32 = reader.read_f32().unwrap_or_default();
                } else if field == "float64".to_string() {
                    self.float64 = reader.read_f64().unwrap_or_default();
                } else if field == "string".to_string() {
                    self.string = reader.read_string().unwrap_or_default();
                } else if field == "large_string".to_string() {
                    self.large_string = reader.read_string().unwrap_or_default();
                } else if field == "bytes".to_string() {
                    self.bytes = reader.read_bytes().unwrap_or_default();
                } else if field == "large_bytes".to_string() {
                    self.large_bytes = reader.read_bytes().unwrap_or_default();
                }
                /*

                else if field == "array".to_string() {
                    self.array = reader.read_array().unwrap_or_default();
                } else if field == "large_string_array".to_string() {
                    self.large_string_array = reader.read_array().unwrap_or_default();
                } else if field == "large_bytes_array".to_string() {
                    self.large_bytes_array = reader.read_array().unwrap_or_default();
                } else if field == "map".to_string() {
                    self.map = reader.read_map().unwrap_or_default();
                }

                */
                else {
                    let custom_error = format!("Sanity.decode: Unknown field name '{}'", field);
                    return Err(Error::new(ErrorKind::InvalidInput, custom_error));
                }
            }
            Ok(())
        }

        fn deserialize_with_overflow<R: Read>(&mut self, mut reader: R) -> Result<()> {
            let mut num_of_fields = reader.read_map_length().unwrap_or_default();
            while num_of_fields > 0 {
                num_of_fields -= 1;
                let field = reader.read_string().unwrap_or_default();

                if field == "nil".to_string() {
                    self.nil = reader.read_nullable_string();
                } else if field == "int8".to_string() {
                    self.int8 = reader.read_i16().unwrap_or_default() as i8;
                } else if field == "int16".to_string() {
                    self.int16 = reader.read_i8().unwrap_or_default() as i16;
                } else if field == "int32".to_string() {
                    self.int32 = reader.read_i16().unwrap_or_default() as i32;
                } else if field == "int64".to_string() {
                    self.int64 = reader.read_i8().unwrap_or_default() as i64;
                } else if field == "uint8".to_string() {
                    self.uint8 = reader.read_u64().unwrap_or_default() as u8;
                } else if field == "uint16".to_string() {
                    self.uint16 = reader.read_u8().unwrap_or_default() as u16;
                } else if field == "uint32".to_string() {
                    self.uint32 = reader.read_u16().unwrap_or_default() as u32;
                } else if field == "uint64".to_string() {
                    self.uint64 = reader.read_u8().unwrap_or_default() as u64;
                } else if field == "boolean".to_string() {
                    self.boolean = reader.read_bool().unwrap_or_default();
                } else if field == "opt_uint32".to_string() {
                    self.opt_uint32 = reader.read_nullable_u32();
                } else if field == "opt_uint64".to_string() {
                    self.opt_uint64 = reader.read_nullable_u64();
                } else if field == "opt_bool".to_string() {
                    self.opt_bool = reader.read_nullable_bool();
                } else if field == "float32".to_string() {
                    self.float32 = reader.read_f64().unwrap_or_default() as f32;
                } else if field == "float64".to_string() {
                    self.float64 = reader.read_f32().unwrap_or_default() as f64;
                } else if field == "string".to_string() {
                    self.string = reader.read_string().unwrap_or_default();
                } else if field == "large_string".to_string() {
                    self.large_string = reader.read_string().unwrap_or_default();
                } else if field == "bytes".to_string() {
                    self.bytes = reader.read_bytes().unwrap_or_default();
                } else if field == "large_bytes".to_string() {
                    self.large_bytes = reader.read_bytes().unwrap_or_default();
                }
                /*

                else if field == "array".to_string() {
                    self.array = reader.read_array().unwrap_or_default();
                } else if field == "large_string_array".to_string() {
                    self.large_string_array = reader.read_array().unwrap_or_default();
                } else if field == "large_bytes_array".to_string() {
                    self.large_bytes_array = reader.read_array().unwrap_or_default();
                } else if field == "map".to_string() {
                    self.map = reader.read_map().unwrap_or_default();
                }

                */
                else {
                    let custom_error = format!("Sanity.decode: Unknown field name '{}'", field);
                    return Err(Error::new(ErrorKind::InvalidInput, custom_error));
                }
            }
            Ok(())
        }

        fn deserialize_with_invalid_types<R: Read>(&mut self, mut reader: R) -> Result<()> {
            let mut num_of_fields = reader.read_map_length().unwrap_or_default();
            while num_of_fields > 0 {
                num_of_fields -= 1;
                let field = reader.read_string().unwrap_or_default();

                if field == "nil".to_string() {
                    self.nil = reader.read_nullable_string();
                } else if field == "int8".to_string() {
                    self.string = reader.read_string().unwrap_or_default();
                } else if field == "int16".to_string() {
                    self.int16 = reader.read_i16().unwrap_or_default();
                } else if field == "int32".to_string() {
                    self.int32 = reader.read_i32().unwrap_or_default();
                } else if field == "int64".to_string() {
                    self.int64 = reader.read_i64().unwrap_or_default();
                } else if field == "uint8".to_string() {
                    self.uint8 = reader.read_u8().unwrap_or_default();
                } else if field == "uint16".to_string() {
                    self.uint16 = reader.read_u16().unwrap_or_default();
                } else if field == "uint32".to_string() {
                    self.uint32 = reader.read_u32().unwrap_or_default();
                } else if field == "uint64".to_string() {
                    self.uint64 = reader.read_u64().unwrap_or_default();
                } else if field == "boolean".to_string() {
                    self.boolean = reader.read_bool().unwrap_or_default();
                } else if field == "opt_uint32".to_string() {
                    self.opt_uint32 = reader.read_nullable_u32();
                } else if field == "opt_uint64".to_string() {
                    self.opt_uint64 = reader.read_nullable_u64();
                } else if field == "opt_bool".to_string() {
                    self.opt_bool = reader.read_nullable_bool();
                } else if field == "float32".to_string() {
                    self.float32 = reader.read_f32().unwrap_or_default();
                } else if field == "float64".to_string() {
                    self.float64 = reader.read_f64().unwrap_or_default();
                } else if field == "string".to_string() {
                    self.string = reader.read_string().unwrap_or_default();
                } else if field == "large_string".to_string() {
                    self.large_string = reader.read_string().unwrap_or_default();
                } else if field == "bytes".to_string() {
                    self.bytes = reader.read_bytes().unwrap_or_default();
                } else if field == "large_bytes".to_string() {
                    self.large_bytes = reader.read_bytes().unwrap_or_default();
                }
                /*

                else if field == "array".to_string() {
                    self.array = reader.read_array().unwrap_or_default();
                } else if field == "large_string_array".to_string() {
                    self.large_string_array = reader.read_array().unwrap_or_default();
                } else if field == "large_bytes_array".to_string() {
                    self.large_bytes_array = reader.read_array().unwrap_or_default();
                } else if field == "map".to_string() {
                    self.map = reader.read_map().unwrap_or_default();
                }

                */
                else {
                    let custom_error = format!("Sanity.decode: Unknown field name '{}'", field);
                    return Err(Error::new(ErrorKind::InvalidInput, custom_error));
                }
            }
            Ok(())
        }
    }

    impl PartialEq for Sanity {
        fn eq(&self, other: &Self) -> bool {
            self.float32 == other.float32 && self.float64 == other.float64
        }
    }

    impl Eq for Sanity {}

    #[test]
    fn serialize_and_deserialize() {
        let mut input = Sanity::new();
        let mut output = Sanity::new();
        output.from_buffer(input.to_buffer().as_slice());
        assert_eq!(output, input);
    }

    #[test]
    fn serialize_and_deserialize_with_overflow() {
        let mut input = Sanity::new();
        let mut output = Sanity::new();
        panic!(
            "{:?}",
            output.from_buffer_with_overflows(input.to_buffer().as_slice())
        );
    }

    #[test]
    fn throw_error_if_invalid_type_found() {
        let mut input = Sanity::new();
        let mut output = Sanity::new();
        panic!(
            "{:?}",
            output.from_buffer_with_invalid_types(input.to_buffer().as_slice())
        );
    }
}
