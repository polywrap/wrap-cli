use serde::{Serialize, Deserialize};
use std::convert::TryFrom;
use polywrap_wasm_rs::{
    BigInt,
    Context,
    Read,
    ReadDecoder,
    Write,
    WriteEncoder,
    WriteSizer,
    JSON,
};

use crate::{
    CustomEnum,
    get_custom_enum_value,
    sanitize_custom_enum_value
};
use crate::AnotherType;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputQueryMethod {
    pub str: String,
    pub opt_str: Option<String>,
    pub en: CustomEnum,
    pub opt_enum: Option<CustomEnum>,
    pub enum_array: Vec<CustomEnum>,
    pub opt_enum_array: Option<Vec<Option<CustomEnum>>>,
}

pub fn deserialize_query_method_args(input: &[u8]) -> Result<InputQueryMethod, String> {
    let mut context = Context::new();
    context.description = "Deserializing query-type: query_method".to_string();
    let mut reader = ReadDecoder::new(input, context);
    let mut num_of_fields = reader.read_map_length()?;

    let mut _str: String = String::new();
    let mut _str_set = false;
    let mut _opt_str: Option<String> = None;
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
                reader.context().push(&field, "String", "type found, reading argument");
                _str = reader.read_string()?;
                _str_set = true;
                reader.context().pop();
            }
            "opt_str" => {
                reader.context().push(&field, "Option<String>", "type found, reading argument");
                _opt_str = reader.read_nullable_string()?;
                reader.context().pop();
            }
            "en" => {
                reader.context().push(&field, "CustomEnum", "type found, reading argument");
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
                reader.context().push(&field, "Option<CustomEnum>", "type found, reading argument");
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
                reader.context().push(&field, "Vec<CustomEnum>", "type found, reading argument");
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
                reader.context().push(&field, "Option<Vec<Option<CustomEnum>>>", "type found, reading argument");
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
        return Err(reader.context().print_with_context("Missing required argument: 'str: String'"));
    }
    if !_en_set {
        return Err(reader.context().print_with_context("Missing required argument: 'en: CustomEnum'"));
    }
    if !_enum_array_set {
        return Err(reader.context().print_with_context("Missing required argument: 'enumArray: [CustomEnum]'"));
    }

    Ok(InputQueryMethod {
        str: _str,
        opt_str: _opt_str,
        en: _en,
        opt_enum: _opt_enum,
        enum_array: _enum_array,
        opt_enum_array: _opt_enum_array,
    })
}

pub fn serialize_query_method_result(result: &i32) -> Result<Vec<u8>, String> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) query-type: query_method".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_query_method_result(result, &mut sizer)?;
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) query-type: query_method".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_query_method_result(result, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_query_method_result<W: Write>(result: &i32, writer: &mut W) -> Result<(), String> {
    writer.context().push("query_method", "i32", "writing result");
    writer.write_i32(result)?;
    writer.context().pop();
    Ok(())
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputObjectMethod {
    pub object: AnotherType,
    pub opt_object: Option<AnotherType>,
    pub object_array: Vec<AnotherType>,
    pub opt_object_array: Option<Vec<Option<AnotherType>>>,
}

pub fn deserialize_object_method_args(input: &[u8]) -> Result<InputObjectMethod, String> {
    let mut context = Context::new();
    context.description = "Deserializing query-type: object_method".to_string();
    let mut reader = ReadDecoder::new(input, context);
    let mut num_of_fields = reader.read_map_length()?;

    let mut _object: AnotherType = AnotherType::new();
    let mut _object_set = false;
    let mut _opt_object: Option<AnotherType> = None;
    let mut _object_array: Vec<AnotherType> = vec![];
    let mut _object_array_set = false;
    let mut _opt_object_array: Option<Vec<Option<AnotherType>>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "object" => {
                reader.context().push(&field, "AnotherType", "type found, reading argument");
                let object = AnotherType::read(&mut reader)?;
                _object = object;
                _object_set = true;
                reader.context().pop();
            }
            "opt_object" => {
                reader.context().push(&field, "Option<AnotherType>", "type found, reading argument");
                let mut object: Option<AnotherType> = None;
                if !reader.is_next_nil()? {
                    object = Some(AnotherType::read(&mut reader)?);
                }
                _opt_object = object;
                reader.context().pop();
            }
            "object_array" => {
                reader.context().push(&field, "Vec<AnotherType>", "type found, reading argument");
                _object_array = reader.read_array(|reader| {
                    let object = AnotherType::read(reader)?;
                    return Ok(object);
                })?;
                _object_array_set = true;
                reader.context().pop();
            }
            "opt_object_array" => {
                reader.context().push(&field, "Option<Vec<Option<AnotherType>>>", "type found, reading argument");
                _opt_object_array = reader.read_nullable_array(|reader| {
                    let mut object: Option<AnotherType> = None;
                    if !reader.is_next_nil()? {
                        object = Some(AnotherType::read(reader)?);
                    }
                    return Ok(object);
                })?;
                reader.context().pop();
            }
            _ => {}
        }
    }
    if !_object_set {
        return Err(reader.context().print_with_context("Missing required argument: 'object: AnotherType'"));
    }
    if !_object_array_set {
        return Err(reader.context().print_with_context("Missing required argument: 'objectArray: [AnotherType]'"));
    }

    Ok(InputObjectMethod {
        object: _object,
        opt_object: _opt_object,
        object_array: _object_array,
        opt_object_array: _opt_object_array,
    })
}

pub fn serialize_object_method_result(result: &Option<AnotherType>) -> Result<Vec<u8>, String> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) query-type: object_method".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_object_method_result(result, &mut sizer)?;
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) query-type: object_method".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_object_method_result(result, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_object_method_result<W: Write>(result: &Option<AnotherType>, writer: &mut W) -> Result<(), String> {
    writer.context().push("object_method", "Option<AnotherType>", "writing result");
    if result.is_some() {
        AnotherType::write(result.as_ref().unwrap(), writer)?;
    } else {
        writer.write_nil()?;
    }
    writer.context().pop();
    Ok(())
}
