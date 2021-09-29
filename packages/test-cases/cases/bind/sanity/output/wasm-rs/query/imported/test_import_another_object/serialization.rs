use alloc::{
    boxed::Box,
    collections::BTreeMap,
    format,
    str::FromStr,
    string::{
        String,
        ToString,
    },
    vec,
    vec::Vec,
};
use crate::TestImportAnotherObject;
use crate::TestImportObject;
use crate::{
    get_test_import_enum_value,
    sanitize_test_import_enum_value,
    TestImportEnum,
};
use core::convert::TryFrom;
use polywrap_wasm_rs::{
    BigInt,
    Context,
    Read,
    ReadDecoder,
    Write,
    WriteEncoder,
    WriteSizer,
    JSON,
};

pub fn serialize_test_import_another_object(input: &TestImportAnotherObject) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) imported object-type: TestImportAnotherObject".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_test_import_another_object(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported object-type: TestImportAnotherObject".to_string();
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_test_import_another_object(input, &mut encoder);
    buffer
}

pub fn write_test_import_another_object<W: Write>(input: &TestImportAnotherObject, writer: &mut W) {
    writer.write_map_length(1);
    writer.context().push("prop", "String", "writing property");
    writer.write_str("prop");
    writer.write_string(&input.prop);
    writer.context().pop();
}

pub fn deserialize_test_import_another_object(input: &[u8]) -> TestImportAnotherObject {
    let mut context = Context::new();
    context.description = "Deserializing imported object-type: TestImportAnotherObject".to_string();
    let mut reader = ReadDecoder::new(input, context);
    read_test_import_another_object(&mut reader).expect("Failed to deserialize TestImportAnotherObject")
}

pub fn read_test_import_another_object<R: Read>(reader: &mut R) -> Result<TestImportAnotherObject, String> {
    let mut num_of_fields = reader.read_map_length().unwrap();

    let mut _prop: String = String::new();
    let mut _prop_set = false;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap();

        match field.as_str() {
            "prop" => {
                reader.context().push(&field, "String", "type found, reading property");
                _prop = reader.read_string().unwrap();
                _prop_set = true;
                reader.context().pop();
            }
            _ => {}
        }
    }
    if !_prop_set {
        return Err(reader.context().print_with_context("Missing required property: 'prop: String'"));
    }

    Ok(TestImportAnotherObject {
        prop: _prop,
    })
}