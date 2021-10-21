use polywrap_wasm_rs::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};

use crate::TestImportObject;
use crate::{get_test_import_enum_value, sanitize_test_import_enum_value, TestImportEnum};

#[derive(Clone, Debug)]
pub struct InputImportedMethod {
    pub str: String,
    pub opt_str: Option<String>,
    pub u: u32,
    pub opt_u: Option<u32>,
    pub u_array_array: Vec<Option<Vec<Option<u32>>>>,
    pub object: TestImportObject,
    pub opt_object: Option<TestImportObject>,
    pub object_array: Vec<TestImportObject>,
    pub opt_object_array: Option<Vec<Option<TestImportObject>>>,
    pub en: TestImportEnum,
    pub opt_enum: Option<TestImportEnum>,
    pub enum_array: Vec<TestImportEnum>,
    pub opt_enum_array: Option<Vec<Option<TestImportEnum>>>,
}

pub fn serialize_imported_method_args(input: &InputImportedMethod) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description =
        "Serializing (sizing) imported query-type: imported_method".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_imported_method_args(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description =
        "Serializing (encoding) imported query-type: imported_method".to_string();
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_imported_method_args(input, &mut encoder);
    buffer
}

pub fn write_imported_method_args<W: Write>(input: &InputImportedMethod, writer: &mut W) {
    writer.write_map_length(13);
    writer.context().push("str", "String", "writing property");
    writer.write_str("str");
    writer.write_string(&input.str);
    writer.context().pop();
    writer
        .context()
        .push("opt_str", "Option<String>", "writing property");
    writer.write_str("opt_str");
    writer.write_nullable_string(&input.opt_str);
    writer.context().pop();
    writer.context().push("u", "u32", "writing property");
    writer.write_str("u");
    writer.write_u32(input.u);
    writer.context().pop();
    writer
        .context()
        .push("opt_u", "Option<u32>", "writing property");
    writer.write_str("opt_u");
    writer.write_nullable_u32(&input.opt_u);
    writer.context().pop();
    writer.context().push(
        "u_array_array",
        "Vec<Option<Vec<Option<u32>>>>",
        "writing property",
    );
    writer.write_str("u_array_array");
    writer.write_array(&input.u_array_array, |writer: &mut W, item| {
        writer.write_nullable_array(item, |writer: &mut W, item| {
            writer.write_nullable_u32(item);
        });
    });
    writer.context().pop();
    writer
        .context()
        .push("object", "TestImportObject", "writing property");
    writer.write_str("object");
    TestImportObject::write(&input.object, writer);
    writer.context().pop();
    writer
        .context()
        .push("opt_object", "Option<TestImportObject>", "writing property");
    writer.write_str("opt_object");
    if input.opt_object.is_some() {
        TestImportObject::write(input.opt_object.as_ref().as_ref().unwrap(), writer);
    } else {
        writer.write_nil();
    }
    writer.context().pop();
    writer
        .context()
        .push("object_array", "Vec<TestImportObject>", "writing property");
    writer.write_str("object_array");
    writer.write_array(&input.object_array, |writer: &mut W, item| {
        TestImportObject::write(item, writer);
    });
    writer.context().pop();
    writer.context().push(
        "opt_object_array",
        "Option<Vec<Option<TestImportObject>>>",
        "writing property",
    );
    writer.write_str("opt_object_array");
    writer.write_nullable_array(&input.opt_object_array, |writer: &mut W, item| {
        if item.is_some() {
            TestImportObject::write(item.as_ref().as_ref().unwrap(), writer);
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

pub fn deserialize_imported_method_result(result: &[u8]) -> Option<TestImportObject> {
    let mut context = Context::new();
    context.description = "Deserializing imported query-type: imported_method".to_string();
    let mut reader = ReadDecoder::new(result, context);
    reader.context().push(
        "imported_method",
        "Option<TestImportObject>",
        "reading function output",
    );
    let mut object: Option<TestImportObject> = None;
    if !reader.is_next_nil() {
        object = Some(TestImportObject::read(&mut reader));
    }
    let res = object;
    reader.context().pop();
    res
}

#[derive(Clone, Debug)]
pub struct InputAnotherMethod {
    pub arg: Vec<String>,
}

pub fn serialize_another_method_args(input: &InputAnotherMethod) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description =
        "Serializing (sizing) imported query-type: another_method".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_another_method_args(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description =
        "Serializing (encoding) imported query-type: another_method".to_string();
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_another_method_args(input, &mut encoder);
    buffer
}

pub fn write_another_method_args<W: Write>(input: &InputAnotherMethod, writer: &mut W) {
    writer.write_map_length(1);
    writer
        .context()
        .push("arg", "Vec<String>", "writing property");
    writer.write_str("arg");
    writer.write_array(&input.arg, |writer: &mut W, item| {
        writer.write_string(item);
    });
    writer.context().pop();
}

pub fn deserialize_another_method_result(result: &[u8]) -> i32 {
    let mut context = Context::new();
    context.description = "Deserializing imported query-type: another_method".to_string();
    let mut reader = ReadDecoder::new(result, context);
    reader
        .context()
        .push("another_method", "i32", "reading function output");
    let res = reader.read_i32().unwrap();
    reader.context().pop();
    res
}
