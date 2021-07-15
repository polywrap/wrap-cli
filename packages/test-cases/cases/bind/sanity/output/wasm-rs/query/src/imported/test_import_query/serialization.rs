use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use crate::{TestImportEnum, TestImportObject};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputImportedMethod {
    pub string: String,
    pub opt_string: Option<String>,
    pub u: u32,
    pub opt_u: Option<u32>,
    pub u_array_array: Vec<Vec<u32>>,
    pub object: TestImportObject,
    pub opt_object: Option<TestImportObject>,
    pub object_array: Vec<TestImportObject>,
    pub opt_object_array: Option<Vec<TestImportObject>>,
    pub en: TestImportEnum,
    pub opt_enum: Option<TestImportEnum>,
    pub enum_array: Vec<TestImportEnum>,
    pub opt_enum_array: Option<Vec<TestImportEnum>>,
}

pub fn serialize_imported_method_args(input: &InputImportedMethod) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description =
        "Serializing (sizing) imported query-type: InputImportedMethod".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_imported_method_args(&input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description =
        "Serializing (encoding) imported query-type: InputImportedMethod".to_string();
    let mut encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
    write_imported_method_args(input, &mut encoder);
    buffer
}

pub fn write_imported_method_args<W: Write>(input: &InputImportedMethod, writer: &mut W) {
    writer.write_map_length(13);
    writer
        .context()
        .push("string", "String", "writing property");
    writer.write_string(&"string".to_string());
    writer.write_string(&input.string);
    writer
        .context()
        .pop()
        .expect("Failed to pop String from Context");
    writer
        .context()
        .push("opt_string", "Option<String>", "writing property");
    writer.write_string(&"opt_string".to_string());
    writer.write_nullable_string(&input.opt_string);
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<String> from Context");
    writer.context().push("u", "u32", "writing property");
    writer.write_string(&"u".to_string());
    writer.write_u32(&input.u);
    writer
        .context()
        .pop()
        .expect("Failed to pop u32 from Context");
    writer
        .context()
        .push("opt_u", "Option<u32>", "writing property");
    writer.write_string(&"opt_u".to_string());
    writer.write_nullable_u32(&input.opt_u);
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<u32> from Context");

    writer
        .context()
        .push("u_array_array", "Vec<Vec<u32>>", "writing property");
    writer.write_string(&"u_array_array".to_string());
    writer.write_array(input.u_array_array.as_slice(), |writer: &mut W, item| {
        writer.write_array(item.as_slice(), Write::write_u32)
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Vec<Vec<u32>> from Context");

    writer
        .context()
        .push("object", "TestImportObject", "writing property");
    writer.write_string(&"object".to_string());
    TestImportObject::write(&input.object, writer);
    writer
        .context()
        .pop()
        .expect("Failed to pop TestImportObject from Context");
    writer
        .context()
        .push("opt_object", "Option<TestImportObject>", "writing property");
    writer.write_string(&"opt_object".to_string());
    if input.opt_object.is_some() {
        TestImportObject::write(&input.opt_object.as_ref().unwrap(), writer);
    } else {
        writer.write_nil();
    }
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<TestImportObject> from Context");
    writer
        .context()
        .push("object_array", "Vec<TestImportObject>", "writing property");
    writer.write_string(&"object_array".to_string());
    writer.write_array(input.object_array.as_slice(), |writer: &mut W, item| {
        TestImportObject::write(item, writer)
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Vec<TestImportObject> from Context");
    writer.context().push(
        "opt_object_array",
        "Option<Vec<TestImportObject>>",
        "writing property",
    );
    writer.write_string(&"opt_object_array".to_string());
    writer.write_nullable_array(&input.opt_object_array, |writer: &mut W, item| {
        TestImportObject::write(item, writer)
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<Vec<TestImportObject>> from Context");
    writer
        .context()
        .push("en", "TestImportEnum", "writing property");
    writer.write_string(&"en".to_string());
    writer.write_i32(&(input.en as i32));
    writer
        .context()
        .pop()
        .expect("Failed to pop TestImportEnum from Context");
    writer
        .context()
        .push("opt_enum", "Option<TestImportEnum>", "writing property");
    writer.write_string(&"opt_enum".to_string());
    writer.write_nullable_i32(Some(input.opt_enum.unwrap() as i32));
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<TestImportEnum> from Context");
    writer
        .context()
        .push("enum_array", "Vec<TestImportEnum>", "writing property");
    writer.write_string(&"enum_array".to_string());
    writer.write_array(input.enum_array.as_slice(), |writer: &mut W, item| {
        writer.write_i32(&(*item as i32))
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Vec<TestImportEnum> from Context");
    writer.context().push(
        "opt_enum_array",
        "Option<Vec<CustomEnum>>",
        "writing property",
    );
    writer.write_string(&"opt_enum_array".to_string());
    writer.write_nullable_array(&input.opt_enum_array, |writer: &mut W, item| {
        writer.write_i32(&(*item as i32))
    });
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<Vec<CustomEnum>> from Context");
}

pub fn deserialize_imported_method_result(buffer: &[u8]) -> TestImportObject {
    let mut context = Context::new();
    context.description = "Deserializing imported query-type: ImportedMethod".to_string();
    let mut reader = ReadDecoder::new(buffer, context);

    reader.context().push(
        "imported_method",
        "TestImportObject",
        "reading function output",
    );
    let mut object: Option<TestImportObject> = None;
    if !reader.is_next_nil() {
        object = Some(TestImportObject::read(&mut reader));
    }
    let object = object.unwrap();
    reader
        .context()
        .pop()
        .expect("Failed to pop `ImportedMethod` from Context");
    object
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct InputAnotherMethod {
    args: Vec<String>,
}

impl InputAnotherMethod {
    pub fn new() -> Self {
        Self { args: vec![] }
    }
}

pub fn serialize_another_method_args(input: &InputAnotherMethod) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description =
        "Serializing (sizing) imported query-type: InputAnotherMethod".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_another_method_args(&input, &mut sizer);

    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description =
        "Serializing (encoding) imported query-type: InputAnotherMethod".to_string();
    let mut encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
    write_another_method_args(input, &mut encoder);
    buffer
}

pub fn write_another_method_args<W: Write>(input: &InputAnotherMethod, writer: &mut W) {
    writer.write_map_length(1);
    writer
        .context()
        .push("args", "Vec<String>", "writing property");
    writer.write_string(&"args".to_string());
    writer.write_array(input.args.as_slice(), Write::write_string);
    writer
        .context()
        .pop()
        .expect("Failed to pop `Vec<String>` from Context");
}

pub fn deserialize_another_method_result(buffer: &[u8]) -> i64 {
    let mut context = Context::new();
    context.description = "Deserializing imported query-type: InputAnotherMethod".to_string();
    let mut reader = ReadDecoder::new(buffer, context);
    reader
        .context()
        .push("another_method", "i64", "reading function output");
    let result = reader.read_i64().unwrap_or_default();
    reader
        .context()
        .pop()
        .expect("Failed to pop `i64` from Context");
    result
}
