use std::convert::TryFrom;
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
use crate::TestImportAnotherObject;

pub fn serialize_test_import_another_object(input: &TestImportAnotherObject) -> Result<Vec<u8>, EncodeError> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) imported object-type: TestImportAnotherObject".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_test_import_another_object(input, &mut sizer)?;
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported object-type: TestImportAnotherObject".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_test_import_another_object(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_test_import_another_object<W: Write>(input: &TestImportAnotherObject, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&1)?;
    writer.write_str("prop")?;
    writer.write_string(&input.prop)?;
    Ok(())
}

pub fn deserialize_test_import_another_object(input: &[u8]) -> Result<TestImportAnotherObject, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported object-type: TestImportAnotherObject".to_string();
    let mut reader = ReadDecoder::new(input, context);
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
                if let Ok(v) = reader.read_string() {
                    _prop = v;
                    _prop_set = true;
                } else {
                    return Err(DecodeError::TypeReadError(reader.context().print_with_context("'prop: String'")));
                }
            }
            _ => {}
        }
    }
    if !_prop_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'prop: String'")));
    }

    Ok(TestImportAnotherObject {
        prop: _prop,
    })
}
