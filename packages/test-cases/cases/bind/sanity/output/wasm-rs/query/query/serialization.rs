use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer,};
use crate::{
    get_custom_enum_value,
    sanitize_custom_enum_value,
    AnotherType,
    CustomEnum,
};
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use std::io::{Error, ErrorKind, Result};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputQueryMethod {
    pub string: String,
    pub opt_string: Option<String>,
    pub en: CustomEnum,
    pub opt_enum: Option<CustomEnum>,
    pub enum_array: Vec<CustomEnum>,
    pub opt_enum_array: Option<Vec<CustomEnum>>,
}

impl InputQueryMethod {
    pub fn new() -> Self {
        Self {
            string: String::new(),
            opt_string: None,
            en: CustomEnum::_MAX_,
            opt_enum: None,
            enum_array: vec![],
            opt_enum_array: None,
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputObjectMethod {
    pub object: AnotherType,
    pub opt_object: Option<AnotherType>,
    pub object_array: Vec<AnotherType>,
    pub opt_object_array: Option<Vec<AnotherType>>,
}

impl InputObjectMethod {
    pub fn new() -> Self {
        Self {
            object: AnotherType::new(),
            opt_object: None,
            object_array: vec![],
            opt_object_array: None,
        }
    }
}

pub fn deserialize_query_method_args(args_buf: &[u8]) -> Result<InputQueryMethod> {
    let mut context = Context::new();
    context.description = "Deserializing query-type: query_method".to_string();
    let mut reader = ReadDecoder::new(args_buf, context);
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();

    let mut string = String::new();
    let mut string_set = false;
    let mut opt_string: Option<String> = None;
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
            "string" => {
                reader
                    .context()
                    .push(&field, "String", "type found, reading property");
                string = reader.read_string().unwrap_or_default();
                string_set = true;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop String from Context");
            }
            "opt_string" => {
                reader
                    .context()
                    .push(&field, "Option<String>", "type found, reading property");
                opt_string = reader.read_nullable_string();
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<String> from Context");
            }
            "en" => {
                reader
                    .context()
                    .push(&field, "CustomEnum", "type found, reading property");
                if reader.is_next_string() {
                    en = get_custom_enum_value(reader.read_string().unwrap_or_default().as_str())
                        .unwrap();
                } else {
                    en = CustomEnum::try_from(reader.read_i32().unwrap_or_default())
                        .expect("Failed to convert i32 to CustomEnum");
                    sanitize_custom_enum_value(en.clone() as i32)
                        .expect("Failed to sanitize CustomEnum value");
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
                        sanitize_custom_enum_value(opt_enum.clone().unwrap() as i32)
                            .expect("Failed to sanitize Option<CustomEnum> value");
                    }
                } else {
                    opt_enum = None;
                }
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<CustomEnum> from Context");
            }
            "enum_array" => {
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
                            sanitize_custom_enum_value(value.clone() as i32)
                                .expect("Failed to sanitize Vec<CustomEnum>");
                        }
                        return value;
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
                        sanitize_custom_enum_value(value.clone() as i32)
                            .expect("Failed to sanitize Option<Vec<CustomEnum>>");
                    }
                    return value;
                });
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop optional Option<Vec<CustomEnum>> from Context");
            }
            _ => {
                reader
                    .context()
                    .push(&field, "unknown", "searching for property type");
            }
        }
    }

    if !string_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required argument: 'string: String'");
        return Err(Error::new(ErrorKind::Other, custom_error));
    }
    if !en_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required argument: 'en: CustomEnum'");
        return Err(Error::new(ErrorKind::Other, custom_error));
    }
    if !enum_array_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required argument: 'enum_array: Vec<CustomEnum>'");
        return Err(Error::new(ErrorKind::Other, custom_error));
    }

    Ok(InputQueryMethod {
        string,
        opt_string,
        en,
        opt_enum,
        enum_array,
        opt_enum_array,
    })
}

pub fn serialize_query_method_result(result: i32) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) query-type: query_method".to_string();
    let sizer = WriteSizer::new(sizer_context);
    write_query_method_result(sizer.clone(), result);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) query-type: query_method".to_string();
    let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
    write_query_method_result(encoder, result);
    buffer
}

pub fn write_query_method_result<W: Write>(mut writer: W, result: i32) {
    writer
        .context()
        .push("query_method", "i32", "writing property");
    writer.write_i32(&result);
    writer
        .context()
        .pop()
        .expect("Failed to pop i32 from Context");
}

pub fn deserialize_object_method_args(args_buf: &[u8]) -> Result<InputObjectMethod> {
    let mut context = Context::new();
    context.description = "Deserializing query-type: object_method".to_string();
    let mut reader = ReadDecoder::new(args_buf, context);
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();

    let mut object = AnotherType::new();
    let mut object_set = false;
    let mut opt_object: Option<AnotherType> = None;
    let mut object_array: Vec<AnotherType> = vec![];
    let mut object_array_set = false;
    let mut opt_object_array: Option<Vec<AnotherType>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "object" => {
                reader
                    .context()
                    .push(&field, "AnotherType", "type found, reading property");
                object = AnotherType::read(&mut reader);
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
                    opt_object = Some(AnotherType::read(&mut reader));
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

    if !object_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required argument: 'object: AnotherType'");
        return Err(Error::new(ErrorKind::Other, custom_error));
    }

    if !object_array_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required argument: 'object_array: Vec<AnotherType>'");
        return Err(Error::new(ErrorKind::Other, custom_error));
    }

    Ok(InputObjectMethod {
        object,
        opt_object,
        object_array,
        opt_object_array,
    })
}

pub fn serialize_object_method_result(result: Option<AnotherType>) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) query-type: object_method".to_string();
    let sizer = WriteSizer::new(sizer_context);
    write_object_method_result(sizer.clone(), &result);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) query-type: object_method".to_string();
    let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
    write_object_method_result(encoder, &result);
    buffer
}

pub fn write_object_method_result<W: Write>(mut writer: W, result: &Option<AnotherType>) {
    writer
        .context()
        .push("object_method", "Option<AnotherType>", "writing property");
    if result.is_some() {
        AnotherType::write(&mut result.clone().unwrap(), &mut writer);
    } else {
        writer.write_nil();
    }
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<AnotherType> from Context");
}