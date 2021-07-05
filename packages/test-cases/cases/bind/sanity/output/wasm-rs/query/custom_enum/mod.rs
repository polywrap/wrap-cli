use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use std::io::{Error, ErrorKind};

#[derive(Clone, Debug, Deserialize, Serialize)]
#[repr(i32)]
pub enum CustomEnum {
    STRING,
    BYTES,
    _MAX_,
}

impl TryFrom<i32> for CustomEnum {
    type Error = &'static str;

    fn try_from(v: i32) -> Result<Self, Self::Error> {
        match v {
            x if x == Self::STRING as i32 => Ok(Self::STRING),
            x if x == Self::BYTES as i32 => Ok(Self::BYTES),
            x if x == Self::_MAX_ as i32 => Ok(Self::_MAX_),
            _ => Err("Error converting CustomEnum to i32"),
        }
    }
}

pub fn sanitize_custom_enum_value(value: i32) -> Result<(), Error> {
    let max_as_i32 = CustomEnum::_MAX_ as i32;
    let valid = value >= 0 && value < max_as_i32;
    if !valid {
        let custom_error = format!("Invalid value for enum 'CustomEnum': {}", value.to_string());
        return Err(Error::new(ErrorKind::Other, custom_error));
    }
    Ok(())
}

pub fn get_custom_enum_value(key: &str) -> Result<CustomEnum, Error> {
    if key == "STRING" {
        return Ok(CustomEnum::STRING);
    }
    if key == "BYTES" {
        return Ok(CustomEnum::BYTES);
    }
    let custom_error = format!("Invalid key for enum 'CustomEnum': {}", key);
    return Err(Error::new(ErrorKind::Other, custom_error));
}

pub fn get_custom_enum_key(value: CustomEnum) -> String {
    if let Ok(_) = sanitize_custom_enum_value(value.clone() as i32) {
        return match value {
            CustomEnum::STRING => "STRING".to_string(),
            CustomEnum::BYTES => "BYTES".to_string(),
            _ => {
                format!(
                    "Invalid value for enum 'CustomEnum': {}",
                    (value as i32).to_string()
                )
            }
        };
    } else {
        format!("")
    }
}
