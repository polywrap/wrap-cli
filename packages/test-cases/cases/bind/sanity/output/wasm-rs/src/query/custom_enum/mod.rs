use std::io::{Error, ErrorKind, Result};

pub enum CustomEnum {
    STRING,
    BYTES,
    _MAX_,
}

pub fn sanitize_custom_enum_value(value: CustomEnum) -> Result<()> {
    let valid =
        value == CustomEnum::STRING || value == CustomEnum::BYTES || value == CustomEnum::_MAX_;
    if !valid {
        let custom_error = format!("Invalid value for enum 'CustomEnum': {}", value.to_string());
        return Err(custom_error.into());
    }
    Ok(())
}

pub fn get_custom_enum_value(key: &str) -> Result<CustomEnum> {
    if key == "STRING" {
        return Ok(CustomEnum::STRING);
    }
    if key == "BYTES" {
        return Ok(CustomEnum::BYTES);
    }
    let custom_error = format!("Invalid key for enum 'CustomEnum': {}", key);
    Err(custom_error.into())
}

pub fn get_custom_enum_key(value: CustomEnum) -> String {
    if let Ok(_) = sanitize_custom_enum_value(value) {
        return match value {
            CustomEnum::STRING => "STRING".to_string(),
            CustomEnum::BYTES => "BYTES".to_string(),
            _ => {}
        };
    }
    format!("Invalid value for enum 'CustomEnum': {}", value.into())
}
