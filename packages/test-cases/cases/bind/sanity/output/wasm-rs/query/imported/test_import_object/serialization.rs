use crate::TestImportAnotherObject;
use crate::TestImportObject;
use crate::{
    get_test_import_enum_value,
    sanitize_test_import_enum_value,
    TestImportEnum,
};
use alloc::{
    string::{
        String,
        ToString,
    },
    vec,
    vec::Vec,
};
use core::convert::TryFrom;
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

pub fn serialize_test_import_object(input: &TestImportObject) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description =
        "Serializing (sizing) imported object-type: TestImportObject".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_test_import_object(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description =
        "Serializing (encoding) imported object-type: TestImportObject".to_string();
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_test_import_object(input, &mut encoder);
    buffer
}

pub fn write_test_import_object<W: Write>(input: &TestImportObject, writer: &mut W) {
    writer.write_map_length(8);
    writer
        .context()
        .push("object", "TestImportAnotherObject", "writing property");
    writer.write_str("object");
    TestImportAnotherObject::write(&input.object, writer);
    writer.context().pop();
    writer.context().push(
        "opt_object",
        "Option<TestImportAnotherObject>",
        "writing property",
    );
    writer.write_str("opt_object");
    if input.opt_object.is_some() {
        TestImportAnotherObject::write(input.opt_object.as_ref().unwrap(), writer);
    } else {
        writer.write_nil();
    }
    writer.context().pop();
    writer.context().push(
        "object_array",
        "Vec<TestImportAnotherObject>",
        "writing property",
    );
    writer.write_str("object_array");
    writer.write_array(&input.object_array, |writer: &mut W, item| {
        TestImportAnotherObject::write(item, writer);
    });
    writer.context().pop();
    writer.context().push(
        "opt_object_array",
        "Option<Vec<Option<TestImportAnotherObject>>>",
        "writing property",
    );
    writer.write_str("opt_object_array");
    writer.write_nullable_array(&input.opt_object_array, |writer: &mut W, item| {
        if item.is_some() {
            TestImportAnotherObject::write(item.as_ref().unwrap(), writer);
        } else {
            writer.write_nil();
        }
    });
    writer.context().pop();
    writer
        .context()
        .push("en", "TestImportEnum", "writing property");
    writer.write_str("en");
    writer.write_i32(input.en as i32);
    writer.context().pop();
    writer
        .context()
        .push("opt_enum", "Option<TestImportEnum>", "writing property");
    writer.write_str("opt_enum");
    writer.write_nullable_i32(&Some(input.opt_enum.unwrap() as i32));
    writer.context().pop();
    writer
        .context()
        .push("enum_array", "Vec<TestImportEnum>", "writing property");
    writer.write_str("enum_array");
    writer.write_array(&input.enum_array, |writer: &mut W, item| {
        writer.write_i32(*item as i32);
    });
    writer.context().pop();
    writer.context().push(
        "opt_enum_array",
        "Option<Vec<Option<TestImportEnum>>>",
        "writing property",
    );
    writer.write_str("opt_enum_array");
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
    let mut num_of_fields = reader.read_map_length().unwrap();

    let mut _object: TestImportAnotherObject = TestImportAnotherObject::new();
    let mut _object_set = false;
    let mut _opt_object: Option<TestImportAnotherObject> = None;
    let mut _object_array: Vec<TestImportAnotherObject> = vec![];
    let mut _object_array_set = false;
    let mut _opt_object_array: Option<Vec<Option<TestImportAnotherObject>>> = None;
    let mut _en: TestImportEnum = TestImportEnum::_MAX_;
    let mut _en_set = false;
    let mut _opt_enum: Option<TestImportEnum> = None;
    let mut _enum_array: Vec<TestImportEnum> = vec![];
    let mut _enum_array_set = false;
    let mut _opt_enum_array: Option<Vec<Option<TestImportEnum>>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap();

        match field.as_str() {
            "object" => {
                reader.context().push(
                    &field,
                    "TestImportAnotherObject",
                    "type found, reading property",
                );
                let object = TestImportAnotherObject::read(reader);
                _object = object;
                _object_set = true;
                reader.context().pop();
            }
            "opt_object" => {
                reader.context().push(
                    &field,
                    "Option<TestImportAnotherObject>",
                    "type found, reading property",
                );
                let mut object: Option<TestImportAnotherObject> = None;
                if !reader.is_next_nil() {
                    object = Some(TestImportAnotherObject::read(reader));
                }
                _opt_object = object;
                reader.context().pop();
            }
            "object_array" => {
                reader.context().push(
                    &field,
                    "Vec<TestImportAnotherObject>",
                    "type found, reading property",
                );
                _object_array = reader
                    .read_array(|reader| {
                        let object = TestImportAnotherObject::read(reader);
                        return object;
                    })
                    .expect("Failed to read array");
                _object_array_set = true;
                reader.context().pop();
            }
            "opt_object_array" => {
                reader.context().push(
                    &field,
                    "Option<Vec<Option<TestImportAnotherObject>>>",
                    "type found, reading property",
                );
                _opt_object_array = reader.read_nullable_array(|reader| {
                    let mut object: Option<TestImportAnotherObject> = None;
                    if !reader.is_next_nil() {
                        object = Some(TestImportAnotherObject::read(reader));
                    }
                    return object;
                });
                reader.context().pop();
            }
            "en" => {
                reader
                    .context()
                    .push(&field, "TestImportEnum", "type found, reading property");
                let mut value = TestImportEnum::_MAX_;
                if reader.is_next_string() {
                    value = get_test_import_enum_value(&reader.read_string().unwrap())
                        .expect("Failed to get TestImportEnum value");
                } else {
                    value = TestImportEnum::try_from(reader.read_i32().unwrap())
                        .expect("Failed to convert i32 to TestImportEnum");
                    sanitize_test_import_enum_value(value as i32)
                        .expect("Failed to sanitize TestImportEnum");
                }
                _en = value;
                _en_set = true;
                reader.context().pop();
            }
            "opt_enum" => {
                reader.context().push(
                    &field,
                    "Option<TestImportEnum>",
                    "type found, reading property",
                );
                let mut value: Option<TestImportEnum> = None;
                if !reader.is_next_nil() {
                    if reader.is_next_string() {
                        value = Some(
                            get_test_import_enum_value(&reader.read_string().unwrap())
                                .expect("Failed to get Option<TestImportEnum> value"),
                        );
                    } else {
                        value = Some(
                            TestImportEnum::try_from(reader.read_i32().unwrap())
                                .expect("Failed to convert i32 to Option<TestImportEnum>"),
                        );
                        sanitize_test_import_enum_value(value.unwrap() as i32)
                            .expect("Failed to sanitize Option<TestImportEnum>");
                    }
                } else {
                    value = None;
                }
                _opt_enum = value;
                reader.context().pop();
            }
            "enum_array" => {
                reader.context().push(
                    &field,
                    "Vec<TestImportEnum>",
                    "type found, reading property",
                );
                _enum_array = reader
                    .read_array(|reader| {
                        let mut value = TestImportEnum::_MAX_;
                        if reader.is_next_string() {
                            value = get_test_import_enum_value(&reader.read_string().unwrap())
                                .expect("Failed to get TestImportEnum value");
                        } else {
                            value = TestImportEnum::try_from(reader.read_i32().unwrap())
                                .expect("Failed to convert i32 to TestImportEnum");
                            sanitize_test_import_enum_value(value as i32)
                                .expect("Failed to sanitize TestImportEnum");
                        }
                        return value;
                    })
                    .expect("Failed to read array");
                _enum_array_set = true;
                reader.context().pop();
            }
            "opt_enum_array" => {
                reader.context().push(
                    &field,
                    "Option<Vec<Option<TestImportEnum>>>",
                    "type found, reading property",
                );
                _opt_enum_array = reader.read_nullable_array(|reader| {
                    let mut value: Option<TestImportEnum> = None;
                    if !reader.is_next_nil() {
                        if reader.is_next_string() {
                            value = Some(
                                get_test_import_enum_value(&reader.read_string().unwrap())
                                    .expect("Failed to get Option<TestImportEnum> value"),
                            );
                        } else {
                            value = Some(
                                TestImportEnum::try_from(reader.read_i32().unwrap())
                                    .expect("Failed to convert i32 to Option<TestImportEnum>"),
                            );
                            sanitize_test_import_enum_value(value.unwrap() as i32)
                                .expect("Failed to sanitize Option<TestImportEnum>");
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
    if !_object_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'object: TestImport_AnotherObject'");
        return Err(custom_error);
    }
    if !_object_array_set {
        let custom_error = reader.context().print_with_context(
            "Missing required property: 'objectArray: [TestImport_AnotherObject]'",
        );
        return Err(custom_error);
    }
    if !_en_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'en: TestImport_Enum'");
        return Err(custom_error);
    }
    if !_enum_array_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'enumArray: [TestImport_Enum]'");
        return Err(custom_error);
    }

    Ok(TestImportObject {
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