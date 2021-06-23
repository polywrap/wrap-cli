use super::CustomType;
use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AnotherType {
    prop: Option<String>,
    circular: Box<Option<CustomType>>,
}

impl AnotherType {
    pub fn new() -> Self {
        Self {
            prop: None,
            circular: Box::new(None),
        }
    }
 
    pub fn serialize_another_type(mut object: Self) -> Vec<u8> {
        let mut sizer_context = Context::new();
        sizer_context.description = "Serializing (sizing) object-type: AnotherType".to_string();
        let sizer = WriteSizer::new(sizer_context);
        Self::write_another_type(object.clone(), sizer.clone());
        let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
        let mut encoder_context = Context::new();
        encoder_context.description = "Serializing (encoding) object-type: AnotherType".to_string();
        let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
        Self::write_another_type(object, encoder);
        buffer
    }

    pub fn write_another_type<W: Write>(mut object: Self, mut writer: W) {
        writer.write_map_length(2);
        writer
            .context()
            .push("prop", "Option<String>", "writing property");
        writer.write_string("prop".to_string());
        let _ = writer.write_nullable_string(object.prop.clone());
        let _ = writer.context().pop();
        writer
            .context()
            .push("circular", "Option<CustomType>", "writing property");
        writer.write_string("circular".to_string());
        if object.circular.is_some() {
            Self::write(object, writer.clone());
        } else {
            writer.write_nil();
        }
        let _ = writer.context().pop();
    }

    pub fn deserialize_another_type(buffer: &[u8]) -> Self {
        let mut context = Context::new();
        context.description = "Deserializing object-type AnotherType".to_string();
        let reader = ReadDecoder::new(buffer, context);
        Self::read_another_type(reader)
    }

    pub fn read_another_type<R: Read>(mut reader: R) -> Self {
        let mut num_of_fields = reader.read_map_length().unwrap_or_default();
        let mut prop: Option<String> = None;
        let mut circular: Option<CustomType> = None;

        while num_of_fields > 0 {
            num_of_fields -= 1;
            let field = reader.read_string().unwrap_or_default();

            match field.as_str() {
                "prop" => {
                    reader
                        .context()
                        .push(&field, "Option<String>", "type found, reading property");
                    prop = reader.read_nullable_string();
                    let _ = reader.context().pop();
                }
                "circular" => {
                    reader.context().push(
                        &field,
                        "Option<CustomType>",
                        "type found, reading property",
                    );
                    let mut object: Option<CustomType> = None;
                    if !reader.is_next_nil() {
                        object = Some(CustomType::read(reader.clone()));
                    }
                    circular = object;
                    let _ = reader.context().pop();
                }
                _ => {
                    reader
                        .context()
                        .push(&field, "unknown", "searching for property type");
                    let _ = reader.context().pop();
                }
            }
            reader
                .context()
                .push(&field, "unknown", "searching for property type");
            let _ = reader.context().pop();
        }
        Self {
            prop,
            circular: Box::new(circular),
        }
    }

    pub fn to_buffer(mut object: Self) -> Vec<u8> {
        Self::serialize_another_type(object)
    }

    pub fn from_buffer(buffer: &[u8]) -> Self {
        Self::deserialize_another_type(buffer)
    }

    pub fn write<W: Write>(object: Self, writer: W) {
        Self::write_another_type(object, writer);
    }

    pub fn read<R: Read>(reader: R) -> Self {
        Self::read_another_type(reader)
    }
}
