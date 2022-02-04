use std::convert::TryFrom;
use polywrap_wasm_rs::{
    BigInt,
    Context,
    DecodeError,
    EncodeError,
    Read,
    ReadDecoder,
    Write,
    WriteEncoder,
    WriteSizer,
    JSON
};
use crate::CustomType;

use crate::AnotherType;
use crate::{
    CustomEnum,
    get_custom_enum_value,
    sanitize_custom_enum_value
};

pub fn serialize_custom_type(input: &CustomType) -> Result<Vec<u8>, EncodeError> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) object-type: CustomType".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_custom_type(input, &mut sizer)?;
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: CustomType".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_custom_type(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_custom_type<W: Write>(input: &CustomType, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&35)?;
    writer.context().push("str", "String", "writing property");
    writer.write_str("str")?;
    writer.write_string(&input.str)?;
    writer.context().pop();
    writer.context().push("opt_str", "Option<String>", "writing property");
    writer.write_str("opt_str")?;
    writer.write_nullable_string(&input.opt_str)?;
    writer.context().pop();
    writer.context().push("u", "u32", "writing property");
    writer.write_str("u")?;
    writer.write_u32(&input.u)?;
    writer.context().pop();
    writer.context().push("opt_u", "Option<u32>", "writing property");
    writer.write_str("opt_u")?;
    writer.write_nullable_u32(&input.opt_u)?;
    writer.context().pop();
    writer.context().push("u8", "u8", "writing property");
    writer.write_str("u8")?;
    writer.write_u8(&input.u8)?;
    writer.context().pop();
    writer.context().push("u16", "u16", "writing property");
    writer.write_str("u16")?;
    writer.write_u16(&input.u16)?;
    writer.context().pop();
    writer.context().push("u32", "u32", "writing property");
    writer.write_str("u32")?;
    writer.write_u32(&input.u32)?;
    writer.context().pop();
    writer.context().push("i", "i32", "writing property");
    writer.write_str("i")?;
    writer.write_i32(&input.i)?;
    writer.context().pop();
    writer.context().push("i8", "i8", "writing property");
    writer.write_str("i8")?;
    writer.write_i8(&input.i8)?;
    writer.context().pop();
    writer.context().push("i16", "i16", "writing property");
    writer.write_str("i16")?;
    writer.write_i16(&input.i16)?;
    writer.context().pop();
    writer.context().push("i32", "i32", "writing property");
    writer.write_str("i32")?;
    writer.write_i32(&input.i32)?;
    writer.context().pop();
    writer.context().push("bigint", "BigInt", "writing property");
    writer.write_str("bigint")?;
    writer.write_bigint(&input.bigint)?;
    writer.context().pop();
    writer.context().push("opt_bigint", "Option<BigInt>", "writing property");
    writer.write_str("opt_bigint")?;
    writer.write_nullable_bigint(&input.opt_bigint)?;
    writer.context().pop();
    writer.context().push("json", "JSON::Value", "writing property");
    writer.write_str("json")?;
    writer.write_json(&input.json)?;
    writer.context().pop();
    writer.context().push("opt_json", "Option<JSON::Value>", "writing property");
    writer.write_str("opt_json")?;
    writer.write_nullable_json(&input.opt_json)?;
    writer.context().pop();
    writer.context().push("bytes", "Vec<u8>", "writing property");
    writer.write_str("bytes")?;
    writer.write_bytes(&input.bytes)?;
    writer.context().pop();
    writer.context().push("opt_bytes", "Option<Vec<u8>>", "writing property");
    writer.write_str("opt_bytes")?;
    writer.write_nullable_bytes(&input.opt_bytes)?;
    writer.context().pop();
    writer.context().push("boolean", "bool", "writing property");
    writer.write_str("boolean")?;
    writer.write_bool(&input.boolean)?;
    writer.context().pop();
    writer.context().push("opt_boolean", "Option<bool>", "writing property");
    writer.write_str("opt_boolean")?;
    writer.write_nullable_bool(&input.opt_boolean)?;
    writer.context().pop();
    writer.context().push("u_array", "Vec<u32>", "writing property");
    writer.write_str("u_array")?;
    writer.write_array(&input.u_array, |writer: &mut W, item| {
        writer.write_u32(item)
    })?;
    writer.context().pop();
    writer.context().push("u_opt_array", "Option<Vec<u32>>", "writing property");
    writer.write_str("u_opt_array")?;
    writer.write_nullable_array(&input.u_opt_array, |writer: &mut W, item| {
        writer.write_u32(item)
    })?;
    writer.context().pop();
    writer.context().push("opt_u_opt_array", "Option<Vec<Option<u32>>>", "writing property");
    writer.write_str("opt_u_opt_array")?;
    writer.write_nullable_array(&input.opt_u_opt_array, |writer: &mut W, item| {
        writer.write_nullable_u32(item)
    })?;
    writer.context().pop();
    writer.context().push("opt_str_opt_array", "Option<Vec<Option<String>>>", "writing property");
    writer.write_str("opt_str_opt_array")?;
    writer.write_nullable_array(&input.opt_str_opt_array, |writer: &mut W, item| {
        writer.write_nullable_string(item)
    })?;
    writer.context().pop();
    writer.context().push("u_array_array", "Vec<Vec<u32>>", "writing property");
    writer.write_str("u_array_array")?;
    writer.write_array(&input.u_array_array, |writer: &mut W, item| {
        writer.write_array(item, |writer: &mut W, item| {
            writer.write_u32(item)
        })
    })?;
    writer.context().pop();
    writer.context().push("u_opt_array_opt_array", "Vec<Option<Vec<Option<u32>>>>", "writing property");
    writer.write_str("u_opt_array_opt_array")?;
    writer.write_array(&input.u_opt_array_opt_array, |writer: &mut W, item| {
        writer.write_nullable_array(item, |writer: &mut W, item| {
            writer.write_nullable_u32(item)
        })
    })?;
    writer.context().pop();
    writer.context().push("u_array_opt_array_array", "Vec<Option<Vec<Vec<u32>>>>", "writing property");
    writer.write_str("u_array_opt_array_array")?;
    writer.write_array(&input.u_array_opt_array_array, |writer: &mut W, item| {
        writer.write_nullable_array(item, |writer: &mut W, item| {
            writer.write_array(item, |writer: &mut W, item| {
                writer.write_u32(item)
            })
        })
    })?;
    writer.context().pop();
    writer.context().push("crazy_array", "Option<Vec<Option<Vec<Vec<Option<Vec<u32>>>>>>>", "writing property");
    writer.write_str("crazy_array")?;
    writer.write_nullable_array(&input.crazy_array, |writer: &mut W, item| {
        writer.write_nullable_array(item, |writer: &mut W, item| {
            writer.write_array(item, |writer: &mut W, item| {
                writer.write_nullable_array(item, |writer: &mut W, item| {
                    writer.write_u32(item)
                })
            })
        })
    })?;
    writer.context().pop();
    writer.context().push("object", "AnotherType", "writing property");
    writer.write_str("object")?;
    AnotherType::write(&input.object, writer)?;
    writer.context().pop();
    writer.context().push("opt_object", "Option<AnotherType>", "writing property");
    writer.write_str("opt_object")?;
    if input.opt_object.is_some() {
        AnotherType::write(input.opt_object.as_ref().as_ref().unwrap(), writer)?;
    } else {
        writer.write_nil()?;
    }
    writer.context().pop();
    writer.context().push("object_array", "Vec<AnotherType>", "writing property");
    writer.write_str("object_array")?;
    writer.write_array(&input.object_array, |writer: &mut W, item| {
        AnotherType::write(item, writer)
    })?;
    writer.context().pop();
    writer.context().push("opt_object_array", "Option<Vec<Option<AnotherType>>>", "writing property");
    writer.write_str("opt_object_array")?;
    writer.write_nullable_array(&input.opt_object_array, |writer: &mut W, item| {
        if item.is_some() {
            AnotherType::write(item.as_ref().as_ref().unwrap(), writer)
        } else {
            writer.write_nil()
        }
    })?;
    writer.context().pop();
    writer.context().push("en", "CustomEnum", "writing property");
    writer.write_str("en")?;
    writer.write_i32(&(input.en as i32))?;
    writer.context().pop();
    writer.context().push("opt_enum", "Option<CustomEnum>", "writing property");
    writer.write_str("opt_enum")?;
    writer.write_nullable_i32(&input.opt_enum.map(|f| f as i32))?;
    writer.context().pop();
    writer.context().push("enum_array", "Vec<CustomEnum>", "writing property");
    writer.write_str("enum_array")?;
    writer.write_array(&input.enum_array, |writer: &mut W, item| {
        writer.write_i32(&(*item as i32))
    })?;
    writer.context().pop();
    writer.context().push("opt_enum_array", "Option<Vec<Option<CustomEnum>>>", "writing property");
    writer.write_str("opt_enum_array")?;
    writer.write_nullable_array(&input.opt_enum_array, |writer: &mut W, item| {
        writer.write_nullable_i32(&item.map(|f| f as i32))
    })?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_custom_type(input: &[u8]) -> Result<CustomType, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing object-type: CustomType".to_string();
    let mut reader = ReadDecoder::new(input, context);
    read_custom_type(&mut reader)
}

pub fn read_custom_type<R: Read>(reader: &mut R) -> Result<CustomType, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;

    let mut _str: String = String::new();
    let mut _str_set = false;
    let mut _opt_str: Option<String> = None;
    let mut _u: u32 = 0;
    let mut _u_set = false;
    let mut _opt_u: Option<u32> = None;
    let mut _u8: u8 = 0;
    let mut _u8_set = false;
    let mut _u16: u16 = 0;
    let mut _u16_set = false;
    let mut _u32: u32 = 0;
    let mut _u32_set = false;
    let mut _i: i32 = 0;
    let mut _i_set = false;
    let mut _i8: i8 = 0;
    let mut _i8_set = false;
    let mut _i16: i16 = 0;
    let mut _i16_set = false;
    let mut _i32: i32 = 0;
    let mut _i32_set = false;
    let mut _bigint: BigInt = BigInt::default();
    let mut _bigint_set = false;
    let mut _opt_bigint: Option<BigInt> = None;
    let mut _json: JSON::Value = JSON::Value::Null;
    let mut _json_set = false;
    let mut _opt_json: Option<JSON::Value> = None;
    let mut _bytes: Vec<u8> = vec![];
    let mut _bytes_set = false;
    let mut _opt_bytes: Option<Vec<u8>> = None;
    let mut _boolean: bool = false;
    let mut _boolean_set = false;
    let mut _opt_boolean: Option<bool> = None;
    let mut _u_array: Vec<u32> = vec![];
    let mut _u_array_set = false;
    let mut _u_opt_array: Option<Vec<u32>> = None;
    let mut _opt_u_opt_array: Option<Vec<Option<u32>>> = None;
    let mut _opt_str_opt_array: Option<Vec<Option<String>>> = None;
    let mut _u_array_array: Vec<Vec<u32>> = vec![];
    let mut _u_array_array_set = false;
    let mut _u_opt_array_opt_array: Vec<Option<Vec<Option<u32>>>> = vec![];
    let mut _u_opt_array_opt_array_set = false;
    let mut _u_array_opt_array_array: Vec<Option<Vec<Vec<u32>>>> = vec![];
    let mut _u_array_opt_array_array_set = false;
    let mut _crazy_array: Option<Vec<Option<Vec<Vec<Option<Vec<u32>>>>>>> = None;
    let mut _object: AnotherType = AnotherType::new();
    let mut _object_set = false;
    let mut _opt_object: Option<AnotherType> = None;
    let mut _object_array: Vec<AnotherType> = vec![];
    let mut _object_array_set = false;
    let mut _opt_object_array: Option<Vec<Option<AnotherType>>> = None;
    let mut _en: CustomEnum = CustomEnum::_MAX_;
    let mut _en_set = false;
    let mut _opt_enum: Option<CustomEnum> = None;
    let mut _enum_array: Vec<CustomEnum> = vec![];
    let mut _enum_array_set = false;
    let mut _opt_enum_array: Option<Vec<Option<CustomEnum>>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "str" => {
                reader.context().push(&field, "String", "type found, reading property");
                _str = reader.read_string()?;
                _str_set = true;
                reader.context().pop();
            }
            "opt_str" => {
                reader.context().push(&field, "Option<String>", "type found, reading property");
                _opt_str = reader.read_nullable_string()?;
                reader.context().pop();
            }
            "u" => {
                reader.context().push(&field, "u32", "type found, reading property");
                _u = reader.read_u32()?;
                _u_set = true;
                reader.context().pop();
            }
            "opt_u" => {
                reader.context().push(&field, "Option<u32>", "type found, reading property");
                _opt_u = reader.read_nullable_u32()?;
                reader.context().pop();
            }
            "u8" => {
                reader.context().push(&field, "u8", "type found, reading property");
                _u8 = reader.read_u8()?;
                _u8_set = true;
                reader.context().pop();
            }
            "u16" => {
                reader.context().push(&field, "u16", "type found, reading property");
                _u16 = reader.read_u16()?;
                _u16_set = true;
                reader.context().pop();
            }
            "u32" => {
                reader.context().push(&field, "u32", "type found, reading property");
                _u32 = reader.read_u32()?;
                _u32_set = true;
                reader.context().pop();
            }
            "i" => {
                reader.context().push(&field, "i32", "type found, reading property");
                _i = reader.read_i32()?;
                _i_set = true;
                reader.context().pop();
            }
            "i8" => {
                reader.context().push(&field, "i8", "type found, reading property");
                _i8 = reader.read_i8()?;
                _i8_set = true;
                reader.context().pop();
            }
            "i16" => {
                reader.context().push(&field, "i16", "type found, reading property");
                _i16 = reader.read_i16()?;
                _i16_set = true;
                reader.context().pop();
            }
            "i32" => {
                reader.context().push(&field, "i32", "type found, reading property");
                _i32 = reader.read_i32()?;
                _i32_set = true;
                reader.context().pop();
            }
            "bigint" => {
                reader.context().push(&field, "BigInt", "type found, reading property");
                _bigint = reader.read_bigint()?;
                _bigint_set = true;
                reader.context().pop();
            }
            "opt_bigint" => {
                reader.context().push(&field, "Option<BigInt>", "type found, reading property");
                _opt_bigint = reader.read_nullable_bigint()?;
                reader.context().pop();
            }
            "json" => {
                reader.context().push(&field, "JSON::Value", "type found, reading property");
                _json = reader.read_json()?;
                _json_set = true;
                reader.context().pop();
            }
            "opt_json" => {
                reader.context().push(&field, "Option<JSON::Value>", "type found, reading property");
                _opt_json = reader.read_nullable_json()?;
                reader.context().pop();
            }
            "bytes" => {
                reader.context().push(&field, "Vec<u8>", "type found, reading property");
                _bytes = reader.read_bytes()?;
                _bytes_set = true;
                reader.context().pop();
            }
            "opt_bytes" => {
                reader.context().push(&field, "Option<Vec<u8>>", "type found, reading property");
                _opt_bytes = reader.read_nullable_bytes()?;
                reader.context().pop();
            }
            "boolean" => {
                reader.context().push(&field, "bool", "type found, reading property");
                _boolean = reader.read_bool()?;
                _boolean_set = true;
                reader.context().pop();
            }
            "opt_boolean" => {
                reader.context().push(&field, "Option<bool>", "type found, reading property");
                _opt_boolean = reader.read_nullable_bool()?;
                reader.context().pop();
            }
            "u_array" => {
                reader.context().push(&field, "Vec<u32>", "type found, reading property");
                _u_array = reader.read_array(|reader| {
                    reader.read_u32()
                })?;
                _u_array_set = true;
                reader.context().pop();
            }
            "u_opt_array" => {
                reader.context().push(&field, "Option<Vec<u32>>", "type found, reading property");
                _u_opt_array = reader.read_nullable_array(|reader| {
                    reader.read_u32()
                })?;
                reader.context().pop();
            }
            "opt_u_opt_array" => {
                reader.context().push(&field, "Option<Vec<Option<u32>>>", "type found, reading property");
                _opt_u_opt_array = reader.read_nullable_array(|reader| {
                    reader.read_nullable_u32()
                })?;
                reader.context().pop();
            }
            "opt_str_opt_array" => {
                reader.context().push(&field, "Option<Vec<Option<String>>>", "type found, reading property");
                _opt_str_opt_array = reader.read_nullable_array(|reader| {
                    reader.read_nullable_string()
                })?;
                reader.context().pop();
            }
            "u_array_array" => {
                reader.context().push(&field, "Vec<Vec<u32>>", "type found, reading property");
                _u_array_array = reader.read_array(|reader| {
                    reader.read_array(|reader| {
                        reader.read_u32()
                    })
                })?;
                _u_array_array_set = true;
                reader.context().pop();
            }
            "u_opt_array_opt_array" => {
                reader.context().push(&field, "Vec<Option<Vec<Option<u32>>>>", "type found, reading property");
                _u_opt_array_opt_array = reader.read_array(|reader| {
                    reader.read_nullable_array(|reader| {
                        reader.read_nullable_u32()
                    })
                })?;
                _u_opt_array_opt_array_set = true;
                reader.context().pop();
            }
            "u_array_opt_array_array" => {
                reader.context().push(&field, "Vec<Option<Vec<Vec<u32>>>>", "type found, reading property");
                _u_array_opt_array_array = reader.read_array(|reader| {
                    reader.read_nullable_array(|reader| {
                        reader.read_array(|reader| {
                            reader.read_u32()
                        })
                    })
                })?;
                _u_array_opt_array_array_set = true;
                reader.context().pop();
            }
            "crazy_array" => {
                reader.context().push(&field, "Option<Vec<Option<Vec<Vec<Option<Vec<u32>>>>>>>", "type found, reading property");
                _crazy_array = reader.read_nullable_array(|reader| {
                    reader.read_nullable_array(|reader| {
                        reader.read_array(|reader| {
                            reader.read_nullable_array(|reader| {
                                reader.read_u32()
                            })
                        })
                    })
                })?;
                reader.context().pop();
            }
            "object" => {
                reader.context().push(&field, "AnotherType", "type found, reading property");
                let object = AnotherType::read(reader)?;
                _object = object;
                _object_set = true;
                reader.context().pop();
            }
            "opt_object" => {
                reader.context().push(&field, "Option<AnotherType>", "type found, reading property");
                let mut object: Option<AnotherType> = None;
                if !reader.is_next_nil()? {
                    object = Some(AnotherType::read(reader)?);
                }
                _opt_object = object;
                reader.context().pop();
            }
            "object_array" => {
                reader.context().push(&field, "Vec<AnotherType>", "type found, reading property");
                _object_array = reader.read_array(|reader| {
                    let object = AnotherType::read(reader)?;
                    return Ok(object);
                })?;
                _object_array_set = true;
                reader.context().pop();
            }
            "opt_object_array" => {
                reader.context().push(&field, "Option<Vec<Option<AnotherType>>>", "type found, reading property");
                _opt_object_array = reader.read_nullable_array(|reader| {
                    let mut object: Option<AnotherType> = None;
                    if !reader.is_next_nil()? {
                        object = Some(AnotherType::read(reader)?);
                    }
                    return Ok(object);
                })?;
                reader.context().pop();
            }
            "en" => {
                reader.context().push(&field, "CustomEnum", "type found, reading property");
                let mut value = CustomEnum::_MAX_;
                if reader.is_next_string()? {
                    value = get_custom_enum_value(&reader.read_string()?)?;
                } else {
                    value = CustomEnum::try_from(reader.read_i32()?)?;
                    sanitize_custom_enum_value(value as i32)?;
                }
                _en = value;
                _en_set = true;
                reader.context().pop();
            }
            "opt_enum" => {
                reader.context().push(&field, "Option<CustomEnum>", "type found, reading property");
                let mut value: Option<CustomEnum> = None;
                if !reader.is_next_nil()? {
                    if reader.is_next_string()? {
                        value = Some(get_custom_enum_value(&reader.read_string()?)?);
                    } else {
                        value = Some(CustomEnum::try_from(reader.read_i32()?)?);
                        sanitize_custom_enum_value(value.unwrap() as i32)?;
                    }
                } else {
                    value = None;
                }
                _opt_enum = value;
                reader.context().pop();
            }
            "enum_array" => {
                reader.context().push(&field, "Vec<CustomEnum>", "type found, reading property");
                _enum_array = reader.read_array(|reader| {
                    let mut value = CustomEnum::_MAX_;
                    if reader.is_next_string()? {
                        value = get_custom_enum_value(&reader.read_string()?)?;
                    } else {
                        value = CustomEnum::try_from(reader.read_i32()?)?;
                        sanitize_custom_enum_value(value as i32)?;
                    }
                    return Ok(value);
                })?;
                _enum_array_set = true;
                reader.context().pop();
            }
            "opt_enum_array" => {
                reader.context().push(&field, "Option<Vec<Option<CustomEnum>>>", "type found, reading property");
                _opt_enum_array = reader.read_nullable_array(|reader| {
                    let mut value: Option<CustomEnum> = None;
                    if !reader.is_next_nil()? {
                        if reader.is_next_string()? {
                            value = Some(get_custom_enum_value(&reader.read_string()?)?);
                        } else {
                            value = Some(CustomEnum::try_from(reader.read_i32()?)?);
                            sanitize_custom_enum_value(value.unwrap() as i32)?;
                        }
                    } else {
                        value = None;
                    }
                    return Ok(value);
                })?;
                reader.context().pop();
            }
            _ => {}
        }
    }
    if !_str_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'str: String'")));
    }
    if !_u_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'u: UInt'")));
    }
    if !_u8_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'u8: UInt8'")));
    }
    if !_u16_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'u16: UInt16'")));
    }
    if !_u32_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'u32: UInt32'")));
    }
    if !_i_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'i: Int'")));
    }
    if !_i8_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'i8: Int8'")));
    }
    if !_i16_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'i16: Int16'")));
    }
    if !_i32_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'i32: Int32'")));
    }
    if !_bigint_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'bigint: BigInt'")));
    }
    if !_json_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'json: JSON'")));
    }
    if !_bytes_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'bytes: Bytes'")));
    }
    if !_boolean_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'boolean: Boolean'")));
    }
    if !_u_array_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'uArray: [UInt]'")));
    }
    if !_u_array_array_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'uArrayArray: [[UInt]]'")));
    }
    if !_u_opt_array_opt_array_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'uOptArrayOptArray: [[UInt32]]'")));
    }
    if !_u_array_opt_array_array_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'uArrayOptArrayArray: [[[UInt32]]]'")));
    }
    if !_object_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'object: AnotherType'")));
    }
    if !_object_array_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'objectArray: [AnotherType]'")));
    }
    if !_en_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'en: CustomEnum'")));
    }
    if !_enum_array_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'enumArray: [CustomEnum]'")));
    }

    Ok(CustomType {
        str: _str,
        opt_str: _opt_str,
        u: _u,
        opt_u: _opt_u,
        u8: _u8,
        u16: _u16,
        u32: _u32,
        i: _i,
        i8: _i8,
        i16: _i16,
        i32: _i32,
        bigint: _bigint,
        opt_bigint: _opt_bigint,
        json: _json,
        opt_json: _opt_json,
        bytes: _bytes,
        opt_bytes: _opt_bytes,
        boolean: _boolean,
        opt_boolean: _opt_boolean,
        u_array: _u_array,
        u_opt_array: _u_opt_array,
        opt_u_opt_array: _opt_u_opt_array,
        opt_str_opt_array: _opt_str_opt_array,
        u_array_array: _u_array_array,
        u_opt_array_opt_array: _u_opt_array_opt_array,
        u_array_opt_array_array: _u_array_opt_array_array,
        crazy_array: _crazy_array,
        object: _object,
        opt_object: _opt_object,
        object_array: _object_array,
        opt_object_array: _opt_object_array,
        en: _en,
        opt_enum: _opt_enum,
        enum_array: _enum_array,
        opt_enum_array: _opt_enum_array,
    })
}
