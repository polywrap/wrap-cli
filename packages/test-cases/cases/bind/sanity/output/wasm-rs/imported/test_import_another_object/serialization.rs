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
use crate::TestImportAnotherObject;

pub fn serialize_test_import_another_object(args: TestImportAnotherObject) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported object-type: TestImportAnotherObject".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_test_import_another_object(args, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_test_import_another_object<W: Write>(args: TestImportAnotherObject, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&1)?;
    writer.context().push("prop", "String", "writing property");
    writer.write_string("prop")?;
    writer.write_string(&args.prop)?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_test_import_another_object(args: &[u8]) -> Result<TestImportAnotherObject, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported object-type: TestImportAnotherObject".to_string();
    let mut reader = ReadDecoder::new(args, context);
    read_test_import_another_object(&mut reader)
}

pub fn read_test_import_another_object<R: Read>(reader: &mut R) -> Result<TestImportAnotherObject, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;

    let mut _prop: String = String::new();
    let mut _prop_set = false;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "prop" => {
                reader.context().push(&field, "String", "type found, reading property");
                _prop = reader.read_string()?;
                _prop_set = true;
                reader.context().pop();
            }
            err => return Err(DecodeError::UnknownFieldName(err.to_string())),
        }
    }
    if !_prop_set {
        return Err(DecodeError::MissingField("prop: String.".to_string()));
    }

    Ok(TestImportAnotherObject {
        prop: _prop,
    })
}
