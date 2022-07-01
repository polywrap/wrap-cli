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
use crate::TestImportEnv;

pub fn serialize_test_import_env(args: &TestImportEnv) -> Result<Vec<u8>, EncodeError> {
    let mut encoder_context = Context::new();
    encoder_context.description = "Serializing (encoding) imported env-type: TestImportEnv".to_string();
    let mut encoder = WriteEncoder::new(&[], encoder_context);
    write_test_import_env(args, &mut encoder)?;
    Ok(encoder.get_buffer())
}

pub fn write_test_import_env<W: Write>(args: &TestImportEnv, writer: &mut W) -> Result<(), EncodeError> {
    writer.write_map_length(&1)?;
    writer.context().push("enviroProp", "String", "writing property");
    writer.write_string("enviroProp")?;
    writer.write_string(&args.enviro_prop)?;
    writer.context().pop();
    Ok(())
}

pub fn deserialize_test_import_env(args: &[u8]) -> Result<TestImportEnv, DecodeError> {
    let mut context = Context::new();
    context.description = "Deserializing imported env-type: TestImportEnv".to_string();
    let mut reader = ReadDecoder::new(args, context);
    read_test_import_env(&mut reader)
}

pub fn read_test_import_env<R: Read>(reader: &mut R) -> Result<TestImportEnv, DecodeError> {
    let mut num_of_fields = reader.read_map_length()?;

    let mut _enviro_prop: String = String::new();
    let mut _enviro_prop_set = false;

    while num_of_fields > 0 {
        num_of_fields -= 1;
        let field = reader.read_string()?;

        match field.as_str() {
            "enviroProp" => {
                reader.context().push(&field, "String", "type found, reading property");
                _enviro_prop = reader.read_string()?;
                _enviro_prop_set = true;
                reader.context().pop();
            }
            err => return Err(DecodeError::UnknownFieldName(err.to_string())),
        }
    }
    if !_enviro_prop_set {
        return Err(DecodeError::MissingField("enviroProp: String.".to_string()));
    }

    Ok(TestImportEnv {
        enviro_prop: _enviro_prop,
    })
}
