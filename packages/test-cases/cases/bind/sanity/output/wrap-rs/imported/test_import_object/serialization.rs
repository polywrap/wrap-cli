use std::convert::TryFrom;
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

use crate::TestImportAnotherObject;
use crate::{
    TestImportEnum,
    get_test_import_enum_value,
    sanitize_test_import_enum_value
};

pub fn serialize_test_import_object(args: &TestImportObject) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported object-type: TestImportObject".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_test_import_object(args, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_test_import_object<W: Write>(args: &TestImportObject, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&8)?;
    writer.context().push("object", "TestImportAnotherObject", "writing property");
    writer.write_string("object")?;
    TestImportAnotherObject::write(&args.object, writer)?;
    writer.context().pop();
    writer.context().push("optObject", "Option<TestImportAnotherObject>", "writing property");
    writer.write_string("optObject")?;
    if args.opt_object.is_some() {
        TestImportAnotherObject::write(args.opt_object.as_ref().as_ref().unwrap(), writer)?;
    } else {
        writer.write_nil()?;
    }
    writer.context().pop();
    writer.context().push("objectArray", "Vec<TestImportAnotherObject>", "writing property");
    writer.write_string("objectArray")?;
    writer.write_array(&args.object_array, |writer, item| {
        TestImportAnotherObject::write(item, writer)
    })?;
    writer.context().pop();
    writer.context().push("optObjectArray", "Option<Vec<Option<TestImportAnotherObject>>>", "writing property");
    writer.write_string("optObjectArray")?;
    writer.write_optional_array(&args.opt_object_array, |writer, item| {
        if item.is_some() {
            TestImportAnotherObject::write(item.as_ref().as_ref().unwrap(), writer)
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

pub fn deserialize_test_import_object(args: &[u8]) -> Result<TestImportObject, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported object-type: TestImportObject".to_string();
    let mut reader = ReadDecoder::new(args, context);
    read_test_import_object(&mut reader)
}

pub fn read_test_import_object<R: Read>(reader: &mut R) -> Result<TestImportObject, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;

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
        let field = reader.read_string()?;

        match field.as_str() {
            "object" => {
                reader.context().push(&field, "TestImportAnotherObject", "type found, reading property");
                let object = TestImportAnotherObject::read(reader)?;
                _object = object;
                _object_set = true;
                reader.context().pop();
            }
            "optObject" => {
                reader.context().push(&field, "Option<TestImportAnotherObject>", "type found, reading property");
                let mut object: Option<TestImportAnotherObject> = None;
                if !reader.is_next_nil()? {
                    object = Some(TestImportAnotherObject::read(reader)?);
                } else {
                    object = None;
                }
                _opt_object = object;
                reader.context().pop();
            }
            "objectArray" => {
                reader.context().push(&field, "Vec<TestImportAnotherObject>", "type found, reading property");
                _object_array = reader.read_array(|reader| {
                    let object = TestImportAnotherObject::read(reader)?;
                    Ok(object)
                })?;
                _object_array_set = true;
                reader.context().pop();
            }
            "optObjectArray" => {
                reader.context().push(&field, "Option<Vec<Option<TestImportAnotherObject>>>", "type found, reading property");
                _opt_object_array = reader.read_optional_array(|reader| {
                    let mut object: Option<TestImportAnotherObject> = None;
                    if !reader.is_next_nil()? {
                        object = Some(TestImportAnotherObject::read(reader)?);
                    } else {
                        object = None;
                    }
                    Ok(object)
                })?;
                reader.context().pop();
            }
            "en" => {
                reader.context().push(&field, "TestImportEnum", "type found, reading property");
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
                reader.context().push(&field, "Option<TestImportEnum>", "type found, reading property");
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
                reader.context().push(&field, "Vec<TestImportEnum>", "type found, reading property");
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
                reader.context().push(&field, "Option<Vec<Option<TestImportEnum>>>", "type found, reading property");
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
    if !_object_set {
        return Err(DecodeError::MissingField("object: TestImport_AnotherObject.".to_string()));
    }
    if !_object_array_set {
        return Err(DecodeError::MissingField("objectArray: [TestImport_AnotherObject].".to_string()));
    }
    if !_en_set {
        return Err(DecodeError::MissingField("en: TestImport_Enum.".to_string()));
    }
    if !_enum_array_set {
        return Err(DecodeError::MissingField("enumArray: [TestImport_Enum].".to_string()));
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
