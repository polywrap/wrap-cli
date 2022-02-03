use polywrap_wasm_rs::{
    BigInt,
    Context,
    Read,
    ReadDecoder,
    Write,
    WriteEncoder,
    WriteSizer,
    JSON
};
use crate::QueryEnv;

pub fn serialize_query_env(input: &QueryEnv) -> Result<Vec<u8>, String> {
    let mut sizer_context = Context::new();
    sizer_context.description = "Serializing (sizing) object-type: QueryEnv".to_string();
    let mut sizer = WriteSizer::new(sizer_context);
    write_query_env(input, &mut sizer)?;
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) object-type: QueryEnv".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_query_env(input, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_query_env<W: Write>(input: &QueryEnv, writer: &mut W) -> Result<(), String> {
    writer.write_map_length(&3)?;
    writer.context().push("query_prop", "String", "writing property");
    writer.write_str("query_prop")?;
    writer.write_string(&input.query_prop)?;
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

pub fn deserialize_query_env(input: &[u8]) -> Result<QueryEnv, String> {
    let mut context = Context::new();
    context.description = "Deserializing object-type: QueryEnv".to_string();
    let mut reader = ReadDecoder::new(input, context);
    read_query_env(&mut reader)
}

pub fn read_query_env<R: Read>(reader: &mut R) -> Result<QueryEnv, String> {
    let mut num_of_fields = reader.read_map_length()?;

    let mut _query_prop: String = String::new();
    let mut _query_prop_set = false;
    let mut _prop: String = String::new();
    let mut _prop_set = false;
    let mut _opt_prop: Option<String> = None;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "query_prop" => {
                reader.context().push(&field, "String", "type found, reading property");
                _query_prop = reader.read_string()?;
                _query_prop_set = true;
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
    if !_query_prop_set {
        return Err(reader.context().print_with_context("Missing required property: 'query_prop: String'"));
    }
    if !_prop_set {
        return Err(reader.context().print_with_context("Missing required property: 'prop: String'"));
    }

    Ok(QueryEnv {
        query_prop: _query_prop,
        prop: _prop,
        opt_prop: _opt_prop,
    })
}
