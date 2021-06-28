use super::{AnotherType, CustomType};
use crate::{Context, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};

pub fn serialize_another_type(object: AnotherType) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) object-type: AnotherType".to_string();
    let sizer = WriteSizer::new(sizer_context);
    write_another_type(object.clone(), sizer.clone());
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: AnotherType".to_string();
    let encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
    write_another_type(object, encoder);
    buffer
}

pub fn write_another_type<W: Write>(object: AnotherType, mut writer: W) {
    writer.write_map_length(2);
    writer
        .context()
        .push("prop", "Option<String>", "writing property");
    writer.write_string(&"prop".to_string());
    let _ = writer.write_nullable_string(object.prop.clone());
    let _ = writer.context().pop();
    writer
        .context()
        .push("circular", "Option<CustomType>", "writing property");
    writer.write_string(&"circular".to_string());
    if object.circular.is_some() {
        CustomType::write(object.circular.unwrap(), writer.clone());
    } else {
        writer.write_nil();
    }
    let _ = writer.context().pop();
}

pub fn deserialize_another_type(buffer: &[u8]) -> AnotherType {
    let mut context = Context::new();
    context.description = "Deserializing object-type AnotherType".to_string();
    let reader = ReadDecoder::new(buffer, context);
    read_another_type(reader)
}

pub fn read_another_type<R: Read>(mut reader: R) -> AnotherType {
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
                reader
                    .context()
                    .push(&field, "Option<CustomType>", "type found, reading property");
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
    AnotherType {
        prop,
        circular: Box::new(circular),
    }
}
