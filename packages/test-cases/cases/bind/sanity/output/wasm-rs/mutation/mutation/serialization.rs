use alloc::{boxed::Box, string::String, vec, vec::Vec};
use polywrap_wasm_rs::{
    Context,
    Read,
    ReadDecoder,
    Write,
    WriteEncoder,
    WriteSizer,
};

use crate::{
    CustomEnum,
    get_custom_enum_value,
    sanitize_custom_enum_value,
};
use crate::AnotherType;

#[derive(Clone, Debug)]
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
    context.description = "Deserializing query-type: mutation_method";
    let mut reader = ReadDecoder::new(input, context);
    let mut num_of_fields = reader.read_map_length().unwrap();

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
        let field = reader.read_string();

        match field.as_str() {
            "str" => {
                reader.context().push(&field, "String", "type found, reading argument");
                _str = reader.read_string();
                _str_set = true;
                reader.context().pop();
            }
            "opt_str" => {
                reader.context().push(&field, "Option<String>", "type found, reading argument");
                _opt_str = reader.read_nullable_string();
                reader.context().pop();
            }
            "en" => {
                reader.context().push(&field, "CustomEnum", "type found, reading argument");
                let mut value = CustomEnum::_MAX_;
                if reader.is_next_string() {
                    value = get_custom_enum_value(&reader.read_string())
                        .expect("Failed to get CustomEnum value");
                } else {
                    value = CustomEnum::try_from(reader.read_i32().unwrap())
                        .expect("Failed to convert i32 to CustomEnum");
                    sanitize_custom_enum_value(value as i32)
                        .expect("Failed to sanitize CustomEnum");
                }
                _en = value;
                _en_set = true;
                reader.context().pop();
            }
            "opt_enum" => {
                reader.context().push(&field, "Option<CustomEnum>", "type found, reading argument");
                let mut value: Option<CustomEnum> = None;
                if !reader.is_next_nil() {
                    if reader.is_next_string() {
                        value = Some(get_custom_enum_value(&reader.read_string())
                            .expect("Failed to get Option<CustomEnum> value"));
                    } else {
                        value = Some(CustomEnum::try_from(reader.read_i32().unwrap())
                            .expect("Failed to convert i32 to Option<CustomEnum>"));
                        sanitize_custom_enum_value(value.unwrap() as i32)
                            .expect("Failed to sanitize Option<CustomEnum>");
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
                    if reader.is_next_string() {
                        value = get_custom_enum_value(&reader.read_string())
                            .expect("Failed to get CustomEnum value");
                    } else {
                        value = CustomEnum::try_from(reader.read_i32().unwrap())
                            .expect("Failed to convert i32 to CustomEnum");
                        sanitize_custom_enum_value(value as i32)
                            .expect("Failed to sanitize CustomEnum");
                    }
                    return value;
                });
                _enum_array_set = true;
                reader.context().pop();
            }
            "opt_enum_array" => {
                reader.context().push(&field, "Option<Vec<Option<CustomEnum>>>", "type found, reading argument");
                _opt_enum_array = reader.read_nullable_array(|reader| {
                    let mut value: Option<CustomEnum> = None;
                    if !reader.is_next_nil() {
                        if reader.is_next_string() {
                            value = Some(get_custom_enum_value(&reader.read_string())
                                .expect("Failed to get Option<CustomEnum> value"));
                        } else {
                            value = Some(CustomEnum::try_from(reader.read_i32().unwrap())
                                .expect("Failed to convert i32 to Option<CustomEnum>"));
                            sanitize_custom_enum_value(value.unwrap() as i32)
                                .expect("Failed to sanitize Option<CustomEnum>");
                        }
                    } else {
                        value = None;
                    }
                    return value;
                });
                reader.context().pop();
            }
            _ => {}
        }
    }
    if !_str_set {
        let custom_error = reader.context().print_with_context("Missing required argument: 'str: String'");
        return Err(custom_error);
    }
    if !_en_set {
        let custom_error = reader.context().print_with_context("Missing required argument: 'en: CustomEnum'");
        return Err(custom_error);
    }
    if !_enum_array_set {
        let custom_error = reader.context().print_with_context("Missing required argument: 'enumArray: [CustomEnum]'");
        return Err(custom_error);
    }

    Ok(InputMutationMethod {
        str: _str,
        opt_str: _opt_str,
        en: _en,
        opt_enum: _opt_enum,
        enum_array: _enum_array,
        opt_enum_array: _opt_enum_array,
    })
}

pub fn serialize_mutation_method_result(input: i32) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) query-type: mutation_method";
    let mut sizer = WriteSizer::new(sizer_context);
    write_mutation_method_result(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) query-type: mutation_method";
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_mutation_method_result(input, &mut encoder);
    buffer
}

pub fn write_mutation_method_result<W: Write>(input: i32, writer: &mut W) {
    writer.context().push("mutation_method", "i32", "writing result");
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
    context.description = "Deserializing query-type: object_method";
    let mut reader = ReadDecoder::new(input, context);
    let mut num_of_fields = reader.read_map_length().unwrap();

    let mut _object: Option<Box<AnotherType>> = None;
    let mut _object_set = false;
    let mut _opt_object: Option<Box<AnotherType>> = None;
    let mut _object_array: Vec<Box<AnotherType>> = vec![];
    let mut _object_array_set = false;
    let mut _opt_object_array: Option<Vec<Option<Box<AnotherType>>>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string();

        match field.as_str() {
            "object" => {
                reader.context().push(&field, "Box<AnotherType>", "type found, reading argument");
                let object = Box::new(AnotherType::read(reader));
                _object = object;
                _object_set = true;
                reader.context().pop();
            }
            "opt_object" => {
                reader.context().push(&field, "Option<Box<AnotherType>>", "type found, reading argument");
                let mut object: Option<Box<AnotherType>> = None;
                if !reader.is_next_nil() {
                    object = Some(Box::new(AnotherType::read(reader)));
                }
                _opt_object = object;
                reader.context().pop();
            }
            "object_array" => {
                reader.context().push(&field, "Vec<Box<AnotherType>>", "type found, reading argument");
                _object_array = reader.read_array(|reader| {
                    let object = Box::new(AnotherType::read(reader));
                    return object;
                });
                _object_array_set = true;
                reader.context().pop();
            }
            "opt_object_array" => {
                reader.context().push(&field, "Option<Vec<Option<Box<AnotherType>>>>", "type found, reading argument");
                _opt_object_array = reader.read_nullable_array(|reader| {
                    let mut object: Option<Box<AnotherType>> = None;
                    if !reader.is_next_nil() {
                        object = Some(Box::new(AnotherType::read(reader)));
                    }
                    return object;
                });
                reader.context().pop();
            }
            _ => {}
        }
    }
    if !_object_set {
        let custom_error = reader.context().print_with_context("Missing required argument: 'object: AnotherType'");
        return Err(custom_error);
    }
    if !_object_array_set {
        let custom_error = reader.context().print_with_context("Missing required argument: 'objectArray: [AnotherType]'");
        return Err(custom_error);
    }

    Ok(InputObjectMethod {
        object: match _object {
            Some(x) => return x,
            None => panic!("'object' is required, but its value is still 'None'. This should never happen."),
        },
        opt_object: _opt_object,
        object_array: _object_array,
        opt_object_array: _opt_object_array,
    })
}

pub fn serialize_object_method_result(input: Option<Box<AnotherType>>) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) query-type: object_method";
    let mut sizer = WriteSizer::new(sizer_context);
    write_object_method_result(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) query-type: object_method";
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_object_method_result(input, &mut encoder);
    buffer
}

pub fn write_object_method_result<W: Write>(input: Option<Box<AnotherType>>, writer: &mut W) {
    writer.context().push("object_method", "Option<Box<AnotherType>>", "writing result");
    if input.object_method.is_some() {
        ObjectMethod::write(input.object_method.as_ref().as_ref().unwrap(), writer);
    } else {
        writer.write_nil();
    }
    writer.context().pop();
}
