use polywrap_wasm_rs::EnumTypeError;
use serde::{Serialize, Deserialize};
use std::convert::TryFrom;

#[derive(Clone, Copy, Debug, Deserialize, Serialize)]
pub enum TestImportEnum {
    #[serde(rename = "STRING")]
    STRING,
    #[serde(rename = "BYTES")]
    BYTES,
    _MAX_
}

pub fn sanitize_test_import_enum_value(value: i32) -> Result<(), EnumTypeError> {
    if value < 0 && value >= TestImportEnum::_MAX_ as i32 {
        return Err(EnumTypeError::EnumProcessingError(format!("Invalid value for enum 'TestImportEnum': {}", value.to_string())));
    }
    Ok(())
}

pub fn get_test_import_enum_value(key: &str) -> Result<TestImportEnum, EnumTypeError> {
    match key {
        "STRING" => Ok(TestImportEnum::STRING),
        "BYTES" => Ok(TestImportEnum::BYTES),
        "_MAX_" => Ok(TestImportEnum::_MAX_),
        err => Err(EnumTypeError::EnumProcessingError(format!("Invalid key for enum 'TestImportEnum': {}", err)))
    }
}

pub fn get_test_import_enum_key(value: TestImportEnum) -> Result<String, EnumTypeError> {
    if sanitize_test_import_enum_value(value as i32).is_ok() {
        match value {
            TestImportEnum::STRING => Ok("STRING".to_string()),
            TestImportEnum::BYTES => Ok("BYTES".to_string()),
            TestImportEnum::_MAX_ => Ok("_MAX_".to_string()),
        }
    } else {
        Err(EnumTypeError::EnumProcessingError(format!("Invalid value for enum 'TestImportEnum': {}", (value  as i32).to_string())))
    }
}

impl TryFrom<i32> for TestImportEnum {
    type Error = EnumTypeError;

    fn try_from(v: i32) -> Result<TestImportEnum, Self::Error> {
        match v {
            x if x == TestImportEnum::STRING as i32 => Ok(TestImportEnum::STRING),
            x if x == TestImportEnum::BYTES as i32 => Ok(TestImportEnum::BYTES),
            x if x == TestImportEnum::_MAX_ as i32 => Ok(TestImportEnum::_MAX_),
            _ => Err(EnumTypeError::ParseEnumError(format!("Invalid value for enum 'TestImportEnum': {}", (v  as i32).to_string()))),
        }
    }
}
