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
use crate::Env;

pub fn serialize_env(input: &Env) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) env-type: Env".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_env(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_env<W: Write>(input: &Env, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&3)?;
    writer.context().push("prop", "String", "writing property");
    writer.write_string("prop")?;
    writer.write_string(&input.prop)?;
    writer.context().pop();
    writer.context().push("optProp", "Option<String>", "writing property");
    writer.write_string("optProp")?;
    writer.write_nullable_string(&input.opt_prop)?;
    writer.context().pop();
    writer.context().push("optMap", "Option<Map<String, Option<i32>>>", "writing property");
    writer.write_string("optMap")?;
    writer.write_nullable_ext_generic_map(&input.opt_map, |writer, key| {
        writer.write_string(key)
    }, |writer, value| {
        writer.write_nullable_i32(value)
    })?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_env(input: &[u8]) -> Result<Env, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing env-type: Env".to_string();
    let mut reader = ReadDecoder::new(input, context);
    read_env(&mut reader)
}

pub fn read_env<R: Read>(reader: &mut R) -> Result<Env, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;

    let mut _prop: String = String::new();
    let mut _prop_set = false;
    let mut _opt_prop: Option<String> = None;
    let mut _opt_map: Option<Map<String, Option<i32>>> = Map::<String, Option<i32>>::new();

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "prop" => {
                reader.context().push(&field, "String", "type found, reading property");
                _prop = reader.read_string()?;
                _prop_set = true;
                reader.context().pop();
            }
            "optProp" => {
                reader.context().push(&field, "Option<String>", "type found, reading property");
                _opt_prop = reader.read_nullable_string()?;
                reader.context().pop();
            }
            "optMap" => {
                reader.context().push(&field, "Option<Map<String, Option<i32>>>", "type found, reading property");
                _opt_map = reader.read_nullable_ext_generic_map(|reader| {
                    reader.read_string()?
                }, |reader| {
                    reader.read_nullable_i32()
                })?;
                reader.context().pop();
            }
            err => return Err(DecodeError::UnknownFieldName(err.to_string())),
        }
    }
    if !_prop_set {
        return Err(DecodeError::MissingField("prop: String.".to_string()));
    }

    Ok(Env {
        prop: _prop,
        opt_prop: _opt_prop,
        opt_map: _opt_map,
    })
}
