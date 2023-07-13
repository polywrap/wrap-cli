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
use crate::AnotherType;

use crate::CustomType;

pub fn serialize_another_type(args: &AnotherType) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: AnotherType".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_another_type(args, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_another_type<W: Write>(args: &AnotherType, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&3)?;
    writer.context().push("prop", "Option<String>", "writing property");
    writer.write_string("prop")?;
    writer.write_optional_string(&args.prop)?;
    writer.context().pop();
    writer.context().push("circular", "Option<CustomType>", "writing property");
    writer.write_string("circular")?;
    if args.circular.is_some() {
        CustomType::write(args.circular.as_ref().as_ref().unwrap(), writer)?;
    } else {
        writer.write_nil()?;
    }
    writer.context().pop();
    writer.context().push("const", "Option<String>", "writing property");
    writer.write_string("const")?;
    writer.write_optional_string(&args._const)?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_another_type(args: &[u8]) -> Result<AnotherType, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing object-type: AnotherType".to_string();
    let mut reader = ReadDecoder::new(args, context);
    read_another_type(&mut reader)
}

pub fn read_another_type<R: Read>(reader: &mut R) -> Result<AnotherType, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;

    let mut _prop: Option<String> = None;
    let mut _circular: Option<CustomType> = None;
    let mut _const: Option<String> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "prop" => {
                reader.context().push(&field, "Option<String>", "type found, reading property");
                _prop = reader.read_optional_string()?;
                reader.context().pop();
            }
            "circular" => {
                reader.context().push(&field, "Option<CustomType>", "type found, reading property");
                let mut object: Option<CustomType> = None;
                if !reader.is_next_nil()? {
                    object = Some(CustomType::read(reader)?);
                } else {
                    object = None;
                }
                _circular = object;
                reader.context().pop();
            }
            "const" => {
                reader.context().push(&field, "Option<String>", "type found, reading property");
                _const = reader.read_optional_string()?;
                reader.context().pop();
            }
            err => return Err(DecodeError::UnknownFieldName(err.to_string())),
        }
    }

    Ok(AnotherType {
        prop: _prop,
        circular: _circular,
        _const: _const,
    })
}
