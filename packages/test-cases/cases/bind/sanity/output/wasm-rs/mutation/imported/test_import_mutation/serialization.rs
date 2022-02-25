use serde::{Serialize, Deserialize};
use polywrap_wasm_rs::{
    BigInt,
    Context,
    DecodeError,
    EncodeError,
    Read,
    ReadDecoder,
    Write,
    WriteEncoder,
    JSON,
};

use crate::TestImportObject;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputImportedMethod {
    pub str: String,
    pub object: TestImportObject,
    pub object_array: Vec<TestImportObject>,
}

pub fn serialize_imported_method_args(input: &InputImportedMethod) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported query-type: imported_method".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_imported_method_args(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_imported_method_args<W: Write>(input: &InputImportedMethod, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&3)?;
    writer.context().push("str", "String", "writing property");
    writer.write_str("str")?;
    writer.write_str(&input.str)?;
    writer.context().pop();
    writer.context().push("object", "TestImportObject", "writing property");
    writer.write_str("object")?;
    TestImportObject::write(&input.object, writer)?;
    writer.context().pop();
    writer.context().push("object_array", "Vec<TestImportObject>", "writing property");
    writer.write_str("object_array")?;
    writer.write_array(&input.object_array, |writer, item| {
        TestImportObject::write(item, writer)
    })?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_imported_method_result(result: &[u8]) -> Result<Option<TestImportObject>, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported query-type: imported_method".to_string();
    let mut reader = ReadDecoder::new(result, context);
    reader.context().push("imported_method", "Option<TestImportObject>", "reading function output");
    let mut object: Option<TestImportObject> = None;
    if !reader.is_next_nil()? {
        object = Some(TestImportObject::read(&mut reader)?);
    } else {
        object = None;
    }
    let res = object;
    reader.context().pop();
    Ok(res)
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputAnotherMethod {
    pub arg: Vec<String>,
}

pub fn serialize_another_method_args(input: &InputAnotherMethod) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported query-type: another_method".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_another_method_args(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_another_method_args<W: Write>(input: &InputAnotherMethod, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&1)?;
    writer.context().push("arg", "Vec<String>", "writing property");
    writer.write_str("arg")?;
    writer.write_array(&input.arg, |writer, item| {
        writer.write_str(item)
    })?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_another_method_result(result: &[u8]) -> Result<i32, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported query-type: another_method".to_string();
    let mut reader = ReadDecoder::new(result, context);
    reader.context().push("another_method", "i32", "reading function output");
    let res = reader.read_i32()?;
    reader.context().pop();
    Ok(res)
}
