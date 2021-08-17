use crate::{
    get_custom_enum_value, 
    sanitize_custom_enum_value, 
    AnotherType, 
    CustomEnum,
};
use polywrap_wasm_rs::{
    Context, 
    Read, 
    ReadDecoder, 
    Write, 
    WriteEncoder, 
    WriteSizer,
};
use serde::{
    Deserialize, 
    Serialize,
};
use std::convert::TryFrom;

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
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();

    let mut str = String::new();
    let mut str_set = false;
    let mut opt_str: Option<String> = None;
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
                reader.context().pop();
            }
            "opt_str" => {
                reader.context().push(&field, "Option<String>", "type found, reading property");
                opt_str = reader.read_nullable_string();
                reader.context().pop();
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
                        .expect("Failed to sanitize CustomEnum value");
                }
                en = value;
                en_set = true;
                reader.context().pop();
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
                            .expect("Failed to sanitize Option<CustomEnum> value");
                    }
                } else {
                    value = None;
                }
                opt_enum = value;
                reader.context().pop();
            }
            "enum_array" => {
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
                reader.context().pop();
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
                reader.context().pop();
            }
            _ => {
                reader.context().push(&field, "unknown", "searching for property type");
                reader.context().pop();
            }
        }
    }
    if !str_set {
        let custom_error = reader.context().print_with_context("Missing required argument: 'str: String'");
        return Err(custom_error);
    }
    if !en_set {
        let custom_error = reader.context().print_with_context("Missing required argument: 'en: CustomEnum'");
        return Err(custom_error);
    }
    if !enum_array_set {
        let custom_error = reader.context().print_with_context("Missing required argument: 'enum_array: Vec<CustomEnum>'");
        return Err(custom_error);
    }

    Ok(InputQueryMethod {
        str,
        opt_str,
        en,
        opt_enum,
        enum_array,
        opt_enum_array,
    })
}

pub fn serialize_query_method_result(input: i32) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) query-type: query_method".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_query_method_result(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) query-type: query_method".to_string();
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_query_method_result(input, &mut encoder);
    buffer
}

pub fn write_query_method_result<W: Write>(input: i32, writer: &mut W) {
    writer.context().push("query_method", "i32", "writing property");
    writer.write_i32(input);
    writer.context().pop();
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
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();

    let mut object = AnotherType {
        prop: None,
        circular: Box::new(None),
    };
    let mut object_set = false;
    let mut opt_object: Option<AnotherType> = None;
    let mut object_array: Vec<AnotherType> = vec![];
    let mut object_array_set = false;
    let mut opt_object_array: Option<Vec<Option<AnotherType>>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "object" => {
                reader.context().push(&field, "AnotherType", "type found, reading property");
                let obj = AnotherType::read(&mut reader);
                object = obj;
                object_set = true;
                reader.context().pop();
            }
            "opt_object" => {
                reader.context().push(&field, "Option<AnotherType>", "type found, reading property");
                let mut opt_obj: Option<AnotherType> = None;
                if !reader.is_next_nil() {
                    opt_obj = Some(AnotherType::read(&mut reader));
                }
                opt_object = opt_obj;
                reader.context().pop();
            }
            "object_array" => {
                reader.context().push(&field, "Vec<AnotherType>", "type found, reading property");
                object_array = reader.read_array(|reader| {
                    let obj = AnotherType::read(reader);
                    obj
                }).expect("Failed to read array");
                object_array_set = true;
                reader.context().pop();
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
                reader.context().pop();
            }
            _ => {
                reader.context().push(&field, "unknown", "searching for property type");
                reader.context().pop();
            }
        }
    }
    if !object_set {
        let custom_error = reader.context().print_with_context("Missing required argument: 'object: AnotherType'");
        return Err(custom_error);
    }
    if !object_array_set {
        let custom_error = reader.context().print_with_context("Missing required argument: 'object_array: Vec<AnotherType>'");
        return Err(custom_error);
    }

    Ok(InputObjectMethod {
        object,
        opt_object,
        object_array,
        opt_object_array,
    })
}

pub fn serialize_object_method_result(input: Option<AnotherType>) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) query-type: object_method".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_object_method_result(input.clone(), &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) query-type: object_method".to_string();
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_object_method_result(input, &mut encoder);
    buffer
}

pub fn write_object_method_result<W: Write>(input: Option<AnotherType>, writer: &mut W) {
    writer.context().push("object_method", "Option<AnotherType>", "writing property");
    if input.is_some() {
        AnotherType::write(input.as_ref().as_ref().unwrap(), writer);
    } else {
        writer.write_nil();
    }
    writer.context().pop();
}