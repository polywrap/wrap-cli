use polywrap_wasm_rs::{
    Context,
    Read,
    ReadDecoder,
    Write,
    WriteEncoder,
    WriteSizer,
};

use crate::AnotherType;
use crate::CustomType;

pub fn serialize_another_type(input: &AnotherType) -> Vec<u8> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) object-type: AnotherType".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_another_type(input, &mut sizer);
    let buffer: Vec<u8> = Vec::with_capacity(sizer.get_length() as usize);
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: AnotherType".to_string();
    let mut encoder = WriteEncoder::new(&buffer, encoder_context);
    write_another_type(input, &mut encoder);
    buffer
}

pub fn write_another_type<W: Write>(input: &AnotherType, writer: &mut W) {
    writer.write_map_length(2);
    writer.context().push("prop", "Option<String>", "writing property");
    writer.write_string("prop");
    writer.write_nullable_string(&input.prop);
    writer.context().pop();
    writer.context().push("circular", "Option<Box<CustomType>>", "writing property");
    writer.write_string("circular");
    if input.circular.is_some() {
        CustomType::write(input.circular.as_ref().as_ref().unwrap(), writer);
    } else {
        writer.write_nil();
    }
    writer.context().pop();
}

pub fn deserialize_another_type(input: &[u8]) -> AnotherType {
    let mut context = Context::new();
    context.description = "Deserializing object-type: AnotherType".to_string();
    let mut reader = ReadDecoder::new(input, context);
    read_another_type(&mut reader).expect("Failed to deserialize AnotherType")
}

pub fn read_another_type<R: Read>(reader: &mut R) -> Result<AnotherType, String> {
    let mut num_of_fields = reader.read_map_length().unwrap_or_default();

    let mut prop: Option<String> = None;
    let mut circular: Option<Box<CustomType>> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string().unwrap_or_default();

        match field.as_str() {
            "prop" => {
                reader.context().push(&field, "Option<String>", "type found, reading property");
                prop = reader.read_nullable_string().unwrap_or_default();
                reader.context().pop();
            }
            "circular" => {
                reader.context().push(&field, "Option<Box<CustomType>>", "type found, reading property");
                if !reader.is_next_nil() {
                    circular = Box::new(Some(CustomType::read(reader)));
                }
                reader.context().pop();
            }
        }
    }

    Ok(AnotherType {
        prop,
        circular,
    })
}
