use serde::{Serialize, Deserialize};
use std::convert::TryFrom;

#[derive(Clone, Copy, Debug, Deserialize, Serialize)]
pub enum CustomEnum {
    STRING,
    BYTES,
    _MAX_
}

pub fn sanitize_custom_enum_value(value: i32) -> Result<(), String> {
    let max_as_i32 = CustomEnum::_MAX_ as i32;
    let valid = value >= 0 && value < max_as_i32;
    if !valid {
        return Err(format!("Invalid value for enum 'CustomEnum': {}", value.to_string()));
    }
    Ok(())
}

pub fn get_custom_enum_value(key: &str) -> Result<CustomEnum, String> {
    match key {
        "STRING" => Ok(CustomEnum::STRING),
        "BYTES" => Ok(CustomEnum::BYTES),
        "_MAX_" => Ok(CustomEnum::_MAX_),
        _ => Err(format!("Invalid key for enum 'CustomEnum': {}", key))
    }
}

pub fn get_custom_enum_key(value: CustomEnum) -> Result<String, String> {
    if sanitize_custom_enum_value(value as i32).is_ok() {
        match value {
            CustomEnum::STRING => Ok("STRING".to_string()),
            CustomEnum::BYTES => Ok("BYTES".to_string()),
            CustomEnum::_MAX_ => Ok("_MAX_".to_string()),
        }
    } else {
        Err(format!("Invalid value for enum 'CustomEnum': {}", (value  as i32).to_string()))
    }
}

impl TryFrom<i32> for CustomEnum {
    type Error = &'static str;

    fn try_from(v: i32) -> Result<CustomEnum, Self::Error> {
        match v {
            x if x == CustomEnum::STRING as i32 => Ok(CustomEnum::STRING),
            x if x == CustomEnum::BYTES as i32 => Ok(CustomEnum::BYTES),
            x if x == CustomEnum::_MAX_ as i32 => Ok(CustomEnum::_MAX_),
            _ => Err("Error converting 'CustomEnum' to i32"),
        }
    }
}
