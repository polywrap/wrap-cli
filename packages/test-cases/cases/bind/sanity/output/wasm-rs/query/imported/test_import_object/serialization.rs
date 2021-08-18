use crate::{
    get_test_import_enum_value, 
    sanitize_test_import_enum_value, 
    TestImportAnotherObject,
    TestImportEnum, 
    TestImportObject,
};
use polywrap_wasm_rs::{
    Context, 
    Read, 
    ReadDecoder, 
    Write, 
    WriteEncoder, 
    WriteSizer,
};
use std::convert::TryFrom;

pub fn serialize_test_import_object(input: &TestImportObject) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) imported object-type: TestImportObject".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_test_import_object(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported object-type: TestImportObject".to_string();
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_test_import_object(input, &mut encoder);
    buffer
}

pub fn write_test_import_object<W: Write>(input: &TestImportObject, writer: &mut W) {
    writer.write_map_length(8);
    writer.context().push("object", "TestImportAnotherObject", "writing property");
    writer.write_string("object");
    TestImportObject::write(input, writer);
    writer.context().pop();
    writer.context().push("opt_object", "Option<TestImportAnotherObject>", "writing property");
    writer.write_string("opt_object");
    if input.opt_object.is_some() {
        TestImportAnotherObject::write(input.opt_object.as_ref().as_ref().unwrap(), writer);
    } else {
        writer.write_nil();
    }
    writer.context().pop();
    writer.context().push("object_array", "Vec<TestImportAnotherObject>", "writing property");
    writer.write_string("object_array");
    writer.write_array(&input.object_array, |writer: &mut W, item| {
        TestImportAnotherObject::write(item, writer);
    });
    writer.context().pop();
    writer.context().push("opt_object_array", "Option<Vec<Option<TestImportAnotherObject>>>", "writing property");
    writer.write_string("opt_object_array");
    writer.write_nullable_array(&input.opt_object_array, |writer: &mut W, item| {
        if item.is_some() {
            TestImportAnotherObject::write(item.as_ref().as_ref().unwrap(), writer);
        } else {
            writer.write_nil();
        }
    });
    writer.context().pop();
    writer.context().push("en", "TestImportEnum", "writing property");
    writer.write_string("en");
    writer.write_i32(input.en as i32);
    writer.context().pop();
    writer.context().push("opt_enum", "Option<TestImportEnum>", "writing property");
    writer.write_string("opt_enum");
    writer.write_nullable_i32(&Some(input.opt_enum.unwrap() as i32));
    writer.context().pop();
    writer.context().push("enum_array", "Vec<TestImportEnum>", "writing property");
    writer.write_string("enum_array");
    writer.write_array(&input.enum_array, |writer: &mut W, item| {
        writer.write_i32(*item as i32);
    });
    writer.context().pop();
    writer.context().push("opt_enum_array", "Option<Vec<Option<TestImportEnum>>>", "writing property");
    writer.write_string("opt_enum_array");
    writer.write_nullable_array(&input.opt_enum_array, |writer: &mut W, item| {
        writer.write_nullable_i32(&Some(item.unwrap() as i32));
    });
    writer.context().pop();
}

pub fn deserialize_test_import_object(input: &[u8]) -> TestImportObject {
    let mut context = Context::new();
    context.description = "Deserializing imported object-type: TestImportObject".to_string();
    let mut reader = ReadDecoder::new(input, context);
    read_test_import_object(&mut reader).expect("Failed to deserialize TestImportObject")
}

pub fn read_test_import_object<R: Read>(reader: &mut R) -> Result<TestImportObject, String> {
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();

    let mut object = TestImportAnotherObject {
        prop: String::new(),
    };
    let mut object_set = false;
    let mut opt_object: Option<TestImportAnotherObject> = None;
    let mut object_array: Vec<TestImportAnotherObject> = vec![];
    let mut object_array_set = false;
    let mut opt_object_array: Option<Vec<Option<TestImportAnotherObject>>> = None;
    let mut en = TestImportEnum::_MAX_;
    let mut en_set = false;
    let mut opt_enum: Option<TestImportEnum> = None;
    let mut enum_array: Vec<TestImportEnum> = vec![];
    let mut enum_array_set = false;
    let mut opt_enum_array: Option<Vec<Option<TestImportEnum>>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "object" => {
                reader.context().push(&field, "TestImportAnotherObject", "type found, reading property");
                let obj = TestImportAnotherObject::read(reader);
                object = obj;
                object_set = true;
                reader.context().pop();
            }
            "opt_object" => {
                reader.context().push(&field, "Option<TestImportAnotherObject>", "type found, reading property");
                let mut opt_obj: Option<TestImportAnotherObject> = None;
                if !reader.is_next_nil() {
                    opt_obj = Some(TestImportAnotherObject::read(reader));
                }
                opt_object = opt_obj;
                reader.context().pop();
            }
            "object_array" => {
                reader.context().push(&field, "Vec<TestImportAnotherObject>", "type found, reading property");
                object_array = reader.read_array(|reader| {
                    let obj = TestImportAnotherObject::read(reader);
                    obj
                }).expect("Failed to read array");
                object_array_set = true;
                reader.context().pop();
            }
            "opt_object_array" => {
                reader.context().push(&field, "Option<Vec<Option<TestImportAnotherObject>>>", "type found, reading property");
                opt_object_array = reader.read_nullable_array(|reader| {
                    let mut opt_obj: Option<TestImportAnotherObject> = None;
                    if !reader.is_next_nil() {
                        opt_obj = Some(TestImportAnotherObject::read(reader));
                    }
                    opt_obj
                });
                reader.context().pop();
            }
            "en" => {
                reader.context().push(&field, "TestImportEnum", "type found, reading property");
                let mut value = TestImportEnum::_MAX_;
                if reader.is_next_string() {
                    value = get_test_import_enum_value(&reader.read_string().unwrap_or_default())
                        .expect("Failed to get TestImportEnum value");
                } else {
                    value = TestImportEnum::try_from(reader.read_i32().unwrap_or_default())
                        .expect("Failed to convert i32 to TestImportEnum");
                    sanitize_test_import_enum_value(value as i32)
                        .expect("Failed to sanitize TestImportEnum value");
                }
                en = value;
                en_set = true;
                reader.context().pop();
            }
            "opt_enum" => {
                reader.context().push(&field, "Option<TestImportEnum>", "type found, reading property");
                let mut value: Option<TestImportEnum> = None;
                if !reader.is_next_nil() {
                    if reader.is_next_string() {
                        value = Some(get_test_import_enum_value(&reader.read_string().unwrap_or_default())
                            .expect("Failed to get Option<TestImportEnum> value"));
                    } else {
                        value = Some(TestImportEnum::try_from(reader.read_i32().unwrap_or_default())
                            .expect("Failed to convert i32 to Option<TestImportEnum>"));
                        sanitize_test_import_enum_value(value.unwrap() as i32)
                            .expect("Failed to sanitize Option<TestImportEnum> value");
                    }
                } else {
                    value = None;
                }
                opt_enum = value;
                reader.context().pop();
            }
            "enum_array" => {
                reader.context().push(&field, "Vec<TestImportEnum>", "type found, reading property");
                enum_array = reader.read_array(|reader| {
                    let mut value = TestImportEnum::_MAX_;
                    if reader.is_next_string() {
                        value = get_test_import_enum_value(&reader.read_string().unwrap_or_default())
                            .expect("Failed to get Vec<TestImportEnum> value");
                    } else {
                        value = TestImportEnum::try_from(reader.read_i32().unwrap_or_default())
                            .expect("Failed to convert i32 to Vec<TestImportEnum>");
                        sanitize_test_import_enum_value(value as i32)
                            .expect("Failed to sanitize Vec<TestImportEnum>");
                    }
                    value
                }).expect("Failed to read array");
                enum_array_set = true;
                reader.context().pop();
            }
            "opt_enum_array" => {
                reader.context().push(&field, "Option<Vec<Option<TestImportEnum>>>", "type found, reading property");
                opt_enum_array = reader.read_nullable_array(|reader| {
                    let mut value: Option<TestImportEnum> = None;
                    if !reader.is_next_nil() {
                        if reader.is_next_string() {
                            value = Some(get_test_import_enum_value(&reader.read_string().unwrap_or_default())
                                .expect("Failed to get Option<Vec<Option<TestImportEnum>>> value"));
                        } else {
                            value = Some(TestImportEnum::try_from(reader.read_i32().unwrap_or_default())
                                .expect("Failed to convert i32 to Option<Vec<Option<TestImportEnum>>>"));
                            sanitize_test_import_enum_value(value.unwrap() as i32)
                                .expect("Failed to sanitize Option<Vec<Option<TestImportEnum>>>");
                        }
                    } else {
                        value = None;
                    }
                    value
                });
                reader.context().pop();
            }
            _ => {}
        }
    }
    if !object_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'object: TestImportAnotherObject'");
        return Err(custom_error);
    }
    if !object_array_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'object_array: Vec<TestImportAnotherObject>'");
        return Err(custom_error);
    }
    if !en_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'en: TestImportEnum'");
        return Err(custom_error);
    }
    if !enum_array_set {
        let custom_error = reader.context().print_with_context("Missing required property: 'en_array: Vec<TestImportEnum>'");
        return Err(custom_error);
    }

    Ok(TestImportObject {
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