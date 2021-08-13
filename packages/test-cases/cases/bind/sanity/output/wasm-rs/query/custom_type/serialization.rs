use crate::{
    get_custom_enum_value, 
    sanitize_custom_enum_value, 
    AnotherType, 
    CustomEnum, 
    CustomType,
};
use num_bigint::BigInt;
use num_traits::cast::FromPrimitive;
use polywrap_wasm_rs::{
    Context, 
    Read, 
    ReadDecoder, 
    Write, 
    WriteEncoder, 
    WriteSizer,
};
use std::convert::TryFrom;

pub fn serialize_custom_type(input: &CustomType) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) object-type: CustomType".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_custom_type(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: CustomType".to_string();
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_custom_type(input, &mut encoder);
    buffer
}

pub fn write_custom_type<W: Write>(input: &CustomType, writer: &mut W) {
    writer.write_map_length(35);
    writer.context().push("str", "String", "writing property");
    writer.write_string("str");
    writer.write_string(&input.str);
    writer.context().pop().expect("Failed to pop String from Context");
    writer.context().push("opt_str", "Option<String>", "writing property");
    writer.write_string("opt_str");
    writer.write_nullable_string(&input.opt_str);
    writer.context().pop().expect("Failed to pop Option<String> from Context");
    writer.context().push("u", "u32", "writing property");
    writer.write_string("u");
    writer.write_u32(input.u);
    writer.context().pop().expect("Failed to pop u32 from Context");
    writer.context().push("opt_u", "Option<u32>", "writing property");
    writer.write_string("opt_u");
    writer.write_nullable_u32(&input.opt_u);
    writer.context().pop().expect("Failed to pop Option<u32> from Context");
    writer.context().push("u8", "u8", "writing property");
    writer.write_string("u8");
    writer.write_u8(input.u8);
    writer.context().pop().expect("Failed to pop u8 from Context");
    writer.context().push("u16", "u16", "writing property");
    writer.write_string("u16");
    writer.write_u16(input.u16);
    writer.context().pop().expect("Failed to pop u16 from Context");
    writer.context().push("u32", "u32", "writing property");
    writer.write_string("u32");
    writer.write_u32(input.u32);
    writer.context().pop().expect("Failed to pop u32 from Context");
    writer.context().push("u64", "u64", "writing property");
    writer.write_string("u64");
    writer.write_u64(input.u64);
    writer.context().pop().expect("Failed to pop u64 from Context");
    writer.context().push("i", "i32", "writing property");
    writer.write_string("i");
    writer.write_i32(input.i);
    writer.context().pop().expect("Failed to pop i32 from Context");
    writer.context().push("i8", "i8", "writing property");
    writer.write_string("i8");
    writer.write_i8(input.i8);
    writer.context().pop().expect("Failed to pop i8 from Context");
    writer.context().push("i16", "i16", "writing property");
    writer.write_string("i16");
    writer.write_i16(input.i16);
    writer.context().pop().expect("Failed to pop i16 from Context");
    writer.context().push("i32", "i32", "writing property");
    writer.write_string("i32");
    writer.write_i32(input.i32);
    writer.context().pop().expect("Failed to pop i32 from Context");
    writer.context().push("i64", "i64", "writing property");
    writer.write_string("i64");
    writer.write_i64(input.i64);
    writer.context().pop().expect("Failed to pop i64 from Context");
    writer.context().push("bigint", "BigInt", "writing property");
    writer.write_string("bigint");
    writer.write_bigint(&input.bigint);
    writer.context().pop().expect("Failed to pop BigInt from Context");
    writer.context().push("opt_bigint", "Option<BigInt>", "writing property");
    writer.write_string("opt_bigint");
    writer.write_nullable_bigint(&input.opt_bigint);
    writer.context().pop().expect("Failed to pop Option<BigInt> from Context");
    writer.context().push("bytes", "Vec<u8>", "writing property");
    writer.write_string("bytes");
    writer.write_bytes(&input.bytes);
    writer.context().pop().expect("Failed to pop Vec<u8> from Context");
    writer.context().push("opt_bytes", "Option<Vec<u8>>", "writing property");
    writer.write_string("opt_bytes");
    writer.write_nullable_bytes(&input.opt_bytes);
    writer.context().pop().expect("Failed to pop Option<Vec<u8>> from Context");
    writer.context().push("boolean", "bool", "writing property");
    writer.write_string("boolean");
    writer.write_bool(input.boolean);
    writer.context().pop().expect("Failed to pop boolean from Context");
    writer.context().push("opt_boolean", "Option<bool>", "writing property");
    writer.write_string("opt_boolean");
    writer.write_nullable_bool(&input.opt_boolean);
    writer.context().pop().expect("Failed to pop Option<bool> from Context");
    writer.context().push("u_array", "Vec<u32>", "writing property");
    writer.write_string("u_array");
    writer.write_array(&input.u_array, |writer: &mut W, item1| {
        writer.write_u32(*item1);
    });
    writer.context().pop().expect("Failed to pop Vec<u32> from Context");
    writer.context().push("u_opt_array", "Option<Vec<u32>>", "writing property");
    writer.write_string("u_opt_array");
    writer.write_nullable_array(&input.u_opt_array, |writer: &mut W, item1| {
        writer.write_u32(*item1);
    });
    writer.context().pop().expect("Failed to pop Option<Vec<u32>> from Context");
    writer.context().push("opt_u_opt_array", "Option<Vec<Option<u32>>>", "writing property");
    writer.write_string("opt_u_opt_array");
    writer.write_nullable_array(&input.opt_u_opt_array, |writer: &mut W, item1| {
        writer.write_nullable_u32(item1);
    });
    writer.context().pop().expect("Failed to pop Option<Vec<Option<u32>>> from Context");
    writer.context().push("opt_string_opt_array", "Option<Vec<Option<String>>>", "writing property");
    writer.write_string("opt_string_opt_array");
    writer.write_nullable_array(&input.opt_str_opt_array, |writer: &mut W, item1| {
        writer.write_nullable_string(item1);
    });
    writer.context().pop().expect("Failed to pop Option<Vec<Option<String>>> from Context");
    writer.context().push("u_array_array", "Vec<Vec<u32>>", "writing property");
    writer.write_string("u_array_array");
    writer.write_array(&input.u_array_array, |writer: &mut W, item1| {
        writer.write_array(item1, |writer: &mut W, item2| {
            writer.write_u32(*item2);
        });
    });
    writer.context().pop().expect("Failed to pop Vec<Vec<u32>> from Context");
    writer.context().push("u_opt_array_opt_array", "Vec<Option<Vec<u64>>>", "writing property");
    writer.write_string("u_opt_array_opt_array");
    writer.write_array(&input.u_opt_array_opt_array, |writer: &mut W, item1| {
        writer.write_nullable_array(item1, |writer: &mut W, item2| {
            writer.write_u64(*item2);
        });
    });
    writer.context().pop().expect("Failed to pop Vec<Option<Vec<u64>>> from Context");
    writer.context().push("u_array_opt_array_array", "Vec<Option<Vec<Vec<u64>>>>", "writing property");
    writer.write_string("u_array_opt_array_array");
    writer.write_array(&input.u_array_opt_array_array, |writer: &mut W, item1| {
        writer.write_nullable_array(item1, |writer: &mut W, item2| {
            writer.write_array(item2, |writer: &mut W, item3| {
                writer.write_u64(*item3);
            });
        });
    });
    writer.context().pop().expect("Failed to pop Vec<Option<Vec<Vec<u64>>>> from Context");
    writer.context().push("crazy_array", "Option<Vec<Option<Vec<Vec<Option<Vec<u64>>>>>>>", "writing property");
    writer.write_string("crazy_array");
    writer.write_nullable_array(&input.crazy_array, |writer: &mut W, item1| {
        writer.write_nullable_array(item1, |writer: &mut W, item2| {
            writer.write_array(item2, |writer: &mut W, item3| {
                writer.write_nullable_array(item3, |writer: &mut W, item4| {
                    writer.write_u64(*item4);
                });
            });
        });
    });
    writer.context().pop().expect("Failed to pop Option<Vec<Option<Vec<Vec<Option<Vec<u64>>>>>>> from Context");
    writer.context().push("object", "AnotherType", "writing property");
    writer.write_string("object");
    AnotherType::write(&input.object, writer);
    writer.context().pop().expect("Failed to pop AnotherType from Context");
    writer.context().push("opt_object", "Option<AnotherType>", "writing property");
    writer.write_string("opt_object");
    if input.opt_object.is_some() {
        AnotherType::write(input.opt_object.as_ref().as_ref().unwrap(), writer);
    } else {
        writer.write_nil();
    }
    writer.context().pop().expect("Failed to pop Option<AnotherType> from Context");
    writer.context().push("object_array", "Vec<AnotherType>", "writing property");
    writer.write_string("object_array");
    writer.write_array(&input.object_array, |writer: &mut W, item1| {
        AnotherType::write(item1, writer);
    });
    writer.context().pop().expect("Failed to pop Vec<AnotherType> from Context");
    writer.context().push("opt_object_array", "Option<Vec<Option<AnotherType>>>", "writing property");
    writer.write_string("opt_object_array");
    writer.write_nullable_array(&input.opt_object_array, |writer: &mut W, item1| {
        if item1.is_some() {
            AnotherType::write(item1.as_ref().as_ref().unwrap(), writer);
        } else {
            writer.write_nil();
        }
    });
    writer.context().pop().expect("Failed to pop Option<Vec<Option<AnotherType>>> from Context");
    writer.context().push("en", "CustomEnum", "writing property");
    writer.write_string("en");
    writer.write_i32(input.en as i32);
    writer.context().pop().expect("Failed to pop CustomEnum from Context");
    writer.context().push("opt_enum", "Option<CustomEnum>", "writing property");
    writer.write_string("opt_enum");
    writer.write_nullable_i32(&Some(input.opt_enum.unwrap() as i32));
    writer.context().pop().expect("Failed to pop Option<CustomEnum> from Context");
    writer.context().push("enum_array", "Vec<CustomEnum>", "writing property");
    writer.write_string("enum_array");
    writer.write_array(&input.enum_array, |writer: &mut W, item1| {
        writer.write_i32(*item1 as i32);
    });
    writer.context().pop().expect("Failed to pop Vec<CustomEnum> from Context");
    writer.context().push("opt_enum_array", "Option<Vec<Option<CustomEnum>>>", "writing property");
    writer.write_string("opt_enum_array");
    writer.write_nullable_array(&input.opt_enum_array, |writer: &mut W, item1| {
        writer.write_i32(item1.unwrap() as i32);
    });
    writer.context().pop().expect("Failed to pop Option<Vec<Option<CustomEnum>>> from Context");
}

pub fn deserialize_custom_type(input: &[u8]) -> CustomType {
    let mut context = Context::new();
    context.description = "Deserializing object-type: CustomType".to_string();
    let mut reader = ReadDecoder::new(input, context);
    read_custom_type(&mut reader).expect("Failed to deserialize CustomType")
}

pub fn read_custom_type<R: Read>(reader: &mut R) -> Result<CustomType, String> {
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();

    let mut str = String::new();
    let mut str_set = false;
    let mut opt_str: Option<String> = None;
    let mut u: u32 = 0;
    let mut u_set = false;
    let mut opt_u: Option<u32> = None;
    let mut u8: u8 = 0;
    let mut u8_set = false;
    let mut u16: u16 = 0;
    let mut u16_set = false;
    let mut u32: u32 = 0;
    let mut u32_set = false;
    let mut u64: u64 = 0;
    let mut u64_set = false;
    let mut i: i32 = 0;
    let mut i_set = false;
    let mut i8: i8 = 0;
    let mut i8_set = false;
    let mut i16: i16 = 0;
    let mut i16_set = false;
    let mut i32: i32 = 0;
    let mut i32_set = false;
    let mut i64: i64 = 0;
    let mut i64_set = false;
    let mut bigint = BigInt::from_u16(0).unwrap_or_default();
    let mut bigint_set = false;
    let mut opt_bigint: Option<BigInt> = None;
    let mut bytes: Vec<u8> = vec![];
    let mut bytes_set = false;
    let mut opt_bytes: Option<Vec<u8>> = None;
    let mut boolean = false;
    let mut boolean_set = false;
    let mut opt_boolean: Option<bool> = None;
    let mut u_array: Vec<u32> = vec![];
    let mut u_array_set = false;
    let mut u_opt_array: Option<Vec<u32>> = None;
    let mut opt_u_opt_array: Option<Vec<Option<u32>>> = None;
    let mut opt_str_opt_array: Option<Vec<Option<String>>> = None;
    let mut u_array_array: Vec<Vec<u32>> = vec![];
    let mut u_array_array_set = false;
    let mut u_opt_array_opt_array: Vec<Option<Vec<u64>>> = vec![];
    let mut u_opt_array_opt_array_set = false;
    let mut u_array_opt_array_array: Vec<Option<Vec<Vec<u64>>>> = vec![];
    let mut u_array_opt_array_array_set = false;
    let mut crazy_array: Option<Vec<Option<Vec<Vec<Option<Vec<u64>>>>>>> = None;
    let mut object = AnotherType {
        prop: None,
        circular: Box::new(None),
    };
    let mut object_set = false;
    let mut opt_object: Option<AnotherType> = None;
    let mut object_array: Vec<AnotherType> = vec![];
    let mut object_array_set = false;
    let mut opt_object_array: Option<Vec<Option<AnotherType>>> = None;
    let mut en = CustomEnum::_MAX_;
    let mut en_set = false;
    let mut opt_enum: Option<CustomEnum> = None;
    let mut enum_array: Vec<CustomEnum> = vec![];
    let mut enum_array_set = false;
    let mut opt_enum_array: Option<Vec<Option<CustomEnum>>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "str" => {
                reader.context().push(&field, "String", "type found, reading property");
                str = reader.read_string().unwrap_or_default();
                str_set = true;
                reader.context().pop().expect("Failed to pop String from Context");
            }
            "opt_str" => {
                reader.context().push(&field, "Option<String>", "type found, reading property");
                opt_str = reader.read_nullable_string();
                reader.context().pop().expect("Failed to pop Option<String> from Context");
            }
            "u" => {
                reader.context().push(&field, "u32", "type found, reading property");
                u = reader.read_u32().unwrap_or_default();
                u_set = true;
                reader.context().pop().expect("Failed to pop u32 from Context");
            }
            "opt_u" => {
                reader.context().push(&field, "Option<u32>", "type found, reading property");
                opt_u = reader.read_nullable_u32();
                reader.context().pop().expect("Failed to pop Option<u32> from Context");
            }
            "u8" => {
                reader.context().push(&field, "u8", "type found, reading property");
                u8 = reader.read_u8().unwrap_or_default();
                u8_set = true;
                reader.context().pop().expect("Failed to pop u8 from Context");
            }
            "u16" => {
                reader.context().push(&field, "u16", "type found, reading property");
                u16 = reader.read_u16().unwrap_or_default();
                u16_set = true;
                reader.context().pop().expect("Failed to pop u16 from Context");
            }
            "u32" => {
                reader.context().push(&field, "u32", "type found, reading property");
                u32 = reader.read_u32().unwrap_or_default();
                u32_set = true;
                reader.context().pop().expect("Failed to pop u32 from Context");
            }
            "u64" => {
                reader.context().push(&field, "u64", "type found, reading property");
                u64 = reader.read_u64().unwrap_or_default();
                u64_set = true;
                reader.context().pop().expect("Failed to pop u64 from Context");
            }
            "i" => {
                reader.context().push(&field, "i32", "type found, reading property");
                i = reader.read_i32().unwrap_or_default();
                i_set = true;
                reader.context().pop().expect("Failed to pop i32 from Context");
            }
            "i8" => {
                reader.context().push(&field, "i8", "type found, reading property");
                i8 = reader.read_i8().unwrap_or_default();
                i8_set = true;
                reader.context().pop().expect("Failed to pop i8 from Context");
            }
            "i16" => {
                reader.context().push(&field, "i16", "type found, reading property");
                i16 = reader.read_i16().unwrap_or_default();
                i16_set = true;
                reader.context().pop().expect("Failed to pop i16 from Context");
            }
            "i32" => {
                reader.context().push(&field, "i32", "type found, reading property");
                i32 = reader.read_i32().unwrap_or_default();
                i32_set = true;
                reader.context().pop().expect("Failed to pop i32 from Context");
            }
            "i64" => {
                reader.context().push(&field, "i64", "type found, reading property");
                i64 = reader.read_i64().unwrap_or_default();
                i64_set = true;
                reader.context().pop().expect("Failed to pop i64 from Context");
            }
            "bigint" => {
                reader.context().push(&field, "BigInt", "type found, reading property");
                bigint = reader.read_bigint().unwrap_or_default();
                bigint_set = true;
                reader.context().pop().expect("Failed to pop BigInt from Context");
            }
            "opt_bigint" => {
                reader.context().push(&field, "Option<BigInt>", "type found, reading property");
                opt_bigint = reader.read_nullable_bigint();
                reader.context().pop().expect("Failed to pop Option<BigInt> from Context");
            }
            "bytes" => {
                reader.context().push(&field, "Vec<u8>", "type found, reading property");
                bytes = reader.read_bytes().unwrap_or_default();
                bytes_set = true;
                reader.context().pop().expect("Failed to pop Vec<u8> from Context");
            }
            "opt_bytes" => {
                reader.context().push(&field, "Option<Vec<u8>>", "type found, reading property");
                opt_bytes = reader.read_nullable_bytes();
                reader.context().pop().expect("Failed to pop Option<Vec<u8>> from Context");
            }
            "boolean" => {
                reader.context().push(&field, "bool", "type found, reading property");
                boolean = reader.read_bool().unwrap_or_default()
                boolean_set = true;
                reader.context().pop().expect("Failed to pop bool from Context");
            }
            "opt_boolean" => {
                reader.context().push(&field, "Option<bool>", "type found, reading property");
                opt_boolean = reader.read_nullable_bool();
                reader.context().pop().expect("Failed to pop Option<bool> from Context");
            }
            "u_array" => {
                reader.context().push(&field, "Vec<u32>", "type found, reading property");
                u_array = reader.read_array(|reader| {
                    reader.read_u32().unwrap_or_default()
                }).expect("Failed to read u_array");
                u_array_set = true;
                reader.context().pop().expect("Failed to pop Vec<u32> from Context");
            }
            "u_opt_array" => {
                reader.context().push(&field, "Option<Vec<u32>>", "type found, reading property");
                u_opt_array = reader.read_nullable_array(|reader| {
                    reader.read_u32().unwrap_or_default()
                });
                reader.context().pop().expect("Failed to pop Option<Vec<u32>> from Context");
            }
            "opt_u_opt_array" => {
                reader.context().push(&field, "Option<Vec<Option<u32>>>", "type found, reading property");
                opt_u_opt_array = reader.read_nullable_array(|reader| {
                    reader.read_nullable_u32()
                });
                reader.context().pop().expect("Failed to pop Option<Vec<Option<u32>>> from Context");
            }
            "opt_str_opt_array" => {
                reader.context().push(&field, "Option<Vec<Option<String>>>", "type found, reading property");
                opt_str_opt_array = reader.read_nullable_array(|reader| {
                    reader.read_nullable_string()
                });
                reader.context().pop().expect("Failed to pop Option<Vec<Option<String>>> from Context");
            }
            "u_array_array" => {
                reader.context().push(&field, "Vec<Vec<u32>>", "type found, reading property");
                u_array_array = reader.read_array(|reader| {
                    reader.read_array(|reader| {
                        reader.read_u32().unwrap_or_default()
                    }).expect("Failed to read array")
                }).expect("Failed to read array");
                u_array_array_set = true;
                reader.context().pop().expect("Failed to pop Vec<Vec<u32>> from Context");
            }
            "u_opt_array_opt_array" => {
                reader.context().push(&field, "Vec<Option<Vec<u64>>>", "type found, reading property");
                u_opt_array_opt_array = reader.read_array(|reader| {
                    reader.read_nullable_array(|reader| {
                        reader.read_u64().unwrap_or_default()
                    })
                }).expect("Failed to read array");
                u_opt_array_opt_array_set = true;
                reader.context().pop().expect("Failed to pop Vec<Option<Vec<u64>>> from Context");
            }
            "u_array_opt_array_array" => {
                reader.context().push(&field, "Vec<Option<Vec<Vec<u64>>>>", "type found, reading property");
                u_array_opt_array_array = reader.read_array(|reader| {
                    reader.read_nullable_array(|reader| {
                        reader.read_array(|reader| {
                            reader.read_u64().unwrap_or_default()
                        }).expect("Failed to read array")
                    })
                }).expect("Failed to read array");
                u_array_opt_array_array_set = true;
                reader.context().pop().expect("Failed to pop Vec<Option<Vec<Vec<u64>>>> from Context");
            }
            "crazy_array" => {
                reader.context().push(&field, "Option<Vec<Option<Vec<Vec<Option<Vec<u64>>>>>>>", "type found, reading property");
                crazy_array = reader.read_nullable_array(|reader| {
                    reader.read_nullable_array(|reader| {
                        reader.read_array(|reader| {
                            reader.read_nullable_array(|reader| {
                                reader.read_u64().unwrap_or_default()
                            })
                        }).expect("Failed to read array")
                    })
                });
                reader.context().pop().expect("Failed to pop Option<Vec<Option<Vec<Vec<Option<Vec<u64>>>>>>> from Context");
            }
            "object" => {
                reader.context().push(&field, "AnotherType", "type found, reading property");
                let obj = AnotherType::read(reader);
                object = obj;
                object_set = true;
                reader.context().pop().expect("Failed to pop AnotherType from Context");
            }
            "opt_object" => {
                reader.context().push(&field, "Option<AnotherType>", "type found, reading property");
                let mut opt_obj: Option<AnotherType> = None;
                if !reader.is_next_nil() {
                    opt_obj = Some(AnotherType::read(reader));
                }
                opt_object = opt_obj;
                reader.context().pop().expect("Failed to pop Option<AnotherType> from Context");
            }
            "object_array" => {
                reader.context().push(&field, "Vec<AnotherType>", "type found, reading property");
                object_array = reader.read_array(|reader| {
                    let obj = AnotherType::read(reader);
                    obj
                }).expect("Failed to read array");
                object_array_set = true;
                reader.context().pop().expect("Failed to pop Vec<AnotherType> from Context");
            }
            "opt_object_array" => {
                reader.context().push(&field, "Option<Vec<Option<AnotherType>>>", "type found, reading property");
                opt_object_array = reader.read_nullable_array(|reader| {
                    let mut opt_obj: Option<AnotherType> = None;
                    if !reader.is_next_nil() {
                        opt_obj = Some(AnotherType::read(reader));
                    }
                    opt_obj
                });
                reader.context().pop().expect("Failed to pop Option<Vec<Option<AnotherType>>> from Context");
            }
            "en" => {
                reader.context().push(&field, "CustomEnum", "type found, reading property");
                let mut value = CustomEnum::_MAX_;
                if reader.is_next_string() {
                    value = get_custom_enum_value(&reader.read_string().unwrap_or_default())
                        .expect("Failed to get CustomEnum value");
                } else {
                    value = CustomEnum::try_from(reader.read_i32().unwrap_or_default())
                        .expect("Failed to convert i32 to CustomEnum");
                    sanitize_custom_enum_value(value as i32)
                        .expect("Failed to sanitize CustomEnum");
                }
                en = value;
                en_set = true;
                reader.context().pop().expect("Failed to pop CustomEnum from Context");
            }
            "opt_enum" => {
                reader.context().push(&field, "Option<CustomEnum>", "type found, reading property");
                let mut value: Option<CustomEnum> = None;
                if !reader.is_next_nil() {
                    if reader.is_next_string() {
                        value = Some(get_custom_enum_value(&reader.read_string().unwrap_or_default())
                            .expect("Failed to get Option<CustomEnum> value"));
                    } else {
                        value = Some(CustomEnum::try_from(reader.read_i32().unwrap_or_default())
                            .expect("Failed to convert i32 to Option<CustomEnum>"));
                        sanitize_custom_enum_value(value.unwrap() as i32)
                            .expect("Failed to sanitize Option<CustomEnum>");
                    }
                } else {
                    value = None;
                }
                opt_enum = value;
                reader.context().pop().expect("Failed to pop Option<CustomEnum> from Context");
            }
            "en_array" => {
                reader.context().push(&field, "Vec<CustomEnum>", "type found, reading property");
                enum_array = reader.read_array(|reader| {
                    let mut value = CustomEnum::_MAX_;
                    if reader.is_next_string() {
                        value = get_custom_enum_value(&reader.read_string().unwrap_or_default())
                            .expect("Failed to get Vec<CustomEnum> value");
                    } else {
                        value = CustomEnum::try_from(reader.read_i32().unwrap_or_default())
                            .expect("Failed to convert i32 to Vec<CustomEnum>");
                        sanitize_custom_enum_value(value as i32)
                            .expect("Failed to sanitize Vec<CustomEnum>");
                    }
                    value
                }).expect("Failed to read array");
                enum_array_set = true;
                reader.context().pop().expect("Failed to pop Vec<CustomEnum> from Context");
            }
            "opt_enum_array" => {
                reader.context().push(&field, "Option<Vec<Option<CustomEnum>>>", "type found, reading property");
                opt_enum_array = reader.read_nullable_array(|reader| {
                    let mut value: Option<CustomEnum> = None;
                    if !reader.is_next_nil() {
                        if reader.is_next_string() {
                            value = Some(get_custom_enum_value(&reader.read_string().unwrap_or_default())
                                .expect("Failed to get Option<Vec<Option<CustomEnum>>> value"));
                        } else {
                            value = Some(CustomEnum::try_from(reader.read_i32().unwrap_or_default())
                                .expect("Failed to convert i32 to Option<Vec<Option<CustomEnum>>>"));
                            sanitize_custom_enum_value(value.unwrap() as i32)
                                .expect("Failed to sanitize Option<Vec<Option<CustomEnum>>>");
                        }
                    } else {
                        value = None;
                    }
                    value
                });
                reader.context().pop().expect("Failed to pop Option<Vec<Option<CustomEnum>>> from Context");
            }
            _ => {
                reader.context().push(&field, "unknown", "searching for property type");
                reader.context().pop().expect("Failed to pop unknown from Context");
            }
        }
    }
    if !str_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'str: String'");
        return Err(custom_error);
    }
    if !u_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'u: u32'");
        return Err(custom_error);
    }
    if !u8_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'u8: u8'");
        return Err(custom_error);
    }
    if !u16_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'u16: u16'");
        return Err(custom_error);
    }
    if !u32_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'u32: u32'");
        return Err(custom_error);
    }
    if !u64_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'u64: u64'");
        return Err(custom_error);
    }
    if !i_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'i: i32'");
        return Err(custom_error);
    }
    if !i8_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'i8: i8'");
        return Err(custom_error);
    }
    if !i16_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'i16: i16'");
        return Err(custom_error);
    }
    if !i32_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'i32: i32'");
        return Err(custom_error);
    }
    if !i64_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'i64: i64'");
        return Err(custom_error);
    }
    if !bigint_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'bigint: BigInt'");
        return Err(custom_error);
    }
    if !bytes_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'bytes: Vec<u8>'");
        return Err(custom_error);
    }
    if !boolean_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'boolean: bool'");
        return Err(custom_error);
    }
    if !u_array_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'u_array: Vec<u32>'");
        return Err(custom_error);
    }
    if !u_array_array_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'u_array_array: Vec<Vec<u32>>'");
        return Err(custom_error);
    }
    if !u_opt_array_opt_array_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'u_opt_array_opt_array: Vec<Option<Vec<u64>>>'");
        return Err(custom_error);
    }
    if !u_array_opt_array_array_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'u_array_opt_array_array: Vec<Option<Vec<Vec<u64>>>>'");
        return Err(custom_error);
    }
    if !object_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'object: AnotherType'");
        return Err(custom_error);
    }
    if !object_array_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'object_array: Vec<AnotherType>'");
        return Err(custom_error);
    }
    if !en_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'en: CustomEnum'");
        return Err(custom_error);
    }
    if !enum_array_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'enum_array: Vec<CustomEnum>'");
        return Err(custom_error);
    }

    Ok(CustomType {
        str,
        opt_str,
        u,
        opt_u,
        u8,
        u16,
        u32,
        u64,
        i,
        i8,
        i16,
        i32,
        i64,
        bigint,
        opt_bigint,
        bytes,
        opt_bytes,
        boolean,
        opt_boolean,
        u_array,
        u_opt_array,
        opt_u_opt_array,
        opt_str_opt_array,
        u_array_array,
        u_opt_array_opt_array,
        u_array_opt_array_array,
        crazy_array,
        object,
        opt_object,
        object_array,
        opt_object_array,
        en,
        opt_enum,
        enum_array,
        opt_enum_array,
    })
}