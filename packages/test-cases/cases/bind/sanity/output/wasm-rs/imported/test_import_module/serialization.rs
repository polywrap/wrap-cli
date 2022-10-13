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
pub struct ArgsImportedMethod {
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

pub fn deserialize_imported_method_args(args: &[u8]) -> Result<ArgsImportedMethod, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported module-type: imported_method Args".to_string();

    let mut reader = ReadDecoder::new(args, context);
    let mut num_of_fields = reader.read_map_length()?;

    let mut _str: String = String::new();
    let mut _str_set = false;
    let mut _opt_str: Option<String> = None;
    let mut _u: u32 = 0;
    let mut _u_set = false;
    let mut _opt_u: Option<u32> = None;
    let mut _u_array_array: Vec<Option<Vec<Option<u32>>>> = vec![];
    let mut _u_array_array_set = false;
    let mut _object: TestImportObject = TestImportObject::new();
    let mut _object_set = false;
    let mut _opt_object: Option<TestImportObject> = None;
    let mut _object_array: Vec<TestImportObject> = vec![];
    let mut _object_array_set = false;
    let mut _opt_object_array: Option<Vec<Option<TestImportObject>>> = None;
    let mut _en: TestImportEnum = TestImportEnum::_MAX_;
    let mut _en_set = false;
    let mut _opt_enum: Option<TestImportEnum> = None;
    let mut _enum_array: Vec<TestImportEnum> = vec![];
    let mut _enum_array_set = false;
    let mut _opt_enum_array: Option<Vec<Option<TestImportEnum>>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "str" => {
                reader.context().push(&field, "String", "type found, reading argument");
                _str = reader.read_string()?;
                _str_set = true;
                reader.context().pop();
            }
            "optStr" => {
                reader.context().push(&field, "Option<String>", "type found, reading argument");
                _opt_str = reader.read_optional_string()?;
                reader.context().pop();
            }
            "u" => {
                reader.context().push(&field, "u32", "type found, reading argument");
                _u = reader.read_u32()?;
                _u_set = true;
                reader.context().pop();
            }
            "optU" => {
                reader.context().push(&field, "Option<u32>", "type found, reading argument");
                _opt_u = reader.read_optional_u32()?;
                reader.context().pop();
            }
            "uArrayArray" => {
                reader.context().push(&field, "Vec<Option<Vec<Option<u32>>>>", "type found, reading argument");
                _u_array_array = reader.read_array(|reader| {
                    reader.read_optional_array(|reader| {
                        reader.read_optional_u32()
                    })
                })?;
                _u_array_array_set = true;
                reader.context().pop();
            }
            "object" => {
                reader.context().push(&field, "TestImportObject", "type found, reading argument");
                let object = TestImportObject::read(&mut reader)?;
                _object = object;
                _object_set = true;
                reader.context().pop();
            }
            "optObject" => {
                reader.context().push(&field, "Option<TestImportObject>", "type found, reading argument");
                let mut object: Option<TestImportObject> = None;
                if !reader.is_next_nil()? {
                    object = Some(TestImportObject::read(&mut reader)?);
                } else {
                    object = None;
                }
                _opt_object = object;
                reader.context().pop();
            }
            "objectArray" => {
                reader.context().push(&field, "Vec<TestImportObject>", "type found, reading argument");
                _object_array = reader.read_array(|reader| {
                    let object = TestImportObject::read(reader)?;
                    Ok(object)
                })?;
                _object_array_set = true;
                reader.context().pop();
            }
            "optObjectArray" => {
                reader.context().push(&field, "Option<Vec<Option<TestImportObject>>>", "type found, reading argument");
                _opt_object_array = reader.read_optional_array(|reader| {
                    let mut object: Option<TestImportObject> = None;
                    if !reader.is_next_nil()? {
                        object = Some(TestImportObject::read(reader)?);
                    } else {
                        object = None;
                    }
                    Ok(object)
                })?;
                reader.context().pop();
            }
            "en" => {
                reader.context().push(&field, "TestImportEnum", "type found, reading argument");
                let mut value: TestImportEnum = TestImportEnum::_MAX_;
                if reader.is_next_string()? {
                    value = get_test_import_enum_value(&reader.read_string()?)?;
                } else {
                    value = TestImportEnum::try_from(reader.read_i32()?)?;
                    sanitize_test_import_enum_value(value as i32)?;
                }
                _en = value;
                _en_set = true;
                reader.context().pop();
            }
            "optEnum" => {
                reader.context().push(&field, "Option<TestImportEnum>", "type found, reading argument");
                let mut value: Option<TestImportEnum> = None;
                if !reader.is_next_nil()? {
                    if reader.is_next_string()? {
                        value = Some(get_test_import_enum_value(&reader.read_string()?)?);
                    } else {
                        value = Some(TestImportEnum::try_from(reader.read_i32()?)?);
                        sanitize_test_import_enum_value(value.unwrap() as i32)?;
                    }
                } else {
                    value = None;
                }
                _opt_enum = value;
                reader.context().pop();
            }
            "enumArray" => {
                reader.context().push(&field, "Vec<TestImportEnum>", "type found, reading argument");
                _enum_array = reader.read_array(|reader| {
                    let mut value: TestImportEnum = TestImportEnum::_MAX_;
                    if reader.is_next_string()? {
                        value = get_test_import_enum_value(&reader.read_string()?)?;
                    } else {
                        value = TestImportEnum::try_from(reader.read_i32()?)?;
                        sanitize_test_import_enum_value(value as i32)?;
                    }
                    Ok(value)
                })?;
                _enum_array_set = true;
                reader.context().pop();
            }
            "optEnumArray" => {
                reader.context().push(&field, "Option<Vec<Option<TestImportEnum>>>", "type found, reading argument");
                _opt_enum_array = reader.read_optional_array(|reader| {
                    let mut value: Option<TestImportEnum> = None;
                    if !reader.is_next_nil()? {
                        if reader.is_next_string()? {
                            value = Some(get_test_import_enum_value(&reader.read_string()?)?);
                        } else {
                            value = Some(TestImportEnum::try_from(reader.read_i32()?)?);
                            sanitize_test_import_enum_value(value.unwrap() as i32)?;
                        }
                    } else {
                        value = None;
                    }
                    Ok(value)
                })?;
                reader.context().pop();
            }
            err => return Err(DecodeError::UnknownFieldName(err.to_string())),
        }
    }
    if !_str_set {
        return Err(DecodeError::MissingField("str: String.".to_string()));
    }
    if !_u_set {
        return Err(DecodeError::MissingField("u: UInt.".to_string()));
    }
    if !_u_array_array_set {
        return Err(DecodeError::MissingField("uArrayArray: [[UInt]].".to_string()));
    }
    if !_object_set {
        return Err(DecodeError::MissingField("object: TestImport_Object.".to_string()));
    }
    if !_object_array_set {
        return Err(DecodeError::MissingField("objectArray: [TestImport_Object].".to_string()));
    }
    if !_en_set {
        return Err(DecodeError::MissingField("en: TestImport_Enum.".to_string()));
    }
    if !_enum_array_set {
        return Err(DecodeError::MissingField("enumArray: [TestImport_Enum].".to_string()));
    }

    Ok(ArgsImportedMethod {
        str: _str,
        opt_str: _opt_str,
        u: _u,
        opt_u: _opt_u,
        u_array_array: _u_array_array,
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

pub fn serialize_imported_method_args(args: &ArgsImportedMethod) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported module-type: imported_method Args".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_imported_method_args(args, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_imported_method_args<W: Write>(args: &ArgsImportedMethod, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&13)?;
    writer.context().push("str", "String", "writing property");
    writer.write_string("str")?;
    writer.write_string(&args.str)?;
    writer.context().pop();
    writer.context().push("optStr", "Option<String>", "writing property");
    writer.write_string("optStr")?;
    writer.write_optional_string(&args.opt_str)?;
    writer.context().pop();
    writer.context().push("u", "u32", "writing property");
    writer.write_string("u")?;
    writer.write_u32(&args.u)?;
    writer.context().pop();
    writer.context().push("optU", "Option<u32>", "writing property");
    writer.write_string("optU")?;
    writer.write_optional_u32(&args.opt_u)?;
    writer.context().pop();
    writer.context().push("uArrayArray", "Vec<Option<Vec<Option<u32>>>>", "writing property");
    writer.write_string("uArrayArray")?;
    writer.write_array(&args.u_array_array, |writer, item| {
        writer.write_optional_array(item, |writer, item| {
            writer.write_optional_u32(item)
        })
    })?;
    writer.context().pop();
    writer.context().push("object", "TestImportObject", "writing property");
    writer.write_string("object")?;
    TestImportObject::write(&args.object, writer)?;
    writer.context().pop();
    writer.context().push("optObject", "Option<TestImportObject>", "writing property");
    writer.write_string("optObject")?;
    if args.opt_object.is_some() {
        TestImportObject::write(args.opt_object.as_ref().as_ref().unwrap(), writer)?;
    } else {
        writer.write_nil()?;
    }
    writer.context().pop();
    writer.context().push("objectArray", "Vec<TestImportObject>", "writing property");
    writer.write_string("objectArray")?;
    writer.write_array(&args.object_array, |writer, item| {
        TestImportObject::write(item, writer)
    })?;
    writer.context().pop();
    writer.context().push("optObjectArray", "Option<Vec<Option<TestImportObject>>>", "writing property");
    writer.write_string("optObjectArray")?;
    writer.write_optional_array(&args.opt_object_array, |writer, item| {
        if item.is_some() {
            TestImportObject::write(item.as_ref().as_ref().unwrap(), writer)
        } else {
            writer.write_nil()
        }
    })?;
    writer.context().pop();
    writer.context().push("en", "TestImportEnum", "writing property");
    writer.write_string("en")?;
    writer.write_i32(&(args.en as i32))?;
    writer.context().pop();
    writer.context().push("optEnum", "Option<TestImportEnum>", "writing property");
    writer.write_string("optEnum")?;
    writer.write_optional_i32(&args.opt_enum.map(|f| f as i32))?;
    writer.context().pop();
    writer.context().push("enumArray", "Vec<TestImportEnum>", "writing property");
    writer.write_string("enumArray")?;
    writer.write_array(&args.enum_array, |writer, item| {
        writer.write_i32(&(*item as i32))
    })?;
    writer.context().pop();
    writer.context().push("optEnumArray", "Option<Vec<Option<TestImportEnum>>>", "writing property");
    writer.write_string("optEnumArray")?;
    writer.write_optional_array(&args.opt_enum_array, |writer, item| {
        writer.write_optional_i32(&item.map(|f| f as i32))
    })?;
    writer.context().pop();
    Ok(())
}

pub fn serialize_imported_method_result(result: &Option<TestImportObject>) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported module-type: imported_method Result".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_imported_method_result(result, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_imported_method_result<W: Write>(result: &Option<TestImportObject>, writer: &mut W) -> Result<(), EncodeError> {
    writer.context().push("importedMethod", "Option<TestImportObject>", "writing result");
    if result.is_some() {
        TestImportObject::write(result.as_ref().unwrap(), writer)?;
    } else {
        writer.write_nil()?;
    }
    writer.context().pop();
    Ok(())
}

pub fn deserialize_imported_method_result(result: &[u8]) -> Result<Option<TestImportObject>, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported module-type: imported_method Result".to_string();
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
pub struct ArgsAnotherMethod {
    pub arg: Vec<String>,
}

pub fn deserialize_another_method_args(args: &[u8]) -> Result<ArgsAnotherMethod, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported module-type: another_method Args".to_string();

    let mut reader = ReadDecoder::new(args, context);
    let mut num_of_fields = reader.read_map_length()?;

    let mut _arg: Vec<String> = vec![];
    let mut _arg_set = false;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "arg" => {
                reader.context().push(&field, "Vec<String>", "type found, reading argument");
                _arg = reader.read_array(|reader| {
                    reader.read_string()
                })?;
                _arg_set = true;
                reader.context().pop();
            }
            err => return Err(DecodeError::UnknownFieldName(err.to_string())),
        }
    }
    if !_arg_set {
        return Err(DecodeError::MissingField("arg: [String].".to_string()));
    }

    Ok(ArgsAnotherMethod {
        arg: _arg,
    })
}

pub fn serialize_another_method_args(args: &ArgsAnotherMethod) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported module-type: another_method Args".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_another_method_args(args, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_another_method_args<W: Write>(args: &ArgsAnotherMethod, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&1)?;
    writer.context().push("arg", "Vec<String>", "writing property");
    writer.write_string("arg")?;
    writer.write_array(&args.arg, |writer, item| {
        writer.write_string(item)
    })?;
    writer.context().pop();
    Ok(())
}

pub fn serialize_another_method_result(result: &i32) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported module-type: another_method Result".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_another_method_result(result, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_another_method_result<W: Write>(result: &i32, writer: &mut W) -> Result<(), EncodeError> {
    writer.context().push("anotherMethod", "i32", "writing result");
    writer.write_i32(result)?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_another_method_result(result: &[u8]) -> Result<i32, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported module-type: another_method Result".to_string();
    let mut reader = ReadDecoder::new(result, context);

    reader.context().push("anotherMethod", "i32", "reading function output");
    let res = reader.read_i32()?;
    reader.context().pop();
    Ok(res)
}
