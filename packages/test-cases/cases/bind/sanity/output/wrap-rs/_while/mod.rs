use polywrap_wasm_rs::{EnumTypeError};
use serde::{Serialize, Deserialize};
use std::convert::TryFrom;

#[derive(Clone, Copy, Debug, Deserialize, Serialize)]
pub enum While {
    #[serde(rename = "for")]
    _for,
    #[serde(rename = "in")]
    _in,
    _MAX_
}

pub fn sanitize_while_value(value: i32) -> Result<(), EnumTypeError> {
    if value < 0 && value >= While::_MAX_ as i32 {
        return Err(EnumTypeError::EnumProcessingError(format!("Invalid value for enum 'While': {}", value.to_string())));
    }
    Ok(())
}

pub fn get_while_value(key: &str) -> Result<While, EnumTypeError> {
    match key {
        "_for" => Ok(While::_for),
        "_in" => Ok(While::_in),
        "_MAX_" => Ok(While::_MAX_),
        err => Err(EnumTypeError::EnumProcessingError(format!("Invalid key for enum 'While': {}", err)))
    }
}

pub fn get_while_key(value: While) -> Result<String, EnumTypeError> {
    if sanitize_while_value(value as i32).is_ok() {
        match value {
            While::_for => Ok("_for".to_string()),
            While::_in => Ok("_in".to_string()),
            While::_MAX_ => Ok("_MAX_".to_string()),
        }
    } else {
        Err(EnumTypeError::EnumProcessingError(format!("Invalid value for enum 'While': {}", (value  as i32).to_string())))
    }
}

impl TryFrom<i32> for While {
    type Error = EnumTypeError;

    fn try_from(v: i32) -> Result<While, Self::Error> {
        match v {
            x if x == While::_for as i32 => Ok(While::_for),
            x if x == While::_in as i32 => Ok(While::_in),
            x if x == While::_MAX_ as i32 => Ok(While::_MAX_),
            _ => Err(EnumTypeError::ParseEnumError(format!("Invalid value for enum 'While': {}", (v  as i32).to_string()))),
        }
    }
}
