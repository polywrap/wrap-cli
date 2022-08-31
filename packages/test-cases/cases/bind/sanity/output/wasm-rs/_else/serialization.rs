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
use crate::Else;

pub fn serialize_else(args: Else) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: Else".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_else(args, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_else<W: Write>(args: Else, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&1)?;
    writer.context().push("else", "String", "writing property");
    writer.write_string("else")?;
    writer.write_string(&args._else)?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_else(args: &[u8]) -> Result<Else, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing object-type: Else".to_string();
    let mut reader = ReadDecoder::new(args, context);
    read_else(&mut reader)
}

pub fn read_else<R: Read>(reader: &mut R) -> Result<Else, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;

    let mut _else: String = String::new();
    let mut _else_set = false;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "else" => {
                reader.context().push(&field, "String", "type found, reading property");
                _else = reader.read_string()?;
                _else_set = true;
                reader.context().pop();
            }
            err => return Err(DecodeError::UnknownFieldName(err.to_string())),
        }
    }
    if !_else_set {
        return Err(DecodeError::MissingField("else: String.".to_string()));
    }

    Ok(Else {
        _else: _else,
    })
}
