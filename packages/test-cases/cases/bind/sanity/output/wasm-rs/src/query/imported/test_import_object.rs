use super::{TestImportAnotherObject, TestImportEnum};
use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use serde::{Deserialize, Serialize};
use std::convert::TryInto;
use std::io::{Error, ErrorKind, Result};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TestImportObject {
    object: TestImportAnotherObject,
    opt_object: Option<TestImportAnotherObject>,
    object_array: Vec<TestImportAnotherObject>,
    opt_object_array: Option<Vec<TestImportAnotherObject>>,
    en: TestImportEnum,
    opt_enum: Option<TestImportEnum>,
    enum_array: Vec<TestImportEnum>,
    opt_enum_array: Option<Vec<TestImportEnum>>,
}

impl TestImportObject {
    pub fn serialize_test_import_object(&mut self) -> Vec<u8> {
        let mut sizer_context = Context::new();
        sizer_context.description =
            "Serializing (sizing) imported object-type: TestImportObject".to_string();
        let sizer = WriteSizer::new(sizer_context);
        self.write_test_import_object(sizer.clone());

        let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
        let mut encoder_context = Context::new();
        encoder_context.description =
            "Serializing (encoding) imported object-type: TestImportObject".to_string();
        let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
        self.write_test_import_object(encoder);
        buffer
    }

    pub fn write_test_import_object<W: Write>(&mut self, mut writer: W) {
        writer.write_map_length(8);
        writer
            .context()
            .push("object", "TestImportAnotherObject", "writing property");
        writer.write_string("object".to_string());
        self.object.clone().write(writer.to_owned());
        let _ = writer.context().pop();
        writer.context().push(
            "opt_object",
            "Option<TestImportAnotherObject>",
            "writing property",
        );
        writer.write_string("opt_object".to_string());
        if self.opt_object.is_some() {
            self.opt_object.clone().unwrap().write(writer.to_owned());
        } else {
            writer.write_nil();
        }
        let _ = writer.context().pop();
        writer.context().push(
            "object_array",
            "Vec<TestImportAnotherObject>",
            "writing property",
        );
        writer.write_string("object_array".to_string());
        // TODO: writer.write_array();
        let _ = writer.context().pop();
        writer.context().push(
            "opt_object_array",
            "Option<Vec<TestImportAnotherObject>>",
            "writing property",
        );
        writer.write_string("opt_object_array".to_string());
        // TODO: writer.write_nullable_array();
        let _ = writer.context().pop();
        writer
            .context()
            .push("en", "TestImportEnum", "writing property");
        writer.write_string("en".to_string());
        writer.write_i32(self.en.clone() as i32);
        let _ = writer.context().pop();
        writer
            .context()
            .push("opt_enum", "Option<TestImportEnum>", "writing property");
        writer.write_string("opt_enum".to_string());
        let _ = writer.write_nullable_i32(Some(self.opt_enum.clone().unwrap() as i32));
        let _ = writer.context().pop();
        writer
            .context()
            .push("enum_array", "Vec<TestImportEnum>>", "writing property");
        writer.write_string("enum_array".to_string());
        // TODO: writer.write_array();
        let _ = writer.context().pop();
        writer.context().push(
            "opt_enum_array",
            "Option<Vec<TestImportEnum>>>",
            "writing property",
        );
        writer.write_string("opt_enum_array".to_string());
        // TODO: writer.write_nullable_array();
        let _ = writer.context().pop();
    }

    pub fn deserialize_test_import_object(&mut self, buffer: &[u8]) -> Self {
        let mut context = Context::new();
        context.description = "Deserializing imported object-type: TestImportObject".to_string();
        let reader = ReadDecoder::new(buffer, context);
        self.read_test_import_object(reader)
            .expect("Failed to deserialize TestImportObject")
    }

    pub fn read_test_import_object<R: Read>(&mut self, mut reader: R) -> Result<Self> {
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
                    object = self.object.read(reader.clone());
                    object_set = true;
                    let _ = reader.context().pop();
                }
                "opt_object" => {
                    reader.context().push(
                        &field,
                        "Option<TestImportAnotherObject>",
                        "type found, reading property",
                    );
                    if !reader.is_next_nil() {
                        opt_object = Some(self.object.read(reader.clone()));
                    }
                    let _ = reader.context().pop();
                }
                "object_array" => {
                    reader.context().push(
                        &field,
                        "Vec<TestImportAnotherObject>",
                        "type found, reading property",
                    );
                    // TODO: object_array = reader.read_array();
                    object_array_set = true;
                    let _ = reader.context().pop();
                }
                "opt_object_array" => {
                    reader.context().push(
                        &field,
                        "Option<Vec<TestImportAnotherObject>>",
                        "type found, reading property",
                    );
                    // TODO: opt_object_array = reader.read_nullable_array();
                    let _ = reader.context().pop();
                }
                "en" => {
                    reader
                        .context()
                        .push(&field, "TestImportEnum", "type found, reading property");
                    let mut value = TestImportEnum::_MAX_ as i32;
                    if reader.is_next_string() {
                        value = TestImportEnum::get_test_import_enum_value(
                            reader.read_string().unwrap_or_default().as_str(),
                        )
                        .unwrap() as i32;
                    } else {
                        value = reader.read_i32().unwrap_or_default();
                        let _ = TestImportEnum::sanitize_test_import_enum_value(value);
                    }
                    en = value.try_into().unwrap();
                    en_set = true;
                    let _ = reader.context().pop();
                }
                "opt_enum" => {
                    reader.context().push(
                        &field,
                        "Option<TestImportEnum>",
                        "type found, reading property",
                    );
                    let mut value = None;
                    if !reader.is_next_nil() {
                        if reader.is_next_string() {
                            value = Some(
                                TestImportEnum::get_test_import_enum_value(
                                    reader.read_string().unwrap_or_default().as_str(),
                                )
                                .unwrap() as i32,
                            );
                        } else {
                            value = Some(reader.read_i32().unwrap_or_default());
                            let _ = TestImportEnum::sanitize_test_import_enum_value(
                                value.unwrap_or_default(),
                            );
                        }
                    } else {
                        value = None;
                    }
                    opt_enum = Some(value.unwrap().try_into().unwrap());
                    let _ = reader.context().pop();
                }
                "enum_array" => {
                    reader.context().push(
                        &field,
                        "Vec<TestImportEnum>",
                        "type found, reading property",
                    );
                    // TODO: enum_array = reader.read_array();
                    enum_array_set = true;
                    let _ = reader.context().pop();
                }
                "opt_enum_array" => {
                    reader.context().push(
                        &field,
                        "Option<Vec<TestImportEnum>>",
                        "type found, reading property",
                    );
                    // TODO: opt_enum_array = reader.read_nullable_array();
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

        Ok(Self {
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

    pub fn to_buffer(&mut self) -> Vec<u8> {
        self.serialize_test_import_object()
    }

    pub fn from_buffer(&mut self, buffer: &[u8]) -> Self {
        self.deserialize_test_import_object(buffer)
    }

    pub fn write<W: Write>(&mut self, writer: W) {
        self.write_test_import_object(writer);
    }

    pub fn read<R: Read>(&mut self, reader: R) -> Self {
        self.read_test_import_object(reader)
            .expect("Failed to read TestImportObject")
    }
}