use serde::{Serialize, Deserialize};
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
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
use crate::{
    TestImportEnum,
    get_test_import_enum_value,
    sanitize_test_import_enum_value
};

#[derive(Clone, Debug, Deserialize, Serialize)]
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

pub fn serialize_imported_method_args(input: &InputImportedMethod) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported module-type: imported_method".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_imported_method_args(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_imported_method_args<W: Write>(input: &InputImportedMethod, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&13)?;
    writer.context().push("str", "String", "writing property");
    writer.write_string("str")?;
    writer.write_string(&input.str)?;
    writer.context().pop();
    writer.context().push("optStr", "Option<String>", "writing property");
    writer.write_string("optStr")?;
    writer.write_nullable_string(&input.opt_str)?;
    writer.context().pop();
    writer.context().push("u", "u32", "writing property");
    writer.write_string("u")?;
    writer.write_u32(&input.u)?;
    writer.context().pop();
    writer.context().push("optU", "Option<u32>", "writing property");
    writer.write_string("optU")?;
    writer.write_nullable_u32(&input.opt_u)?;
    writer.context().pop();
    writer.context().push("uArrayArray", "Vec<Option<Vec<Option<u32>>>>", "writing property");
    writer.write_string("uArrayArray")?;
    writer.write_array(&input.u_array_array, |writer, item| {
        writer.write_nullable_array(item, |writer, item| {
            writer.write_nullable_u32(item)
        })
    })?;
    writer.context().pop();
    writer.context().push("object", "TestImportObject", "writing property");
    writer.write_string("object")?;
    TestImportObject::write(&input.object, writer)?;
    writer.context().pop();
    writer.context().push("optObject", "Option<TestImportObject>", "writing property");
    writer.write_string("optObject")?;
    if input.opt_object.is_some() {
        TestImportObject::write(input.opt_object.as_ref().as_ref().unwrap(), writer)?;
    } else {
        writer.write_nil()?;
    }
    writer.context().pop();
    writer.context().push("objectArray", "Vec<TestImportObject>", "writing property");
    writer.write_string("objectArray")?;
    writer.write_array(&input.object_array, |writer, item| {
        TestImportObject::write(item, writer)
    })?;
    writer.context().pop();
    writer.context().push("optObjectArray", "Option<Vec<Option<TestImportObject>>>", "writing property");
    writer.write_string("optObjectArray")?;
    writer.write_nullable_array(&input.opt_object_array, |writer, item| {
        if item.is_some() {
            TestImportObject::write(item.as_ref().as_ref().unwrap(), writer)
        } else {
            writer.write_nil()
        }
    })?;
    writer.context().pop();
    writer.context().push("en", "TestImportEnum", "writing property");
    writer.write_string("en")?;
    writer.write_i32(&(input.en as i32))?;
    writer.context().pop();
    writer.context().push("optEnum", "Option<TestImportEnum>", "writing property");
    writer.write_string("optEnum")?;
    writer.write_nullable_i32(&input.opt_enum.map(|f| f as i32))?;
    writer.context().pop();
    writer.context().push("enumArray", "Vec<TestImportEnum>", "writing property");
    writer.write_string("enumArray")?;
    writer.write_array(&input.enum_array, |writer, item| {
        writer.write_i32(&(*item as i32))
    })?;
    writer.context().pop();
    writer.context().push("optEnumArray", "Option<Vec<Option<TestImportEnum>>>", "writing property");
    writer.write_string("optEnumArray")?;
    writer.write_nullable_array(&input.opt_enum_array, |writer, item| {
        writer.write_nullable_i32(&item.map(|f| f as i32))
    })?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_imported_method_result(result: &[u8]) -> Result<Option<TestImportObject>, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported module-type: imported_method".to_string();
    let mut reader = ReadDecoder::new(result, context);

    reader.context().push("importedMethod", "Option<TestImportObject>", "reading function output");
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
    encoder_context.description = "Serializing (encoding) imported module-type: another_method".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_another_method_args(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_another_method_args<W: Write>(input: &InputAnotherMethod, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&1)?;
    writer.context().push("arg", "Vec<String>", "writing property");
    writer.write_string("arg")?;
    writer.write_array(&input.arg, |writer, item| {
        writer.write_string(item)
    })?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_another_method_result(result: &[u8]) -> Result<i32, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported module-type: another_method".to_string();
    let mut reader = ReadDecoder::new(result, context);

    reader.context().push("anotherMethod", "i32", "reading function output");
    let res = reader.read_i32()?;
    reader.context().pop();
    Ok(res)
}
