use crate::{
    AnotherType, 
    CustomType,
};
use crate::{
    Context, 
    Read, 
    ReadDecoder, 
    Write, 
    WriteEncoder, 
    WriteSizer,
};

pub fn serialize_another_type(object: &AnotherType) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) object-type: AnotherType".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_another_type(object, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: AnotherType".to_string();
    let mut encoder = WriteEncoder::new(buffer.as_slice(), encoder_context);
    write_another_type(object, &mut encoder);
    buffer
}

pub fn write_another_type<W: Write>(object: &AnotherType, writer: &mut W) {
    writer.write_map_length(2);
    writer
        .context()
        .push("prop", "Option<String>", "writing property");
    writer.write_string("prop".to_string());
    writer.write_nullable_string(object.prop.clone());
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<String> from Context");
    writer
        .context()
        .push("circular", "Option<CustomType>", "writing property");
    writer.write_string("circular".to_string());
    if object.circular.is_some() {
        CustomType::write(object.circular.as_ref().as_ref().unwrap(), writer);
    } else {
        writer.write_nil();
    }
    writer
        .context()
        .pop()
        .expect("Failed to pop Option<CustomType> from Context");
}

pub fn deserialize_another_type(buffer: &[u8]) -> AnotherType {
    let mut context = Context::new();
    context.description = "Deserializing object-type AnotherType".to_string();
    let mut reader = ReadDecoder::new(buffer, context);
    read_another_type(&mut reader)
}

pub fn read_another_type<R: Read>(reader: &mut R) -> AnotherType {
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
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<String> from Context");
            }
            "circular" => {
                reader
                    .context()
                    .push(&field, "Option<CustomType>", "type found, reading property");
                let mut object: Option<CustomType> = None;
                if !reader.is_next_nil() {
                    object = Some(CustomType::read(reader));
                }
                circular = object;
                reader
                    .context()
                    .pop()
                    .expect("Failed to pop Option<CustomType> from Context");
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
    AnotherType {
        prop,
        circular: Box::new(circular),
    }
}
