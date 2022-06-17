use polywrap_wasm_rs::{EnumTypeError};
use serde::{Serialize, Deserialize};
use std::convert::TryFrom;

#[derive(Clone, Copy, Debug, Deserialize, Serialize)]
pub enum CustomEnum {
    STRING,
    BYTES,
    _MAX_
}

pub fn sanitize_custom_enum_value(value: i32) -> Result<(), EnumTypeError> {
    if value < 0 && value >= CustomEnum::_MAX_ as i32 {
        return Err(EnumTypeError::EnumProcessingError(format!("Invalid value for enum 'CustomEnum': {}", value.to_string())));
    }
    Ok(())
}

pub fn get_custom_enum_value(key: &str) -> Result<CustomEnum, EnumTypeError> {
    match key {
        "STRING" => Ok(CustomEnum::STRING),
        "BYTES" => Ok(CustomEnum::BYTES),
        "_MAX_" => Ok(CustomEnum::_MAX_),
        err => Err(EnumTypeError::EnumProcessingError(format!("Invalid key for enum 'CustomEnum': {}", err)))
    }
}

pub fn get_custom_enum_key(value: CustomEnum) -> Result<String, EnumTypeError> {
    if sanitize_custom_enum_value(value as i32).is_ok() {
        match value {
            CustomEnum::STRING => Ok("STRING".to_string()),
            CustomEnum::BYTES => Ok("BYTES".to_string()),
            CustomEnum::_MAX_ => Ok("_MAX_".to_string()),
        }
    } else {
        Err(EnumTypeError::EnumProcessingError(format!("Invalid value for enum 'CustomEnum': {}", (value  as i32).to_string())))
    }
}

impl TryFrom<i32> for CustomEnum {
    type Error = EnumTypeError;

    fn try_from(v: i32) -> Result<CustomEnum, Self::Error> {
        match v {
            x if x == CustomEnum::STRING as i32 => Ok(CustomEnum::STRING),
            x if x == CustomEnum::BYTES as i32 => Ok(CustomEnum::BYTES),
            x if x == CustomEnum::_MAX_ as i32 => Ok(CustomEnum::_MAX_),
            _ => Err(EnumTypeError::ParseEnumError(format!("Invalid value for enum 'CustomEnum': {}", (v  as i32).to_string()))),
        }
    }
}
