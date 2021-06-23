use super::{AnotherType, CustomEnum};
use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use serde::{Deserialize, Serialize};
use std::convert::TryInto;
use std::io::{Error, ErrorKind, Result};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputQueryMethod {
    string: String,
    opt_string: Option<String>,
    en: CustomEnum,
    opt_enum: Option<CustomEnum>,
    enum_array: Vec<CustomEnum>,
    opt_enum_array: Option<Vec<CustomEnum>>,
}

impl InputQueryMethod {
    pub fn new() -> Self {
        Self {
            string: "".to_string(),
            opt_string: None,
            en: CustomEnum::_MAX_,
            opt_enum: None,
            enum_array: vec![],
            opt_enum_array: None,
        }
    }

    pub fn deserialize_query_method_args(&mut self, args_buf: &[u8]) -> Result<Self> {
        let mut context = Context::new();
        context.description = "Deserializing query-type: query_method".to_string();
        let mut reader = ReadDecoder::new(args_buf, context);
        let mut num_of_fields = reader.read_map_length().unwrap_or_default();

        let mut string = "".to_string();
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
                        .push(&field, "string", "type found, reading property");
                    string = reader.read_string().unwrap_or_default();
                    string_set = true;
                    let _ = reader.context().pop();
                }
                "opt_string" => {
                    reader
                        .context()
                        .push(&field, "Option<String>", "type found, reading property");
                    opt_string = reader.read_nullable_string();
                    let _ = reader.context().pop();
                }
                "en" => {
                    reader
                        .context()
                        .push(&field, "CustomEnum", "type found, reading property");
                    let mut value = CustomEnum::_MAX_ as i32;
                    if reader.is_next_string() {
                        value = CustomEnum::get_custom_enum_value(
                            reader.read_string().unwrap_or_default().as_str(),
                        )
                        .unwrap() as i32;
                    } else {
                        value = reader.read_i32().unwrap_or_default();
                        let _ = CustomEnum::sanitize_custom_enum_value(value.try_into().unwrap());
                    }
                    en = value.try_into().unwrap();
                    en_set = true;
                    let _ = reader.context().pop();
                }
                "opt_enum" => {
                    reader.context().push(
                        &field,
                        "Option<CustomEnum>",
                        "type found, reading property",
                    );
                    let mut value = Some(CustomEnum::_MAX_ as i32);
                    if !reader.is_next_nil() {
                        if reader.is_next_string() {
                            value = Some(
                                CustomEnum::get_custom_enum_value(
                                    reader.read_string().unwrap_or_default().as_str(),
                                )
                                .unwrap() as i32,
                            );
                        } else {
                            value = Some(reader.read_i32().unwrap_or_default());
                            let _ = CustomEnum::sanitize_custom_enum_value(value.unwrap_or_default());
                        }
                    } else {
                        value = None;
                    }
                    opt_enum = Some(value.unwrap().try_into().unwrap());
                    let _ = reader.context().pop();
                }
                "enum_array" => {
                    reader
                        .context()
                        .push(&field, "Vec<CustomEnum>", "type found, reading property");
                    // TODO: enum_array = reader.read_array();
                    enum_array_set = true;
                    let _ = reader.context().pop();
                }
                "opt_enum_array" => {
                    reader.context().push(
                        &field,
                        "Option<Vec<CustomEnum>>",
                        "type found, reading property",
                    );
                    // TODO: opt_enum_array = reader.read_nullable_array();
                    let _ = reader.context().pop();
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
                .print_with_context("Missing required argument: 'enum_array: Vec<CustomEnum'");
            return Err(Error::new(ErrorKind::Other, custom_error));
        }

        Ok(Self {
            string,
            opt_string,
            en,
            opt_enum,
            enum_array,
            opt_enum_array,
        })
    }

    pub fn serialize_query_method_result(&mut self, result: i32) -> Vec<u8> {
        let mut sizer_context = Context::new();
        sizer_context.description = "Serializing (sizing) query-type: query_method".to_string();
        let sizer = WriteSizer::new(sizer_context);
        self.write_query_method_result(sizer.clone(), result);
        let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
        let mut encoder_context = Context::new();
        encoder_context.description = "Serializing (encoding) query-type: query_method".to_string();
        let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
        self.write_query_method_result(encoder, result);
        buffer
    }

    pub fn write_query_method_result<W: Write>(&mut self, mut writer: W, result: i32) {
        writer
            .context()
            .push("query_method", "i32", "writing property");
        writer.write_i32(result);
        let _ = writer.context().pop();
    }

    pub fn query_method_wrapped(&mut self, args_buf: &[u8]) -> Vec<u8> {
        let query_method = self.deserialize_query_method_args(args_buf).unwrap();
        let args = bincode::serialize(&query_method).unwrap_or_default();
        let result = args.iter().fold(0, |result, &bit| (result << 1) ^ bit) as i32;
        self.serialize_query_method_result(result)
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputObjectMethod {
    object: AnotherType,
    opt_object: Option<AnotherType>,
    object_array: Vec<AnotherType>,
    opt_object_array: Option<Vec<AnotherType>>,
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
    pub fn deserialize_object_method_args(&mut self, args_buf: &[u8]) -> Result<Self> {
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
                    object = self.object.read(reader.clone());
                    object_set = true;
                    let _ = reader.context().pop();
                }
                "opt_object" => {
                    reader.context().push(
                        &field,
                        "Option<AnotherType>",
                        "type found, reading property",
                    );
                    if !reader.is_next_nil() {
                        opt_object = Some(self.object.read(reader.clone()));
                    }
                    let _ = reader.context().pop();
                }
                "object_array" => {
                    reader
                        .context()
                        .push(&field, "Vec<AnotherType", "type found, reading property");
                    // TODO: object_array = reader.read_array();
                    object_array_set = true;
                    let _ = reader.context().pop();
                }
                "opt_object_array" => {
                    reader.context().push(
                        &field,
                        "Option<Vec<AnotherType>>",
                        "type found, reading property",
                    );
                    // TODO: opt_object_array = reader.read_nullable_array();
                    let _ = reader.context().pop();
                }
                _ => {
                    reader
                        .context()
                        .push(&field, "unknown", "searching for property type");
                    let _ = reader.context().pop();
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

        Ok(Self {
            object,
            opt_object,
            object_array,
            opt_object_array,
        })
    }

    pub fn serialize_object_method_result(&mut self, result: Option<AnotherType>) -> Vec<u8> {
        let mut sizer_context = Context::new();
        sizer_context.description = "Serializing (sizing) query-type: object_method".to_string();
        let sizer = WriteSizer::new(sizer_context);
        self.write_object_method_result(sizer.clone(), &result);
        let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
        let mut encoder_context = Context::new();
        encoder_context.description =
            "Serializing (encoding) query-type: object_method".to_string();
        let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
        self.write_object_method_result(encoder, &result);
        buffer
    }

    pub fn write_object_method_result<W: Write>(
        &mut self,
        mut writer: W,
        result: &Option<AnotherType>,
    ) {
        writer
            .context()
            .push("object_method", "Option<AnotherType", "writing property");
        if result.is_some() {
            self.object.write(writer.clone());
        } else {
            writer.write_nil();
        }
        let _ = writer.context().pop();
    }

    pub fn object_method_wrapped(&mut self, args_buf: &[u8]) -> Vec<u8> {
        let result = self.deserialize_object_method_args(args_buf).unwrap();

        self.serialize_object_method_result(result.opt_object)
    }
}
