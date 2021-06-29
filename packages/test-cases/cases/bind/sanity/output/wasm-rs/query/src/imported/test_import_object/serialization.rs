use super::super::{get_test_import_enum_value, sanitize_test_import_enum_value};
use super::{TestImportAnotherObject, TestImportEnum, TestImportObject};
use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use std::convert::TryFrom;
use std::io::{Error, ErrorKind, Result};
use wasm_bindgen::UnwrapThrowExt;

pub fn serialize_test_import_object(object: TestImportObject) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description =
        "Serializing (sizing) imported object-type: TestImportObject".to_string();
    let sizer = WriteSizer::new(sizer_context);
    write_test_import_object(sizer.clone(), object.clone());

    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description =
        "Serializing (encoding) imported object-type: TestImportObject".to_string();
    let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
    write_test_import_object(encoder, object.clone());
    buffer
}

pub fn write_test_import_object<W: Write>(mut writer: W, object: TestImportObject) {
    writer.write_map_length(8);
    writer
        .context()
        .push("object", "TestImportAnotherObject", "writing property");
    writer.write_string(&"object".to_string());
    TestImportObject::write(writer.clone(), object.clone());
    writer
        .context()
        .pop()
        .expect_throw("Failed to pop object from Context");
    writer.context().push(
        "opt_object",
        "Option<TestImportAnotherObject>",
        "writing property",
    );
    writer.write_string(&"opt_object".to_string());
    if object.opt_object.is_some() {
        TestImportAnotherObject::write(object.opt_object.clone().unwrap(), writer.clone());
    } else {
        writer.write_nil();
    }
    writer
        .context()
        .pop()
        .expect_throw("Failed to pop optional object from Context");
    writer.context().push(
        "object_array",
        "Vec<TestImportAnotherObject>",
        "writing property",
    );
    writer.write_string(&"object_array".to_string());
    // TODO: writer.write_array();
    writer
        .context()
        .pop()
        .expect_throw("Failed to pop object array from Context");
    writer.context().push(
        "opt_object_array",
        "Option<Vec<TestImportAnotherObject>>",
        "writing property",
    );
    writer.write_string(&"opt_object_array".to_string());
    // TODO: writer.write_nullable_array();
    writer
        .context()
        .pop()
        .expect_throw("Failed to pop optional object array from Context");
    writer
        .context()
        .push("en", "TestImportEnum", "writing property");
    writer.write_string(&"en".to_string());
    writer.write_i32(object.en.clone() as i32);
    writer
        .context()
        .pop()
        .expect_throw("Failed to pop enum from Context");
    writer
        .context()
        .push("opt_enum", "Option<TestImportEnum>", "writing property");
    writer.write_string(&"opt_enum".to_string());
    writer
        .write_nullable_i32(Some(object.opt_enum.clone().unwrap() as i32))
        .expect_throw("Failed to write nullable i32");
    writer
        .context()
        .pop()
        .expect_throw("Failed to pop optional enum from Context");
    writer
        .context()
        .push("enum_array", "Vec<TestImportEnum>>", "writing property");
    writer.write_string(&"enum_array".to_string());
    // TODO: writer.write_array();
    writer
        .context()
        .pop()
        .expect_throw("Failed to pop enum array from Context");
    writer.context().push(
        "opt_enum_array",
        "Option<Vec<TestImportEnum>>>",
        "writing property",
    );
    writer.write_string(&"opt_enum_array".to_string());
    // TODO: writer.write_nullable_array();
    writer
        .context()
        .pop()
        .expect_throw("Failed to pop optional enum array from Context");
}

pub fn deserialize_test_import_object(buffer: &[u8]) -> TestImportObject {
    let mut context = Context::new();
    context.description = "Deserializing imported object-type: TestImportObject".to_string();
    let reader = ReadDecoder::new(buffer, context);
    read_test_import_object(reader).expect_throw("Failed to deserialize TestImportObject")
}

pub fn read_test_import_object<R: Read>(mut reader: R) -> Result<TestImportObject> {
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();

    let mut object = TestImportAnotherObject::new();
    let mut object_set = false;
    let mut opt_object: Option<TestImportAnotherObject> = None;
    let mut object_array: Vec<TestImportAnotherObject> = vec![];
    let mut object_array_set = false;
    let mut opt_object_array: Option<Vec<TestImportAnotherObject>> = None;
    let mut en = TestImportEnum::_MAX_;
    let mut en_set = false;
    let mut opt_enum: Option<TestImportEnum> = None;
    let mut enum_array: Vec<TestImportEnum> = vec![];
    let mut enum_array_set = false;
    let mut opt_enum_array: Option<Vec<TestImportEnum>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "object" => {
                reader.context().push(
                    &field,
                    "TestImportAnotherObject",
                    "type found, reading property",
                );
                object = TestImportAnotherObject::read(reader.clone());
                object_set = true;
                reader
                    .context()
                    .pop()
                    .expect_throw("Failed to pop object from Context");
            }
            "opt_object" => {
                reader.context().push(
                    &field,
                    "Option<TestImportAnotherObject>",
                    "type found, reading property",
                );
                if !reader.is_next_nil() {
                    opt_object = Some(TestImportAnotherObject::read(reader.clone()));
                }
                reader
                    .context()
                    .pop()
                    .expect_throw("Failed to pop optional object from Context");
            }
            "object_array" => {
                reader.context().push(
                    &field,
                    "Vec<TestImportAnotherObject>",
                    "type found, reading property",
                );
                // TODO: object_array = reader.read_array();
                object_array_set = true;
                reader
                    .context()
                    .pop()
                    .expect_throw("Failed to pop object array from Context");
            }
            "opt_object_array" => {
                reader.context().push(
                    &field,
                    "Option<Vec<TestImportAnotherObject>>",
                    "type found, reading property",
                );
                // TODO: opt_object_array = reader.read_nullable_array();
                reader
                    .context()
                    .pop()
                    .expect_throw("Failed to pop optional object array from Context");
            }
            "en" => {
                reader
                    .context()
                    .push(&field, "TestImportEnum", "type found, reading property");
                if reader.is_next_string() {
                    en = get_test_import_enum_value(
                        reader.read_string().unwrap_or_default().as_str(),
                    )
                    .expect_throw("Failed to get test import enum value");
                } else {
                    en = TestImportEnum::try_from(reader.read_i32().unwrap_or_default())
                        .expect_throw("Failed to convert i32 to TestImportEnum");
                    sanitize_test_import_enum_value(en.clone() as i32)
                        .expect_throw("Failed to sanitize test import enum value");
                }
                en_set = true;
                reader
                    .context()
                    .pop()
                    .expect_throw("Failed to pop enum from Context");
            }
            "opt_enum" => {
                reader.context().push(
                    &field,
                    "Option<TestImportEnum>",
                    "type found, reading property",
                );
                if !reader.is_next_nil() {
                    if reader.is_next_string() {
                        opt_enum = Some(
                            get_test_import_enum_value(
                                reader.read_string().unwrap_or_default().as_str(),
                            )
                            .expect_throw("Failed to get optional test import enum value"),
                        );
                    } else {
                        opt_enum = Some(
                            TestImportEnum::try_from(reader.read_i32().unwrap_or_default())
                                .expect_throw("Failed to convert i32 to TestImportEnum"),
                        );
                        sanitize_test_import_enum_value(opt_enum.clone().unwrap() as i32)
                            .expect_throw("Failed to sanitize test import enum value");
                    }
                } else {
                    opt_enum = None;
                }
                reader
                    .context()
                    .pop()
                    .expect_throw("Failed to pop optional enum from Context");
            }
            "enum_array" => {
                reader.context().push(
                    &field,
                    "Vec<TestImportEnum>",
                    "type found, reading property",
                );
                // TODO: enum_array = reader.read_array();
                enum_array_set = true;
                reader
                    .context()
                    .pop()
                    .expect_throw("Failed to pop enum array from Context");
            }
            "opt_enum_array" => {
                reader.context().push(
                    &field,
                    "Option<Vec<TestImportEnum>>",
                    "type found, reading property",
                );
                // TODO: opt_enum_array = reader.read_nullable_array();
                reader
                    .context()
                    .pop()
                    .expect_throw("Failed to pop optional enum array from Context");
            }
            _ => {
                reader
                    .context()
                    .push(&field, "unknown", "searching for property type");
                reader
                    .context()
                    .pop()
                    .expect_throw("Failed to pop unknown object from Context");
            }
        }
    }

    if !object_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'object: TestImportAnotherObject'");
        return Err(Error::new(ErrorKind::Other, custom_error));
    }
    if !object_array_set {
        let custom_error = reader.context().print_with_context(
            "Missing required property: 'object_array: Vec<TestImportAnotherObject>'",
        );
        return Err(Error::new(ErrorKind::Other, custom_error));
    }
    if !en_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'en: TestImportEnum'");
        return Err(Error::new(ErrorKind::Other, custom_error));
    }
    if !enum_array_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'en_array: Vec<TestImportEnum>'");
        return Err(Error::new(ErrorKind::Other, custom_error));
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
