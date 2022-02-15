use serde::{Serialize, Deserialize};
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

pub fn deserialize_query_method_args(input: &[u8]) -> Result<InputQueryMethod, DecodeError> {
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
                if let Ok(v) = reader.read_string() {
                    _str = v;
                    _str_set = true;
                } else {
                    return Err(DecodeError::TypeReadError(reader.context().print_with_context("'str: String'")));
                }
            }
            "opt_str" => {
                if let Ok(v) = reader.read_nullable_string() {
                    _opt_str = v;
                } else {
                    return Err(DecodeError::TypeReadError(reader.context().print_with_context("'opt_str: Option<String>'")));
                }
            }
            "en" => {
                if reader.is_next_string()? {
                    match get_custom_enum_value(&reader.read_string()?) {
                        Ok(v) => _en = v,
                        Err(e) => return Err(DecodeError::from(e))
                    }
                } else {
                    _en = CustomEnum::try_from(reader.read_i32()?)?;
                    sanitize_custom_enum_value(_en as i32)?;
                }
                _en_set = true;
            }
            "opt_enum" => {
                if !reader.is_next_nil()? {
                    if reader.is_next_string()? {
                        match get_custom_enum_value(&reader.read_string()?) {
                            Ok(v) => _opt_enum = Some(v),
                            Err(e) => return Err(DecodeError::from(e))
                        }
                    } else {
                        _opt_enum = Some(CustomEnum::try_from(reader.read_i32()?)?);
                        sanitize_custom_enum_value(_opt_enum.unwrap() as i32)?;
                    }
                } else {
                    _opt_enum = None;
                }
            }
            "enum_array" => {
                if let Ok(v) = reader.read_array(|reader| {
                    if reader.is_next_string()? {
                        Ok(get_custom_enum_value(&reader.read_string()?)?)
                    } else {
                        let c = CustomEnum::try_from(reader.read_i32()?)?;
                        sanitize_custom_enum_value(c as i32)?;
                        Ok(c)
                    }
                }) {
                    _enum_array = v;
                    _enum_array_set = true;
                } else {
                    return Err(DecodeError::TypeReadError(reader.context().print_with_context("'enum_array: Vec<CustomEnum>'")));
                }
            }
            "opt_enum_array" => {
                if let Ok(v) = reader.read_nullable_array(|reader| {
                    if !reader.is_next_nil()? {
                        if reader.is_next_string()? {
                            Ok(Some(get_custom_enum_value(&reader.read_string()?)?))
                        } else {
                            let c = Some(CustomEnum::try_from(reader.read_i32()?)?);
                            sanitize_custom_enum_value(c.unwrap() as i32)?;
                            Ok(c)
                        }
                    } else {
                        Ok(None)
                    }
                }) {
                    _opt_enum_array = v;
                } else {
                    return Err(DecodeError::TypeReadError(reader.context().print_with_context("'opt_enum_array: Option<Vec<Option<CustomEnum>>>'")));
                }
            }
            _ => {}
        }
    }
    if !_str_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'str: String'")));
    }
    if !_en_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'en: CustomEnum'")));
    }
    if !_enum_array_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'enumArray: [CustomEnum]'")));
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

pub fn serialize_query_method_result(result: &i32) -> Result<Vec<u8>, EncodeError> {
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

pub fn write_query_method_result<W: Write>(result: &i32, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_i32(result)?;
    Ok(())
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputObjectMethod {
    pub object: AnotherType,
    pub opt_object: Option<AnotherType>,
    pub object_array: Vec<AnotherType>,
    pub opt_object_array: Option<Vec<Option<AnotherType>>>,
}

pub fn deserialize_object_method_args(input: &[u8]) -> Result<InputObjectMethod, DecodeError> {
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
                if let Ok(v) = AnotherType::read(&mut reader) {
                    _object = v;
                    _object_set = true;
                } else {
                    return Err(DecodeError::TypeReadError(reader.context().print_with_context("'object: AnotherType'")));
                }
            }
            "opt_object" => {
                if !reader.is_next_nil()? {
                    if let Ok(v) = AnotherType::read(&mut reader) {
                        _opt_object = Some(v);
                    } else {
                        return Err(DecodeError::TypeReadError(reader.context().print_with_context("'opt_object: Option<AnotherType>'")));
                    }
                } else {
                    _opt_object = None;
                }
            }
            "object_array" => {
                if let Ok(v) = reader.read_array(|reader| {
                    AnotherType::read(reader)
                }) {
                    _object_array = v;
                    _object_array_set = true;
                } else {
                    return Err(DecodeError::TypeReadError(reader.context().print_with_context("'object_array: Vec<AnotherType>'")));
                }
            }
            "opt_object_array" => {
                if let Ok(v) = reader.read_nullable_array(|reader| {
                    if !reader.is_next_nil()? {
                        Ok(Some(AnotherType::read(reader)?))
                    } else {
                        Ok(None)
                    }
                }) {
                    _opt_object_array = v;
                } else {
                    return Err(DecodeError::TypeReadError(reader.context().print_with_context("'opt_object_array: Option<Vec<Option<AnotherType>>>'")));
                }
            }
            _ => {}
        }
    }
    if !_object_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'object: AnotherType'")));
    }
    if !_object_array_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'objectArray: [AnotherType]'")));
    }

    Ok(InputObjectMethod {
        object: _object,
        opt_object: _opt_object,
        object_array: _object_array,
        opt_object_array: _opt_object_array,
    })
}

pub fn serialize_object_method_result(result: &Option<AnotherType>) -> Result<Vec<u8>, EncodeError> {
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

pub fn write_object_method_result<W: Write>(result: &Option<AnotherType>, writer: &mut W) -> Result<(), EncodeError> {
    if result.is_some() {
        AnotherType::write(result.as_ref().unwrap(), writer)?;
    } else {
        writer.write_nil()?;
    }
    Ok(())
}
