use std::convert::TryFrom;
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
    Context,
    DecodeError,
    EncodeError,
    Read,
    ReadDecoder,
    Write,
    WriteEncoder,
    JSON,
};
use crate::CustomType;

use crate::AnotherType;
use crate::{
    CustomEnum,
    get_custom_enum_value,
    sanitize_custom_enum_value
};

pub fn serialize_custom_type(args: &CustomType) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: CustomType".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_custom_type(args, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_custom_type<W: Write>(args: &CustomType, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&37)?;
    writer.context().push("str", "String", "writing property");
    writer.write_string("str")?;
    writer.write_string(&args.str)?;
    writer.context().pop();
    writer.context().push("optStr", "Option<String>", "writing property");
    writer.write_string("optStr")?;
    writer.write_optional_string(&args.opt_str)?;
    writer.context().pop();
    writer.context().push("u", "u32", "writing property");
    writer.write_string("u")?;
    writer.write_u32(&args.u)?;
    writer.context().pop();
    writer.context().push("optU", "Option<u32>", "writing property");
    writer.write_string("optU")?;
    writer.write_optional_u32(&args.opt_u)?;
    writer.context().pop();
    writer.context().push("u8", "u8", "writing property");
    writer.write_string("u8")?;
    writer.write_u8(&args.u8)?;
    writer.context().pop();
    writer.context().push("u16", "u16", "writing property");
    writer.write_string("u16")?;
    writer.write_u16(&args.u16)?;
    writer.context().pop();
    writer.context().push("u32", "u32", "writing property");
    writer.write_string("u32")?;
    writer.write_u32(&args.u32)?;
    writer.context().pop();
    writer.context().push("i", "i32", "writing property");
    writer.write_string("i")?;
    writer.write_i32(&args.i)?;
    writer.context().pop();
    writer.context().push("i8", "i8", "writing property");
    writer.write_string("i8")?;
    writer.write_i8(&args.i8)?;
    writer.context().pop();
    writer.context().push("i16", "i16", "writing property");
    writer.write_string("i16")?;
    writer.write_i16(&args.i16)?;
    writer.context().pop();
    writer.context().push("i32", "i32", "writing property");
    writer.write_string("i32")?;
    writer.write_i32(&args.i32)?;
    writer.context().pop();
    writer.context().push("bigint", "BigInt", "writing property");
    writer.write_string("bigint")?;
    writer.write_bigint(&args.bigint)?;
    writer.context().pop();
    writer.context().push("optBigint", "Option<BigInt>", "writing property");
    writer.write_string("optBigint")?;
    writer.write_optional_bigint(&args.opt_bigint)?;
    writer.context().pop();
    writer.context().push("bignumber", "BigNumber", "writing property");
    writer.write_string("bignumber")?;
    writer.write_bignumber(&args.bignumber)?;
    writer.context().pop();
    writer.context().push("optBignumber", "Option<BigNumber>", "writing property");
    writer.write_string("optBignumber")?;
    writer.write_optional_bignumber(&args.opt_bignumber)?;
    writer.context().pop();
    writer.context().push("json", "JSON::Value", "writing property");
    writer.write_string("json")?;
    writer.write_json(&args.json)?;
    writer.context().pop();
    writer.context().push("optJson", "Option<JSON::Value>", "writing property");
    writer.write_string("optJson")?;
    writer.write_optional_json(&args.opt_json)?;
    writer.context().pop();
    writer.context().push("bytes", "Vec<u8>", "writing property");
    writer.write_string("bytes")?;
    writer.write_bytes(&args.bytes)?;
    writer.context().pop();
    writer.context().push("optBytes", "Option<Vec<u8>>", "writing property");
    writer.write_string("optBytes")?;
    writer.write_optional_bytes(&args.opt_bytes)?;
    writer.context().pop();
    writer.context().push("boolean", "bool", "writing property");
    writer.write_string("boolean")?;
    writer.write_bool(&args.boolean)?;
    writer.context().pop();
    writer.context().push("optBoolean", "Option<bool>", "writing property");
    writer.write_string("optBoolean")?;
    writer.write_optional_bool(&args.opt_boolean)?;
    writer.context().pop();
    writer.context().push("uArray", "Vec<u32>", "writing property");
    writer.write_string("uArray")?;
    writer.write_array(&args.u_array, |writer, item| {
        writer.write_u32(item)
    })?;
    writer.context().pop();
    writer.context().push("uOptArray", "Option<Vec<u32>>", "writing property");
    writer.write_string("uOptArray")?;
    writer.write_optional_array(&args.u_opt_array, |writer, item| {
        writer.write_u32(item)
    })?;
    writer.context().pop();
    writer.context().push("optUOptArray", "Option<Vec<Option<u32>>>", "writing property");
    writer.write_string("optUOptArray")?;
    writer.write_optional_array(&args.opt_u_opt_array, |writer, item| {
        writer.write_optional_u32(item)
    })?;
    writer.context().pop();
    writer.context().push("optStrOptArray", "Option<Vec<Option<String>>>", "writing property");
    writer.write_string("optStrOptArray")?;
    writer.write_optional_array(&args.opt_str_opt_array, |writer, item| {
        writer.write_optional_string(item)
    })?;
    writer.context().pop();
    writer.context().push("uArrayArray", "Vec<Vec<u32>>", "writing property");
    writer.write_string("uArrayArray")?;
    writer.write_array(&args.u_array_array, |writer, item| {
        writer.write_array(item, |writer, item| {
            writer.write_u32(item)
        })
    })?;
    writer.context().pop();
    writer.context().push("uOptArrayOptArray", "Vec<Option<Vec<Option<u32>>>>", "writing property");
    writer.write_string("uOptArrayOptArray")?;
    writer.write_array(&args.u_opt_array_opt_array, |writer, item| {
        writer.write_optional_array(item, |writer, item| {
            writer.write_optional_u32(item)
        })
    })?;
    writer.context().pop();
    writer.context().push("uArrayOptArrayArray", "Vec<Option<Vec<Vec<u32>>>>", "writing property");
    writer.write_string("uArrayOptArrayArray")?;
    writer.write_array(&args.u_array_opt_array_array, |writer, item| {
        writer.write_optional_array(item, |writer, item| {
            writer.write_array(item, |writer, item| {
                writer.write_u32(item)
            })
        })
    })?;
    writer.context().pop();
    writer.context().push("crazyArray", "Option<Vec<Option<Vec<Vec<Option<Vec<u32>>>>>>>", "writing property");
    writer.write_string("crazyArray")?;
    writer.write_optional_array(&args.crazy_array, |writer, item| {
        writer.write_optional_array(item, |writer, item| {
            writer.write_array(item, |writer, item| {
                writer.write_optional_array(item, |writer, item| {
                    writer.write_u32(item)
                })
            })
        })
    })?;
    writer.context().pop();
    writer.context().push("object", "AnotherType", "writing property");
    writer.write_string("object")?;
    AnotherType::write(&args.object, writer)?;
    writer.context().pop();
    writer.context().push("optObject", "Option<AnotherType>", "writing property");
    writer.write_string("optObject")?;
    if args.opt_object.is_some() {
        AnotherType::write(args.opt_object.as_ref().as_ref().unwrap(), writer)?;
    } else {
        writer.write_nil()?;
    }
    writer.context().pop();
    writer.context().push("objectArray", "Vec<AnotherType>", "writing property");
    writer.write_string("objectArray")?;
    writer.write_array(&args.object_array, |writer, item| {
        AnotherType::write(item, writer)
    })?;
    writer.context().pop();
    writer.context().push("optObjectArray", "Option<Vec<Option<AnotherType>>>", "writing property");
    writer.write_string("optObjectArray")?;
    writer.write_optional_array(&args.opt_object_array, |writer, item| {
        if item.is_some() {
            AnotherType::write(item.as_ref().as_ref().unwrap(), writer)
        } else {
            writer.write_nil()
        }
    })?;
    writer.context().pop();
    writer.context().push("en", "CustomEnum", "writing property");
    writer.write_string("en")?;
    writer.write_i32(&(args.en as i32))?;
    writer.context().pop();
    writer.context().push("optEnum", "Option<CustomEnum>", "writing property");
    writer.write_string("optEnum")?;
    writer.write_optional_i32(&args.opt_enum.map(|f| f as i32))?;
    writer.context().pop();
    writer.context().push("enumArray", "Vec<CustomEnum>", "writing property");
    writer.write_string("enumArray")?;
    writer.write_array(&args.enum_array, |writer, item| {
        writer.write_i32(&(*item as i32))
    })?;
    writer.context().pop();
    writer.context().push("optEnumArray", "Option<Vec<Option<CustomEnum>>>", "writing property");
    writer.write_string("optEnumArray")?;
    writer.write_optional_array(&args.opt_enum_array, |writer, item| {
        writer.write_optional_i32(&item.map(|f| f as i32))
    })?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_custom_type(args: &[u8]) -> Result<CustomType, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing object-type: CustomType".to_string();
    let mut reader = ReadDecoder::new(args, context);
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
    let mut _bignumber: BigNumber = BigNumber::default();
    let mut _bignumber_set = false;
    let mut _opt_bignumber: Option<BigNumber> = None;
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
            "optStr" => {
                reader.context().push(&field, "Option<String>", "type found, reading property");
                _opt_str = reader.read_optional_string()?;
                reader.context().pop();
            }
            "u" => {
                reader.context().push(&field, "u32", "type found, reading property");
                _u = reader.read_u32()?;
                _u_set = true;
                reader.context().pop();
            }
            "optU" => {
                reader.context().push(&field, "Option<u32>", "type found, reading property");
                _opt_u = reader.read_optional_u32()?;
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
            "optBigint" => {
                reader.context().push(&field, "Option<BigInt>", "type found, reading property");
                _opt_bigint = reader.read_optional_bigint()?;
                reader.context().pop();
            }
            "bignumber" => {
                reader.context().push(&field, "BigNumber", "type found, reading property");
                _bignumber = reader.read_bignumber()?;
                _bignumber_set = true;
                reader.context().pop();
            }
            "optBignumber" => {
                reader.context().push(&field, "Option<BigNumber>", "type found, reading property");
                _opt_bignumber = reader.read_optional_bignumber()?;
                reader.context().pop();
            }
            "json" => {
                reader.context().push(&field, "JSON::Value", "type found, reading property");
                _json = reader.read_json()?;
                _json_set = true;
                reader.context().pop();
            }
            "optJson" => {
                reader.context().push(&field, "Option<JSON::Value>", "type found, reading property");
                _opt_json = reader.read_optional_json()?;
                reader.context().pop();
            }
            "bytes" => {
                reader.context().push(&field, "Vec<u8>", "type found, reading property");
                _bytes = reader.read_bytes()?;
                _bytes_set = true;
                reader.context().pop();
            }
            "optBytes" => {
                reader.context().push(&field, "Option<Vec<u8>>", "type found, reading property");
                _opt_bytes = reader.read_optional_bytes()?;
                reader.context().pop();
            }
            "boolean" => {
                reader.context().push(&field, "bool", "type found, reading property");
                _boolean = reader.read_bool()?;
                _boolean_set = true;
                reader.context().pop();
            }
            "optBoolean" => {
                reader.context().push(&field, "Option<bool>", "type found, reading property");
                _opt_boolean = reader.read_optional_bool()?;
                reader.context().pop();
            }
            "uArray" => {
                reader.context().push(&field, "Vec<u32>", "type found, reading property");
                _u_array = reader.read_array(|reader| {
                    reader.read_u32()
                })?;
                _u_array_set = true;
                reader.context().pop();
            }
            "uOptArray" => {
                reader.context().push(&field, "Option<Vec<u32>>", "type found, reading property");
                _u_opt_array = reader.read_optional_array(|reader| {
                    reader.read_u32()
                })?;
                reader.context().pop();
            }
            "optUOptArray" => {
                reader.context().push(&field, "Option<Vec<Option<u32>>>", "type found, reading property");
                _opt_u_opt_array = reader.read_optional_array(|reader| {
                    reader.read_optional_u32()
                })?;
                reader.context().pop();
            }
            "optStrOptArray" => {
                reader.context().push(&field, "Option<Vec<Option<String>>>", "type found, reading property");
                _opt_str_opt_array = reader.read_optional_array(|reader| {
                    reader.read_optional_string()
                })?;
                reader.context().pop();
            }
            "uArrayArray" => {
                reader.context().push(&field, "Vec<Vec<u32>>", "type found, reading property");
                _u_array_array = reader.read_array(|reader| {
                    reader.read_array(|reader| {
                        reader.read_u32()
                    })
                })?;
                _u_array_array_set = true;
                reader.context().pop();
            }
            "uOptArrayOptArray" => {
                reader.context().push(&field, "Vec<Option<Vec<Option<u32>>>>", "type found, reading property");
                _u_opt_array_opt_array = reader.read_array(|reader| {
                    reader.read_optional_array(|reader| {
                        reader.read_optional_u32()
                    })
                })?;
                _u_opt_array_opt_array_set = true;
                reader.context().pop();
            }
            "uArrayOptArrayArray" => {
                reader.context().push(&field, "Vec<Option<Vec<Vec<u32>>>>", "type found, reading property");
                _u_array_opt_array_array = reader.read_array(|reader| {
                    reader.read_optional_array(|reader| {
                        reader.read_array(|reader| {
                            reader.read_u32()
                        })
                    })
                })?;
                _u_array_opt_array_array_set = true;
                reader.context().pop();
            }
            "crazyArray" => {
                reader.context().push(&field, "Option<Vec<Option<Vec<Vec<Option<Vec<u32>>>>>>>", "type found, reading property");
                _crazy_array = reader.read_optional_array(|reader| {
                    reader.read_optional_array(|reader| {
                        reader.read_array(|reader| {
                            reader.read_optional_array(|reader| {
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
            "optObject" => {
                reader.context().push(&field, "Option<AnotherType>", "type found, reading property");
                let mut object: Option<AnotherType> = None;
                if !reader.is_next_nil()? {
                    object = Some(AnotherType::read(reader)?);
                } else {
                    object = None;
                }
                _opt_object = object;
                reader.context().pop();
            }
            "objectArray" => {
                reader.context().push(&field, "Vec<AnotherType>", "type found, reading property");
                _object_array = reader.read_array(|reader| {
                    let object = AnotherType::read(reader)?;
                    Ok(object)
                })?;
                _object_array_set = true;
                reader.context().pop();
            }
            "optObjectArray" => {
                reader.context().push(&field, "Option<Vec<Option<AnotherType>>>", "type found, reading property");
                _opt_object_array = reader.read_optional_array(|reader| {
                    let mut object: Option<AnotherType> = None;
                    if !reader.is_next_nil()? {
                        object = Some(AnotherType::read(reader)?);
                    } else {
                        object = None;
                    }
                    Ok(object)
                })?;
                reader.context().pop();
            }
            "en" => {
                reader.context().push(&field, "CustomEnum", "type found, reading property");
                let mut value: CustomEnum = CustomEnum::_MAX_;
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
            "optEnum" => {
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
            "enumArray" => {
                reader.context().push(&field, "Vec<CustomEnum>", "type found, reading property");
                _enum_array = reader.read_array(|reader| {
                    let mut value: CustomEnum = CustomEnum::_MAX_;
                    if reader.is_next_string()? {
                        value = get_custom_enum_value(&reader.read_string()?)?;
                    } else {
                        value = CustomEnum::try_from(reader.read_i32()?)?;
                        sanitize_custom_enum_value(value as i32)?;
                    }
                    Ok(value)
                })?;
                _enum_array_set = true;
                reader.context().pop();
            }
            "optEnumArray" => {
                reader.context().push(&field, "Option<Vec<Option<CustomEnum>>>", "type found, reading property");
                _opt_enum_array = reader.read_optional_array(|reader| {
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
                    Ok(value)
                })?;
                reader.context().pop();
            }
            err => return Err(DecodeError::UnknownFieldName(err.to_string())),
        }
    }
    if !_str_set {
        return Err(DecodeError::MissingField("str: String.".to_string()));
    }
    if !_u_set {
        return Err(DecodeError::MissingField("u: UInt.".to_string()));
    }
    if !_u8_set {
        return Err(DecodeError::MissingField("u8: UInt8.".to_string()));
    }
    if !_u16_set {
        return Err(DecodeError::MissingField("u16: UInt16.".to_string()));
    }
    if !_u32_set {
        return Err(DecodeError::MissingField("u32: UInt32.".to_string()));
    }
    if !_i_set {
        return Err(DecodeError::MissingField("i: Int.".to_string()));
    }
    if !_i8_set {
        return Err(DecodeError::MissingField("i8: Int8.".to_string()));
    }
    if !_i16_set {
        return Err(DecodeError::MissingField("i16: Int16.".to_string()));
    }
    if !_i32_set {
        return Err(DecodeError::MissingField("i32: Int32.".to_string()));
    }
    if !_bigint_set {
        return Err(DecodeError::MissingField("bigint: BigInt.".to_string()));
    }
    if !_bignumber_set {
        return Err(DecodeError::MissingField("bignumber: BigNumber.".to_string()));
    }
    if !_json_set {
        return Err(DecodeError::MissingField("json: JSON.".to_string()));
    }
    if !_bytes_set {
        return Err(DecodeError::MissingField("bytes: Bytes.".to_string()));
    }
    if !_boolean_set {
        return Err(DecodeError::MissingField("boolean: Boolean.".to_string()));
    }
    if !_u_array_set {
        return Err(DecodeError::MissingField("uArray: [UInt].".to_string()));
    }
    if !_u_array_array_set {
        return Err(DecodeError::MissingField("uArrayArray: [[UInt]].".to_string()));
    }
    if !_u_opt_array_opt_array_set {
        return Err(DecodeError::MissingField("uOptArrayOptArray: [[UInt32]].".to_string()));
    }
    if !_u_array_opt_array_array_set {
        return Err(DecodeError::MissingField("uArrayOptArrayArray: [[[UInt32]]].".to_string()));
    }
    if !_object_set {
        return Err(DecodeError::MissingField("object: AnotherType.".to_string()));
    }
    if !_object_array_set {
        return Err(DecodeError::MissingField("objectArray: [AnotherType].".to_string()));
    }
    if !_en_set {
        return Err(DecodeError::MissingField("en: CustomEnum.".to_string()));
    }
    if !_enum_array_set {
        return Err(DecodeError::MissingField("enumArray: [CustomEnum].".to_string()));
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
        bignumber: _bignumber,
        opt_bignumber: _opt_bignumber,
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
