use std::convert::TryFrom;
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
    Context,
    DecodeError,
    EncodeError,
    Read,
    ReadDecoder,
    Write,
    WriteEncoder,
    JSON,
};
use crate::CustomMapValue;

pub fn serialize_custom_map_value(args: CustomMapValue) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: CustomMapValue".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_custom_map_value(args, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_custom_map_value<W: Write>(args: CustomMapValue, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&1)?;
    writer.context().push("foo", "String", "writing property");
    writer.write_string("foo")?;
    writer.write_string(&args.foo)?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_custom_map_value(args: &[u8]) -> Result<CustomMapValue, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing object-type: CustomMapValue".to_string();
    let mut reader = ReadDecoder::new(args, context);
    read_custom_map_value(&mut reader)
}

pub fn read_custom_map_value<R: Read>(reader: &mut R) -> Result<CustomMapValue, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;

    let mut _foo: String = String::new();
    let mut _foo_set = false;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "foo" => {
                reader.context().push(&field, "String", "type found, reading property");
                _foo = reader.read_string()?;
                _foo_set = true;
                reader.context().pop();
            }
            err => return Err(DecodeError::UnknownFieldName(err.to_string())),
        }
    }
    if !_foo_set {
        return Err(DecodeError::MissingField("foo: String.".to_string()));
    }

    Ok(CustomMapValue {
        foo: _foo,
    })
}
