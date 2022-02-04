use polywrap_wasm_rs::{
    BigInt,
    Context,
    DecodeError,
    EncodeError,
    Read,
    ReadDecoder,
    Write,
    WriteEncoder,
    WriteSizer,
    JSON,
};
use crate::MutationEnv;

pub fn serialize_mutation_env(input: &MutationEnv) -> Result<Vec<u8>, EncodeError> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) object-type: MutationEnv".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_mutation_env(input, &mut sizer)?;
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: MutationEnv".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_mutation_env(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_mutation_env<W: Write>(input: &MutationEnv, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&3)?;
    writer.context().push("mutation_prop", "String", "writing property");
    writer.write_str("mutation_prop")?;
    writer.write_string(&input.mutation_prop)?;
    writer.context().pop();
    writer.context().push("prop", "String", "writing property");
    writer.write_str("prop")?;
    writer.write_string(&input.prop)?;
    writer.context().pop();
    writer.context().push("opt_prop", "Option<String>", "writing property");
    writer.write_str("opt_prop")?;
    writer.write_nullable_string(&input.opt_prop)?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_mutation_env(input: &[u8]) -> Result<MutationEnv, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing object-type: MutationEnv".to_string();
    let mut reader = ReadDecoder::new(input, context);
    read_mutation_env(&mut reader)
}

pub fn read_mutation_env<R: Read>(reader: &mut R) -> Result<MutationEnv, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;

    let mut _mutation_prop: String = String::new();
    let mut _mutation_prop_set = false;
    let mut _prop: String = String::new();
    let mut _prop_set = false;
    let mut _opt_prop: Option<String> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "mutation_prop" => {
                reader.context().push(&field, "String", "type found, reading property");
                _mutation_prop = reader.read_string()?;
                _mutation_prop_set = true;
                reader.context().pop();
            }
            "prop" => {
                reader.context().push(&field, "String", "type found, reading property");
                _prop = reader.read_string()?;
                _prop_set = true;
                reader.context().pop();
            }
            "opt_prop" => {
                reader.context().push(&field, "Option<String>", "type found, reading property");
                _opt_prop = reader.read_nullable_string()?;
                reader.context().pop();
            }
            _ => {}
        }
    }
    if !_mutation_prop_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'mutation_prop: String'")));
    }
    if !_prop_set {
        return Err(DecodeError::MissingField(reader.context().print_with_context("'prop: String'")));
    }

    Ok(MutationEnv {
        mutation_prop: _mutation_prop,
        prop: _prop,
        opt_prop: _opt_prop,
    })
}
