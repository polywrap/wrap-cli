use super::{TestImportEnum, TestImportObject};
use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use num_bigint::BigInt;
use std::io::{Error, ErrorKind, Result};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestImportAnotherObject {
    prop: String,
}

impl TestImportAnotherObject {
    pub const URI: String = "testimport.uri.eth".to_string();

    pub fn new() -> Self {
        Self {
            prop: String::new(),
        }
    }

    pub fn serialize_test_import_another_object(&mut self) -> Vec<u8> {
        let mut sizer_context = Context::new();
        sizer_context.description =
            "Serializing (sizing) imported object-type: TestImportAnotherObject".to_string();
        let sizer = WriteSizer::new(sizer_context);
        self.write_test_import_another_object(sizer);

        let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
        let mut encoder_context = Context::new();
        encoder_context.description =
            "Serializing (encoding) imported object-type: TestImportAnotherObject".to_string();
        let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
        self.write_test_import_another_object(encoder);
        buffer
    }

    pub fn write_test_import_another_object<W: Write>(&mut self, mut writer: W) {
        writer.write_map_length(1);
        writer.context().push("prop", "string", "writing property");
        writer.write_string("prop".to_string());
        writer.write_string(self.prop.to_owned());
        writer.context().pop();
    }

    pub fn deserialize_test_import_another_object(&mut self, buffer: &[u8]) -> Self {
        let mut context = Context::new();
        context.description =
            "Deserializing imported object-type: TestImportAnotherObject".to_string();
        let reader = ReadDecoder::new(buffer, context);
        self.read_test_import_another_object(reader)
            .expect("Failed to deserialize TestImportAnotherObject")
    }

    pub fn read_test_import_another_object<R: Read>(&mut self, mut reader: R) -> Result<Self> {
        let mut num_of_fields = reader.read_map_length().unwrap_or_default();

        let mut prop = "".to_string();
        let mut prop_set = false;

        while num_of_fields > 0 {
            num_of_fields -= 1;
            let field = reader.read_string().unwrap_or_default().as_str();

            match field {
                "prop" => {
                    reader
                        .context()
                        .push(field, "String", "type found, reading property");
                    prop = reader.read_string().unwrap_or_default();
                    prop_set = true;
                    reader.context().pop();
                }
                _ => {
                    reader
                        .context()
                        .push(field, "unknown", "searching for property type");
                    reader.context().pop();
                }
            }
        }

        if !prop_set {
            let custom_error = reader
                .context()
                .print_with_context("Missing required property: 'prop: String'");
            return Err(Error::new(ErrorKind::Other, custom_error));
        }

        Ok(Self { prop })
    }

    pub fn to_buffer(&mut self) -> Vec<u8> {
        self.serialize_test_import_another_object()
    }

    pub fn from_buffer(&mut self, buffer: &[u8]) -> Self {
        self.deserialize_test_import_another_object(buffer)
    }

    pub fn write<W: Write>(&mut self, writer: W) {
        self.write_test_import_another_object(writer);
    }

    pub fn read<R: Read>(&mut self, reader: R) -> Self {
        self.read_test_import_another_object(reader)
            .expect("Failed to read TestImportObject")
    }
}
