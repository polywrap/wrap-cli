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
use std::convert::{
    TryFrom, 
    TryInto,
};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputMutationMethod {
    pub str: String,
    pub opt_str: Option<String>,
    pub en: CustomEnum,
    pub opt_enum: Option<CustomEnum>,
    pub enum_array: Vec<CustomEnum>,
    pub opt_enum_array: Option<Vec<Option<CustomEnum>>>,
}

pub fn deserialize_mutation_method_args(input: &[u8]) -> Result<InputMutationMethod, String> {
    let mut context = Context::new();
    context.description = "Deserializing query-type: mutation_method".to_string();
    let mut reader = ReadDecoder::new(input, context);
    let mut num_of_fields = reader.read_map_length();

    let mut _str = String::new();
    let mut _str_set = false;
    let mut _opt_str: Option<String> = None;
    let mut _en = CustomEnum::_MAX_;
    let mut _en_set = false;
    let mut _opt_enum: Option<CustomEnum> = None;
    let mut _enum_array: Vec<CustomEnum> = vec![];
    let mut _enum_array_set = false;
    let mut _opt_enum_array: Option<Vec<Option<CustomEnum>>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string();
        match field.as_str() {
            "str" => {
                reader.context().push(&field, "String", "type found, reading property");
                if !str_set {
                    _str = reader.read_string();
                    _str_set = true;
                }
                reader.context().pop();
            }
            "opt_str" => {
                reader.context().push(&field, "Option<String>", "type found, reading property");
                _opt_str = reader.read_nullable_string();
                reader.context().pop();
            }
            "en" => {
                reader.context().push(&field, "CustomEnum", "type found, reading property");
                let mut value = CustomEnum::_MAX_;
                if reader.is_next_string() {
                    value = get_custom_enum_value(&reader.read_string())
                        .expect("Failed to get CustomEnum value");
                } else {
                    value = reader.read_i32().try_into().unwrap();
                    sanitize_custom_enum_value(value as i32)
                        .expect("Failed to sanitize CustomEnum value");
                }
                _en = value;
                _en_set = true;
                reader.context().pop();
            }
            "opt_enum" => {
                reader.context().push(&field, "Option<CustomEnum>", "type found, reading property");
                let mut value: Option<CustomEnum> = None;
                if !reader.is_next_nil() {
                    if reader.is_next_string() {
                        value = Some(get_custom_enum_value(&reader.read_string())
                            .expect("Failed to get Option<CustomEnum> value"));
                    } else {
                        value = Some(reader.read_i32().try_into().unwrap());
                        sanitize_custom_enum_value(value.unwrap() as i32)
                            .expect("Failed to sanitize Option<CustomEnum> value");
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
                    if reader.is_next_string() {
                        value = get_custom_enum_value(&reader.read_string())
                            .expect("Failed to get Vec<CustomEnum> value");
                    } else {
                        value = CustomEnum::try_from(reader.read_i32())
                            .expect("Failed to convert i32 to Vec<CustomEnum>");
                        sanitize_custom_enum_value(value as i32)
                            .expect("Failed to sanitize Vec<CustomEnum>");
                    }
                    value
                }).expect("Failed to read array");
                _enum_array_set = true;
                reader.context().pop();
            }
            "opt_enum_array" => {
                reader.context().push(&field, "Option<Vec<Option<CustomEnum>>>", "type found, reading property");
                _opt_enum_array = reader.read_nullable_array(|reader| {
                    let mut value: Option<CustomEnum> = None;
                    if !reader.is_next_nil() {
                        if reader.is_next_string() {
                            value = Some(get_custom_enum_value(&reader.read_string())
                                .expect("Failed to get Option<Vec<Option<CustomEnum>>> value"));
                        } else {
                            value = Some(CustomEnum::try_from(reader.read_i32())
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
        let custom_error = reader.context().print_with_context("Missing required argument: 'en_array: Vec<CustomEnum>'");
        return Err(custom_error);
    }

    Ok(InputMutationMethod {
        str: _str,
        opt_str: _opt_str,
        en: _en,
        opt_enum: _opt_enum,
        enum_array: _enum_array,
        opt_enum_array: _opt_enum_array,
    });
}

pub fn serialize_mutation_method_result(input: i32) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) query-type: mutation_method".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_mutation_method_result(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) query-type: mutation_method".to_string();
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_mutation_method_result(input, &mut encoder);
    buffer
}

pub fn write_mutation_method_result<W: Write>(input: i32, writer: &mut W) {
    writer.context().push("mutation_method", "i32", "writing property");
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
    let mut num_of_fields = reader.read_map_length();

    let mut object = AnotherType {
        prop: None,
        circular: Box::new(None),
    };
    let mut _object_set = false;
    let mut _opt_object: Option<AnotherType> = None;
    let mut _object_array: Vec<AnotherType> = vec![];
    let mut _object_array_set = false;
    let mut _opt_object_array: Option<Vec<Option<AnotherType>>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string();
        match field.as_str() {
            "object" => {
                reader.context().push(&field, "AnotherType", "type found, reading property");
                let object = AnotherType::read(&mut reader);
                _object = object;
                _object_set = true;
                reader.context().pop();
            }
            "opt_object" => {
                reader.context().push(&field, "Option<AnotherType>", "type found, reading property");
                let mut object: Option<AnotherType> = None;
                if !reader.is_next_nil() {
                    object = Some(AnotherType::read(&mut reader));
                }
                _opt_object = object;
                reader.context().pop();
            }
            "object_array" => {
                reader.context().push(&field, "Vec<AnotherType>", "type found, reading property");
                if !object_array_set {
                    _object_array = reader.read_array(|reader| {
                        let object = AnotherType::read(reader);
                        return object;
                    }).expect("Failed to read array");
                    _object_array_set = true;
                }
                reader.context().pop();
            }
            "opt_object_array" => {
                reader.context().push(&field, "Option<Vec<Option<AnotherType>>>", "type found, reading property");
                _opt_object_array = reader.read_nullable_array(|reader| {
                    let mut object: Option<AnotherType> = None;
                    if !reader.is_next_nil() {
                        object = Some(AnotherType::read(reader));
                    }
                    return object;
                });
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
        object: _object,
        opt_object: _opt_object,
        object_array: _object_array,
        opt_object_array: _opt_object_array,
    });
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