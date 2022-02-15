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
    WriteSizer,
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
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) imported query-type: imported_method".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_imported_method_args(input, &mut sizer)?;
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported query-type: imported_method".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_imported_method_args(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_imported_method_args<W: Write>(input: &InputImportedMethod, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&3)?;
    writer.write_str("str")?;
    writer.write_string(&input.str)?;
    writer.write_str("object")?;
    TestImportObject::write(&input.object, writer)?;
    writer.write_str("object_array")?;
    writer.write_array(&input.object_array, |writer, item| {
        TestImportObject::write(item, writer)
    })?;
    Ok(())
}

pub fn deserialize_imported_method_result(result: &[u8]) -> Result<Option<TestImportObject>, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported query-type: imported_method".to_string();
    let mut reader = ReadDecoder::new(result, context);
    if !reader.is_next_nil()? {
        Ok(Some(TestImportObject::read(&mut reader)?))
    } else {
        Ok(None)
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputAnotherMethod {
    pub arg: Vec<String>,
}

pub fn serialize_another_method_args(input: &InputAnotherMethod) -> Result<Vec<u8>, EncodeError> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) imported query-type: another_method".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_another_method_args(input, &mut sizer)?;
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported query-type: another_method".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_another_method_args(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_another_method_args<W: Write>(input: &InputAnotherMethod, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&1)?;
    writer.write_str("arg")?;
    writer.write_array(&input.arg, |writer, item| {
        writer.write_string(item)
    })?;
    Ok(())
}

pub fn deserialize_another_method_result(result: &[u8]) -> Result<i32, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported query-type: another_method".to_string();
    let mut reader = ReadDecoder::new(result, context);
    reader.read_i32()
}
