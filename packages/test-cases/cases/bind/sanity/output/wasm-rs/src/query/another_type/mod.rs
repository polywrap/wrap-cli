use super::CustomType;
use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use num_bigint::BigInt;

pub struct AnotherType {
    prop: Option<String>,
    circular: Option<CustomType>,
}

impl AnotherType {
    pub fn new() -> Self {
        Self {
            prop: None,
            circular: None,
        }
    }

    pub fn serialize_another_type(&mut self) -> Vec<u8> {
        let mut sizer_context = Context::new();
        sizer_context.description = "Serializing (sizing) object-type: AnotherType".to_string();
        let sizer = WriteSizer::new(sizer_context);
        self.write_another_type(sizer);
        let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
        let mut encoder_context = Context::new();
        encoder_context.description = "Serializing (encoding) object-type: AnotherType".to_string();
        let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
        self.write_another_type(encoder);
        buffer
    }

    pub fn write_another_type<W: Write>(&mut self, mut writer: W) {
        writer.write_map_length(2);
        writer
            .context()
            .push("prop", "Option<String>", "writing property");
        writer.write_string("prop".to_string());
        writer.write_nullable_string(self.prop.clone());
        writer.context().pop();
        writer
            .context()
            .push("circular", "Option<CustomType>", "writing property");
        writer.write_string("circular".to_string());
        if self.circular.is_some() {
            self.circular.unwrap().write(writer.clone());
        } else {
            writer.write_nil();
        }
        writer.context().pop();
    }

    pub fn deserialize_another_type(&mut self, buffer: Vec<u8>) -> Self {
        let mut context = Context::new();
        context.description = "Deserializing object-type AnotherType".to_string();
        let reader = ReadDecoder::new(buffer.as_slice(), context);
        self.read_another_type(reader)
    }

    pub fn read_another_type<R: Read>(&mut self, mut reader: R) -> Self {
        let mut num_of_fields = reader.read_map_length().unwrap_or_default();
        let mut prop: Option<String> = None;
        let mut circular: Option<CustomType> = None;

        while num_of_fields > 0 {
            num_of_fields -= 1;
            let field = reader.read_string().unwrap_or_default();
            reader
                .context()
                .push(field.as_str(), "unknown", "searching for property type");
            if field == "prop".to_string() {
                reader.context().push(
                    field.as_str(),
                    "Option<String>",
                    "type found, reading property",
                );
                prop = reader.read_nullable_string();
                reader.context().pop();
            } else if field == "circular" {
                reader.context().push(
                    field.as_str(),
                    "Option<CustomType>",
                    "type found, reading property",
                );
                let mut object: Option<CustomType> = None;
                if !reader.is_next_nil() {
                    object = Some(self.circular.unwrap().read(reader.clone()));
                }
                circular = object;
                reader.context().pop();
            }
            reader.context().pop();
        }
        Self { prop, circular }
    }

    pub fn to_buffer(&mut self) -> Vec<u8> {
        self.serialize_another_type()
    }

    pub fn from_buffer(&mut self, buffer: &[u8]) -> Self {
        self.deserialize_another_type(buffer.to_vec())
    }

    pub fn write<W: Write>(&mut self, writer: W) {
        self.write_another_type(writer);
    }

    pub fn read<R: Read>(&mut self, reader: R) -> Self {
        self.read_another_type(reader)
    }
}
