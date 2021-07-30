use crate::{
    get_custom_enum_value, 
    sanitize_custom_enum_value, 
    AnotherType, 
    CustomEnum, 
    CustomType,
};
use crate::{
    Context, 
    Read, 
    ReadDecoder, 
    Write, 
    WriteEncoder, 
    WriteSizer,
};
use num_bigint::BigInt;
use num_traits::cast::FromPrimitive;
use std::convert::TryFrom;

pub fn serialize_custom_type(object: &CustomType) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) object-type: CustomType".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_custom_type(object, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: CustomType".to_string();
    let mut encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
    write_custom_type(object, &mut encoder);
    buffer
}

pub fn write_custom_type<W: Write>(object: &CustomType, writer: &mut W) {
    writer.write_map_length(35);
    writer.context().push("str", "String", "writing property");
    writer.write_string("str".to_string());
    writer.write_string(object.str.to_string());
    writer
        .context()
        .pop()
        .expect("Failed to pop String from Context");
    writer
        .context()
        .push("opt_str", "Option<String>", "writing property");
    writer.write_string("opt_str".to_string());
    writer.write_nullable_string(object.opt_str.clone());
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<String> from Context");
    writer.context().push("u", "u32", "writing property");
    writer.write_string("u".to_string());
    writer.write_u32(object.u);
    writer
        .context()
        .pop()
        .expect("Failed to pop u32 from Context");
    writer
        .context()
        .push("opt_u", "Option<u32>", "writing property");
    writer.write_string("opt_u".to_string());
    writer.write_nullable_u32(object.opt_u);
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<u32> from Context");
    writer.context().push("uint8", "u8", "writing property");
    writer.write_string("uint8".to_string());
    writer.write_u8(object.uint8);
    writer
        .context()
        .pop()
        .expect("Failed to pop u8 from Context");
    writer.context().push("uint16", "u16", "writing property");
    writer.write_string("uint16".to_string());
    writer.write_u16(object.uint16);
    writer
        .context()
        .pop()
        .expect("Failed to pop u16 from Context");
    writer.context().push("uint32", "u32", "writing property");
    writer.write_string("uint32".to_string());
    writer.write_u32(object.uint32);
    writer
        .context()
        .pop()
        .expect("Failed to pop u32 from Context");
    writer.context().push("uint64", "u64", "writing property");
    writer.write_string("uint64".to_string());
    writer.write_u64(object.uint64);
    writer
        .context()
        .pop()
        .expect("Failed to pop u64 from Context");
    writer.context().push("i", "i32", "writing property");
    writer.write_string("i".to_string());
    writer.write_i32(object.i);
    writer
        .context()
        .pop()
        .expect("Failed to pop i32 from Context");
    writer.context().push("int8", "i8", "writing property");
    writer.write_string("int8".to_string());
    writer.write_i8(object.int8);
    writer
        .context()
        .pop()
        .expect("Failed to pop i8 from Context");
    writer.context().push("int16", "i16", "writing property");
    writer.write_string("int16".to_string());
    writer.write_i16(object.int16);
    writer
        .context()
        .pop()
        .expect("Failed to pop i16 from Context");
    writer.context().push("int32", "i32", "writing property");
    writer.write_string("int32".to_string());
    writer.write_i32(object.int32);
    writer
        .context()
        .pop()
        .expect("Failed to pop i32 from Context");
    writer.context().push("int64", "i64", "writing property");
    writer.write_string("int64".to_string());
    writer.write_i64(object.int64);
    writer
        .context()
        .pop()
        .expect("Failed to pop i64 from Context");
    writer
        .context()
        .push("bigint", "BigInt", "writing property");
    writer.write_string("bigint".to_string());
    writer.write_bigint(object.bigint.clone());
    writer
        .context()
        .pop()
        .expect("Failed to pop BigInt from Context");
    writer
        .context()
        .push("opt_bigint", "Option<BigInt>", "writing property");
    writer.write_string("opt_bigint".to_string());
    writer.write_nullable_bigint(object.opt_bigint.clone());
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<BigInt> from Context");
    writer
        .context()
        .push("bytes", "Vec<u8>", "writing property");
    writer.write_string("bytes".to_string());
    writer.write_bytes(object.bytes.clone());
    writer
        .context()
        .pop()
        .expect("Failed to pop Vec<u8> from Context");
    writer
        .context()
        .push("opt_bytes", "Option<Vec<u8>>", "writing property");
    writer.write_string("opt_bytes".to_string());
    writer.write_nullable_bytes(object.opt_bytes.clone());
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<Vec<u8>> from Context");
    writer.context().push("boolean", "bool", "writing property");
    writer.write_string("boolean".to_string());
    writer.write_bool(object.boolean);
    writer
        .context()
        .pop()
        .expect("Failed to pop boolean from Context");
    writer
        .context()
        .push("opt_boolean", "Option<bool>", "writing property");
    writer.write_string("opt_boolean".to_string());
    writer.write_nullable_bool(object.opt_boolean);
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<bool> from Context");
    writer
        .context()
        .push("u_array", "Vec<u32>", "writing property");
    writer.write_string("u_array".to_string());
    writer.write_array(object.u_array.as_slice(), Write::write_u32);
    writer
        .context()
        .pop()
        .expect("Failed to pop Vec<u32> from Context");
    writer
        .context()
        .push("u_opt_array", "Option<Vec<u32>>", "writing property");
    writer.write_string("u_opt_array".to_string());
    writer.write_nullable_array(object.u_opt_array.clone(), Write::write_u32);
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<Vec<u32>> from Context");
    writer.context().push(
        "opt_u_opt_array",
        "Option<Vec<Option<u32>>>",
        "writing property",
    );
    writer.write_string("opt_u_opt_array".to_string());
    writer.write_nullable_array(object.opt_u_opt_array.clone(), Write::write_nullable_u32);
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<Vec<Option<u32>>> from Context");
    writer.context().push(
        "opt_string_opt_array",
        "Option<Vec<Option<String>>>",
        "writing property",
    );
    writer.write_string("opt_string_opt_array".to_string());
    writer.write_nullable_array(
        object.opt_str_opt_array.clone(),
        Write::write_nullable_string,
    );
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<Vec<Option<String>>> from Context");
    writer
        .context()
        .push("u_array_array", "Vec<Vec<u32>>", "writing property");
    writer.write_string("u_array_array".to_string());
    writer.write_array(object.u_array_array.as_slice(), |writer: &mut W, item| {
        writer.write_array(item.as_slice(), Write::write_u32)
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Vec<Vec<u32>> from Context");
    writer.context().push(
        "u_opt_array_opt_array",
        "Vec<Option<Vec<u64>>>",
        "writing property",
    );
    writer.write_string("u_opt_array_opt_array".to_string());
    writer.write_array(
        object.u_opt_array_opt_array.as_slice(),
        |writer: &mut W, item| writer.write_nullable_array(item, Write::write_u64),
    );
    writer
        .context()
        .pop()
        .expect("Failed to pop Vec<Option<Vec<u64>>> from Context");
    writer.context().push(
        "u_array_opt_array_array",
        "Vec<Option<Vec<Vec<u64>>>>",
        "writing property",
    );
    writer.write_string("u_array_opt_array_array".to_string());
    writer.write_array(
        object.u_array_opt_array_array.as_slice(),
        |writer: &mut W, item| {
            writer.write_nullable_array(item, |writer: &mut W, item| {
                writer.write_array(item.as_slice(), Write::write_u64)
            })
        },
    );
    writer
        .context()
        .pop()
        .expect("Failed to pop Vec<Option<Vec<Vec<u64>>>> from Context");
    writer.context().push(
        "crazy_array",
        "Option<Vec<Option<Vec<Option<Vec<u64>>>>>>",
        "writing property",
    );
    writer.write_string("crazy_array".to_string());
    writer.write_nullable_array(object.crazy_array.clone(), |writer: &mut W, item| {
        writer.write_nullable_array(item, |writer: &mut W, item| {
            writer.write_nullable_array(item, Write::write_u64)
        })
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<Vec<Option<Vec<Option<Vec<u64>>>>>> from Context");
    writer
        .context()
        .push("object", "AnotherType", "writing property");
    writer.write_string("object".to_string());
    AnotherType::write(&object.object, writer);
    writer
        .context()
        .pop()
        .expect("Failed to pop AnotherType from Context");
    writer
        .context()
        .push("opt_object", "Option<AnotherType>", "writing property");
    writer.write_string("opt_object".to_string());
    if object.opt_object.is_some() {
        AnotherType::write(object.opt_object.as_ref().unwrap(), writer);
    } else {
        writer.write_nil();
    }
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<AnotherType> from Context");
    writer
        .context()
        .push("object_array", "Vec<AnotherType>", "writing property");
    writer.write_string("object_array".to_string());
    writer.write_array(object.object_array.as_slice(), |writer: &mut W, item| {
        AnotherType::write(&item, writer)
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Vec<AnotherType> from Context");
    writer.context().push(
        "opt_object_array",
        "Option<Vec<AnotherType>>",
        "writing property",
    );
    writer.write_string("opt_object_array".to_string());
    writer.write_nullable_array(object.opt_object_array.clone(), |writer: &mut W, item| {
        AnotherType::write(&item, writer)
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<Vec<AnotherType>> from Context");
    writer
        .context()
        .push("en", "CustomEnum", "writing property");
    writer.write_string("en".to_string());
    writer.write_i32(object.en as i32);
    writer
        .context()
        .pop()
        .expect("Failed to pop CustomEnum from Context");
    writer
        .context()
        .push("opt_enum", "Option<CustomEnum>", "writing property");
    writer.write_string("opt_enum".to_string());
    writer.write_nullable_i32(Some(object.opt_enum.unwrap() as i32));
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<CustomEnum> from Context");
    writer
        .context()
        .push("enum_array", "Vec<CustomEnum>", "writing property");
    writer.write_string("enum_array".to_string());
    writer.write_array(object.enum_array.as_slice(), |writer: &mut W, item| {
        writer.write_i32(item as i32)
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Vec<CustomEnum> from Context");
    writer.context().push(
        "opt_enum_array",
        "Option<Vec<CustomEnum>>",
        "writing property",
    );
    writer.write_string("opt_enum_array".to_string());
    writer.write_nullable_array(object.opt_enum_array.clone(), |writer: &mut W, item| {
        writer.write_i32(item as i32)
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<Vec<CustomEnum>> from Context");
}

pub fn deserialize_custom_type(buffer: &[u8]) -> CustomType {
    let mut context = Context::new();
    context.description = "Deserializing object-type: CustomType".to_string();
    let mut reader = ReadDecoder::new(buffer, context);
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
    let mut uint8: u8 = 0;
    let mut uint8_set = false;
    let mut uint16: u16 = 0;
    let mut uint16_set = false;
    let mut uint32: u32 = 0;
    let mut uint32_set = false;
    let mut uint64: u64 = 0;
    let mut uint64_set = false;
    let mut i: i32 = 0;
    let mut i_set = false;
    let mut int8: i8 = 0;
    let mut int8_set = false;
    let mut int16: i16 = 0;
    let mut int16_set = false;
    let mut int32: i32 = 0;
    let mut int32_set = false;
    let mut int64: i64 = 0;
    let mut int64_set = false;
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
    let mut crazy_array: Option<Vec<Option<Vec<Option<Vec<u64>>>>>> = None;
    let mut object = AnotherType {
        prop: None,
        circular: Box::new(None),
    };
    let mut object_set = false;
    let mut opt_object: Option<AnotherType> = None;
    let mut object_array: Vec<AnotherType> = vec![];
    let mut object_array_set = false;
    let mut opt_object_array: Option<Vec<AnotherType>> = None;
    let mut en = CustomEnum::_MAX_;
    let mut en_set = false;
    let mut opt_enum: Option<CustomEnum> = None;
    let mut enum_array: Vec<CustomEnum> = vec![];
    let mut enum_array_set = false;
    let mut opt_enum_array: Option<Vec<CustomEnum>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "str" => {
                reader
                    .context()
                    .push(&field, "String", "type found, reading property");
                str = reader.read_string().unwrap_or_default();
                str_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop String from Context");
            }
            "opt_str" => {
                reader
                    .context()
                    .push(&field, "Option<String>", "type found, reading property");
                opt_str = reader.read_nullable_string();
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<String> from Context");
            }
            "u" => {
                reader
                    .context()
                    .push(&field, "u32", "type found, reading property");
                u = reader.read_u32().unwrap_or_default();
                u_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop u32 from Context");
            }
            "opt_u" => {
                reader
                    .context()
                    .push(&field, "Option<u32>", "type found, reading property");
                opt_u = reader.read_nullable_u32();
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<u32> from Context");
            }
            "uint8" => {
                reader
                    .context()
                    .push(&field, "u8", "type found, reading property");
                uint8 = reader.read_u8().unwrap_or_default();
                uint8_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop u8 from Context");
            }
            "uint16" => {
                reader
                    .context()
                    .push(&field, "u16", "type found, reading property");
                uint16 = reader.read_u16().unwrap_or_default();
                uint16_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop u16 from Context");
            }
            "uint32" => {
                reader
                    .context()
                    .push(&field, "u32", "type found, reading property");
                uint32 = reader.read_u32().unwrap_or_default();
                uint32_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop u32 from Context");
            }
            "uint64" => {
                reader
                    .context()
                    .push(&field, "u64", "type found, reading property");
                uint64 = reader.read_u64().unwrap_or_default();
                uint64_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop u64 from Context");
            }
            "i" => {
                reader
                    .context()
                    .push(&field, "i32", "type found, reading property");
                i = reader.read_i32().unwrap_or_default();
                i_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop i32 from Context");
            }
            "int8" => {
                reader
                    .context()
                    .push(&field, "i8", "type found, reading property");
                int8 = reader.read_i8().unwrap_or_default();
                int8_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop i8 from Context");
            }
            "int16" => {
                reader
                    .context()
                    .push(&field, "i16", "type found, reading property");
                int16 = reader.read_i16().unwrap_or_default();
                int16_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop i16 from Context");
            }
            "int32" => {
                reader
                    .context()
                    .push(&field, "i32", "type found, reading property");
                int32 = reader.read_i32().unwrap_or_default();
                int32_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop i32 from Context");
            }
            "int64" => {
                reader
                    .context()
                    .push(&field, "i64", "type found, reading property");
                int64 = reader.read_i64().unwrap_or_default();
                int64_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop i64 from Context");
            }
            "bigint" => {
                reader
                    .context()
                    .push(&field, "BigInt", "type found, reading property");
                bigint = reader.read_bigint().unwrap_or_default();
                bigint_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop BigInt from Context");
            }
            "opt_bigint" => {
                reader
                    .context()
                    .push(&field, "Option<BigInt>", "type found, reading property");
                opt_bigint = reader.read_nullable_bigint();
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<BigInt> from Context");
            }
            "bytes" => {
                reader
                    .context()
                    .push(&field, "Vec<u8>", "type found, reading property");
                bytes = reader.read_bytes().unwrap_or_default();
                bytes_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Vec<u8> from Context");
            }
            "opt_bytes" => {
                reader
                    .context()
                    .push(&field, "Option<Vec<u8>>", "type found, reading property");
                opt_bytes = reader.read_nullable_bytes();
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<Vec<u8>> from Context");
            }
            "boolean" => {
                reader
                    .context()
                    .push(&field, "bool", "type found, reading property");
                boolean = reader.read_bool().unwrap();
                boolean_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop bool from Context");
            }
            "opt_boolean" => {
                reader
                    .context()
                    .push(&field, "Option<bool>", "type found, reading property");
                opt_boolean = reader.read_nullable_bool();
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<bool> from Context");
            }
            "u_array" => {
                reader
                    .context()
                    .push(&field, "Vec<u32>", "type found, reading property");
                u_array = reader
                    .read_array(|reader| reader.read_u32().expect("Failed to read u32"))
                    .expect("Failed to read u_array");
                u_array_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Vec<u32> from Context");
            }
            "u_opt_array" => {
                reader
                    .context()
                    .push(&field, "Option<Vec<u32>>", "type found, reading property");
                u_opt_array = reader
                    .read_nullable_array(|reader| reader.read_u32().expect("Failed to read u32"));
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<Vec<u32>> from Context");
            }
            "opt_u_opt_array" => {
                reader.context().push(
                    &field,
                    "Option<Vec<Option<u32>>>",
                    "type found, reading property",
                );
                opt_u_opt_array = reader.read_nullable_array(|reader| reader.read_nullable_u32());
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<Vec<Option<u32>>> from Context");
            }
            "opt_str_opt_array" => {
                reader.context().push(
                    &field,
                    "Option<Option<Vec<String>>>",
                    "type found, reading property",
                );
                opt_str_opt_array =
                    reader.read_nullable_array(|reader| reader.read_nullable_string());
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<Option<Vec<String>>> from Context");
            }
            "u_array_array" => {
                reader
                    .context()
                    .push(&field, "Vec<Vec<u32>>", "type found, reading property");
                u_array_array = reader
                    .read_array(|reader| {
                        reader
                            .read_array(|reader| reader.read_u32().expect("Failed to read u32"))
                            .expect("Failed to read array")
                    })
                    .expect("Failed to read array");
                u_array_array_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Vec<Vec<u32>> from Context");
            }
            "u_opt_array_opt_array" => {
                reader.context().push(
                    &field,
                    "Vec<Option<Vec<u64>>>",
                    "type found, reading property",
                );
                u_opt_array_opt_array = reader
                    .read_array(|reader| {
                        reader.read_nullable_array(|reader| {
                            reader.read_u64().expect("Failed to read u64")
                        })
                    })
                    .expect("Failed to read array");
                u_opt_array_opt_array_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Vec<Option<Vec<u64>>> from Context");
            }
            "u_array_opt_array_array" => {
                reader.context().push(
                    &field,
                    "Vec<Option<Vec<Vec<u64>>>>",
                    "type found, reading property",
                );
                u_array_opt_array_array = reader
                    .read_array(|reader| {
                        reader.read_nullable_array(|reader| {
                            reader
                                .read_array(|reader| reader.read_u64().expect("Failed to read u64"))
                                .expect("Failed to read array")
                        })
                    })
                    .expect("Failed to read array");
                u_array_opt_array_array_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Vec<Option<Vec<Vec<u64>>>> from Context");
            }
            "crazy_array" => {
                reader.context().push(
                    &field,
                    "Option<Vec<Option<Vec<Option<Vec<u64>>>>>>",
                    "type found, reading property",
                );
                crazy_array = reader.read_nullable_array(|reader| {
                    reader.read_nullable_array(|reader| {
                        reader.read_nullable_array(|reader| {
                            reader.read_u64().expect("Failed to read u64")
                        })
                    })
                });
                reader.context().pop().expect(
                    "Failed to pop Option<Vec<Option<Vec<Option<Vec<u64>>>>>> from Context",
                );
            }
            "object" => {
                reader
                    .context()
                    .push(&field, "AnotherType", "type found, reading property");
                object = AnotherType::read(reader);
                object_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop AnotherType from Context");
            }
            "opt_object" => {
                reader.context().push(
                    &field,
                    "Option<AnotherType>",
                    "type found, reading property",
                );
                if !reader.is_next_nil() {
                    opt_object = Some(AnotherType::read(reader));
                }
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<AnotherType> from Context");
            }
            "object_array" => {
                reader
                    .context()
                    .push(&field, "Vec<AnotherType>", "type found, reading property");
                object_array = reader
                    .read_array(|reader| AnotherType::read(reader))
                    .expect("Failed to read array");
                object_array_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Vec<AnotherType> from Context");
            }
            "opt_object_array" => {
                reader.context().push(
                    &field,
                    "Option<Vec<AnotherType>>",
                    "type found, reading property",
                );
                opt_object_array = reader.read_nullable_array(|reader| AnotherType::read(reader));
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<Vec<AnotherType>> from Context");
            }
            "en" => {
                reader
                    .context()
                    .push(&field, "CustomEnum", "type found, reading property");
                if reader.is_next_string() {
                    en = get_custom_enum_value(reader.read_string().unwrap_or_default().as_str())
                        .expect("Failed to get CustomEnum value");
                } else {
                    en = CustomEnum::try_from(reader.read_i32().unwrap_or_default())
                        .expect("Failed to convert i32 to CustomEnum");
                    sanitize_custom_enum_value(en as i32).expect("Failed to sanitize CustomEnum");
                }
                en_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop CustomEnum from Context");
            }
            "opt_enum" => {
                reader
                    .context()
                    .push(&field, "Option<CustomEnum>", "type found, reading property");
                if !reader.is_next_nil() {
                    if reader.is_next_string() {
                        opt_enum = Some(
                            get_custom_enum_value(
                                reader.read_string().unwrap_or_default().as_str(),
                            )
                            .expect("Failed to get Option<CustomEnum> value"),
                        );
                    } else {
                        opt_enum = Some(
                            CustomEnum::try_from(reader.read_i32().unwrap_or_default())
                                .expect("Failed to convert i32 to Option<CustomEnum>"),
                        );
                        sanitize_custom_enum_value(opt_enum.unwrap() as i32)
                            .expect("Failed to sanitize Option<CustomEnum>");
                    }
                } else {
                    opt_enum = None;
                }
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<CustomEnum> from Context");
            }
            "en_array" => {
                reader
                    .context()
                    .push(&field, "Vec<CustomEnum>", "type found, reading property");
                enum_array = reader
                    .read_array(|reader| {
                        let mut value = CustomEnum::_MAX_;
                        if reader.is_next_string() {
                            value = get_custom_enum_value(
                                reader.read_string().unwrap_or_default().as_str(),
                            )
                            .expect("Failed to get Vec<CustomEnum> value");
                        } else {
                            value = CustomEnum::try_from(reader.read_i32().unwrap_or_default())
                                .expect("Failed to convert i32 to Vec<CustomEnum>");
                            sanitize_custom_enum_value(value as i32)
                                .expect("Failed to sanitize Vec<CustomEnum>");
                        }
                        value
                    })
                    .expect("Failed to read array");
                enum_array_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Vec<CustomEnum> from Context");
            }
            "opt_enum_array" => {
                reader.context().push(
                    &field,
                    "Option<Vec<CustomEnum>>",
                    "type found, reading property",
                );
                opt_enum_array = reader.read_nullable_array(|reader| {
                    let mut value = CustomEnum::_MAX_;
                    if reader.is_next_string() {
                        value = get_custom_enum_value(
                            reader.read_string().unwrap_or_default().as_str(),
                        )
                        .expect("Failed to get Option<Vec<CustomEnum>> value");
                    } else {
                        value = CustomEnum::try_from(reader.read_i32().unwrap_or_default())
                            .expect("Failed to convert i32 to Option<Vec<CustomEnum>>");
                        sanitize_custom_enum_value(value as i32)
                            .expect("Failed to sanitize Option<Vec<CustomEnum>>");
                    }
                    value
                });
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<Vec<CustomEnum>> from Context");
            }
            _ => {
                reader
                    .context()
                    .push(&field, "unknown", "searching for property type");
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop unknown object from Context");
            }
        }
    }

    if !str_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'string: String'");
        return Err(custom_error);
    }
    if !u_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'u: u32'");
        return Err(custom_error);
    }
    if !uint8_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'uint8: u8'");
        return Err(custom_error);
    }
    if !uint16_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'uint16: u16'");
        return Err(custom_error);
    }
    if !uint32_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'uint32: u32'");
        return Err(custom_error);
    }
    if !uint64_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'uint64: u64'");
        return Err(custom_error);
    }
    if !i_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'i: i32'");
        return Err(custom_error);
    }
    if !int8_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'int8: i8'");
        return Err(custom_error);
    }
    if !int16_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'int16: i16'");
        return Err(custom_error);
    }
    if !int32_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'int32: i32'");
        return Err(custom_error);
    }
    if !int64_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'int64: i64'");
        return Err(custom_error);
    }
    if !bigint_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'bigint: BigInt'");
        return Err(custom_error);
    }
    if !bytes_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'bytes: Vec<u8>'");
        return Err(custom_error);
    }
    if !boolean_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'boolean: bool'");
        return Err(custom_error);
    }
    if !u_array_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'u_array: Vec<u32>'");
        return Err(custom_error);
    }
    if !u_array_array_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'u_array_array: Vec<Vec<u32>>'");
        return Err(custom_error);
    }
    if !u_opt_array_opt_array_set {
        let custom_error = reader.context().print_with_context(
            "Missing required property: 'u_opt_array_opt_array: Vec<Option<Vec<u64>>>'",
        );
        return Err(custom_error);
    }
    if !u_array_opt_array_array_set {
        let custom_error = reader.context().print_with_context(
            "Missing required property: 'u_array_opt_array_array_set: Vec<Option<Vec<Vec<u64>>>>'",
        );
        return Err(custom_error);
    }
    if !object_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'object: AnotherType'");
        return Err(custom_error);
    }
    if !object_array_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'object_array: Vec<AnotherType>'");
        return Err(custom_error);
    }
    if !en_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'en: CustomEnum'");
        return Err(custom_error);
    }
    if !enum_array_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'enum_array: Vec<CustomEnum>'");
        return Err(custom_error);
    }

    Ok(CustomType {
        str,
        opt_str,
        u,
        opt_u,
        uint8,
        uint16,
        uint32,
        uint64,
        i,
        int8,
        int16,
        int32,
        int64,
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
