use crate::TestImportAnotherObject;
use crate::{
    Context, 
    Read, 
    ReadDecoder, 
    Write, 
    WriteEncoder, 
    WriteSizer,
};

pub fn serialize_test_import_another_object(object: &TestImportAnotherObject) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description =
        "Serializing (sizing) imported object-type: TestImportAnotherObject".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_test_import_another_object(object, &mut sizer);

    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description =
        "Serializing (encoding) imported object-type: TestImportAnotherObject".to_string();
    let mut encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
    write_test_import_another_object(object, &mut encoder);
    buffer
}

pub fn write_test_import_another_object<W: Write>(
    object: &TestImportAnotherObject,
    writer: &mut W,
) {
    writer.write_map_length(1);
    writer.context().push("prop", "String", "writing property");
    writer.write_string("prop".to_string());
    writer.write_string(object.prop.clone());
    writer
        .context()
        .pop()
        .expect("Failed to pop String from Context");
}

pub fn deserialize_test_import_another_object(buffer: &[u8]) -> TestImportAnotherObject {
    let mut context = Context::new();
    context.description = "Deserializing imported object-type: TestImportAnotherObject".to_string();
    let mut reader = ReadDecoder::new(buffer, context);
    read_test_import_another_object(&mut reader)
        .expect("Failed to deserialize TestImportAnotherObject")
}

pub fn read_test_import_another_object<R: Read>(
    reader: &mut R,
) -> Result<TestImportAnotherObject, String> {
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
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop String from Context");
            }
            _ => {
                reader
                    .context()
                    .push(&field, "unknown", "searching for property type");
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop unknown object from Context");
            }
        }
    }

    if !prop_set {
        let custom_error = reader
            .context()
            .print_with_context("Missing required property: 'prop: String'");
        return Err(custom_error);
    }

    Ok(TestImportAnotherObject { prop })
}
