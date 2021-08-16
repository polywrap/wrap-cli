use serde::{
    Deserialize, 
    Serialize,
};
use std::convert::TryFrom;

#[derive(Clone, Copy, Debug, Deserialize, Serialize)]
pub enum CustomEnum {
    STRING,
    BYTES,
    _MAX_,
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
    if key == "STRING" {
        return Ok(CustomEnum::STRING);
    }
    if key == "BYTES" {
        return Ok(CustomEnum::BYTES);
    }
    Err(format!("Invalid key for enum 'CustomEnum': {}", key))
}

pub fn get_custom_enum_key(value: CustomEnum) -> String {
    if sanitize_custom_enum_value(value as i32).is_ok() {
        return match value {
            CustomEnum::STRING => "STRING".to_string(),
            CustomEnum::BYTES => "BYTES".to_string(),
            _ => {format!("Invalid value for enum 'CustomEnum': {}", (value as i32).to_string())}
        };
    } else {
        format!("")
    }
}

impl TryFrom<i32> for CustomEnum {
    type Error = &'static str;

    fn try_from(v: i32) -> Result<CustomEnum, Self::Error> {
        match v {
            x if x == CustomEnum::STRING as i32 => Ok(CustomEnum::STRING),
            x if x == CustomEnum::BYTES as i32 => Ok(CustomEnum::BYTES),
            x if x == CustomEnum::_MAX_ as i32 => Ok(CustomEnum::_MAX_),
            _ => Err("Error converting CustomEnum to i32"),
        }
    }
}
