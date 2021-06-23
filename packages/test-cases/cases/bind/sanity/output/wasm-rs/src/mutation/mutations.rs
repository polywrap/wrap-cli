/*use crate::{Context, CustomEnum, Read, ReadDecoder, Write, WriteEncoder, WriteSizer};
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InputMutationMethod {
    string: String,
    opt_string: Option<String>,
    en: CustomEnum,
    opt_enum: Option<CustomEnum>,
    enum_array: Vec<CustomEnum>,
    opt_enum_array: Option<Vec<CustomEnum>>,
}

impl InputMutationMethod {
    pub fn deserialize_mutation_method_args(args_buf: &[u8]) -> Self {
        let mut context = Context::new();
        context.description = "Deserializing query-type: mutation_method".to_string();
        let mut reader = ReadDecoder::new(args_buf, context);
        let mut num_of_fields = reader.read_map_length().unwrap_or_default();

        let mut string = "".to_string();
        let mut string_set = false;
        let mut opt_string: Option<String> = None;
        let mut en = CustomEnum::_MAX_;
        let mut en_set = false;
        let mut opt_enum: Option<CustomEnum> = Some(CustomEnum::_MAX_);
        let mut enum_array: Vec<CustomEnum> = vec![];
        let mut enum_array_set = false;
        let mut opt_enum_array: Option<Vec<CustomEnum>> = None;

        while num_of_fields > 0 {
            num_of_fields -= 1;
            let field = reader.read_string().unwrap_or_default();
            match field.as_str() {
                "string" => {
                    reader
                        .context()
                        .push(&field, "String", "type found, reading property");
                    string = reader.read_string().unwrap_or_default();
                    string_set = true;
                    reader.context().pop();
                }
                "opt_string" => {
                    reader
                        .context()
                        .push(&field, "Option<String>", "type found, reading property");
                    opt_string = reader.read_nullable_string();
                    reader.context().pop();
                }
                "en" => {
                    reader
                        .context()
                        .push(&field, "CustomEnum", "type found, reading property");
                    let mut value = CustomEnum::_MAX_;
                    if reader.is_next_string() {

                        // TODO
                    }
                    en_set = true;
                    let _ = reader.context().pop();
                }
                _ => {
                    reader
                        .context()
                        .push(&field, "unknown", "searching for property type");
                }
            }
        }

        Self {
            string,
            opt_string,
            en,
            opt_enum,
            enum_array,
            opt_enum_array,
        }
    }
}
*/