use super::TestImportAnotherObject;
use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use std::io::{Error, ErrorKind, Result};

pub fn serialize_test_import_another_object(mut object: TestImportAnotherObject) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description =
        "Serializing (sizing) imported object-type: TestImportAnotherObject".to_string();
    let sizer = WriteSizer::new(sizer_context);
    write_test_import_another_object(object.clone(), sizer.clone());

    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description =
        "Serializing (encoding) imported object-type: TestImportAnotherObject".to_string();
    let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
    write_test_import_another_object(object, encoder);
    buffer
}

pub fn write_test_import_another_object<W: Write>(
    mut object: TestImportAnotherObject,
    mut writer: W,
) {
    writer.write_map_length(1);
    writer.context().push("prop", "string", "writing property");
    writer.write_string(&"prop".to_string());
    writer.write_string(&object.prop);
    let _ = writer.context().pop();
}

pub fn deserialize_test_import_another_object(mut buffer: &[u8]) -> TestImportAnotherObject {
    let mut context = Context::new();
    context.description = "Deserializing imported object-type: TestImportAnotherObject".to_string();
    let reader = ReadDecoder::new(buffer, context);
    read_test_import_another_object(reader).expect("Failed to deserialize TestImportAnotherObject")
}

pub fn read_test_import_another_object<R: Read>(mut reader: R) -> Result<TestImportAnotherObject> {
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();

    let mut prop = "".to_string();
    let mut prop_set = false;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "prop" => {
                reader
                    .context()
                    .push(&field, "String", "type found, reading property");
                prop = reader.read_string().unwrap_or_default();
                prop_set = true;
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

    if !prop_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'prop: String'");
        return Err(Error::new(ErrorKind::Other, custom_error));
    }

    Ok(TestImportAnotherObject { prop })
}
