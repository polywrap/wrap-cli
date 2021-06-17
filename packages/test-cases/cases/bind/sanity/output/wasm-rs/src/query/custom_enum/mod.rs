use std::io::{Error, ErrorKind, Result};

pub enum CustomEnum {
    STRING,
    BYTES,
    _MAX_,
}

impl CustomEnum {
    pub fn sanitize_custom_enum_value(value: Self) -> Result<()> {
        let valid = value == Self::STRING || value == Self::BYTES || value == Self::_MAX_;
        if !valid {
            let custom_error =
                format!("Invalid value for enum 'CustomEnum': {}", value.to_string());
            return Err(custom_error.into());
        }
        Ok(())
    }

    pub fn get_custom_enum_value(key: &str) -> Result<Self> {
        if key == "STRING" {
            return Ok(Self::STRING);
        }
        if key == "BYTES" {
            return Ok(Self::BYTES);
        }
        let custom_error = format!("Invalid key for enum 'CustomEnum': {}", key);
        Err(custom_error.into())
    }

    pub fn get_custom_enum_key(value: Self) -> String {
        if let Ok(_) = sanitize_custom_enum_value(value) {
            return match value {
                Self::STRING => "STRING".to_string(),
                Self::BYTES => "BYTES".to_string(),
                _ => {}
            };
        }
        format!("Invalid value for enum 'CustomEnum': {}", value.into())
    }
}
