use polywrap_wasm_rs::EnumTypeError;
use serde::{Serialize, Deserialize};
use std::convert::TryFrom;

#[derive(Clone, Copy, Debug, Deserialize, Serialize)]
pub enum TestImportEnumReturn {
    #[serde(rename = "STRING")]
    STRING,
    #[serde(rename = "BYTES")]
    BYTES,
    _MAX_
}

pub fn sanitize_test_import_enum_return_value(value: i32) -> Result<(), EnumTypeError> {
    if value < 0 && value >= TestImportEnumReturn::_MAX_ as i32 {
        return Err(EnumTypeError::EnumProcessingError(format!("Invalid value for enum 'TestImportEnumReturn': {}", value.to_string())));
    }
    Ok(())
}

pub fn get_test_import_enum_return_value(key: &str) -> Result<TestImportEnumReturn, EnumTypeError> {
    match key {
        "STRING" => Ok(TestImportEnumReturn::STRING),
        "BYTES" => Ok(TestImportEnumReturn::BYTES),
        "_MAX_" => Ok(TestImportEnumReturn::_MAX_),
        err => Err(EnumTypeError::EnumProcessingError(format!("Invalid key for enum 'TestImportEnumReturn': {}", err)))
    }
}

pub fn get_test_import_enum_return_key(value: TestImportEnumReturn) -> Result<String, EnumTypeError> {
    if sanitize_test_import_enum_return_value(value as i32).is_ok() {
        match value {
            TestImportEnumReturn::STRING => Ok("STRING".to_string()),
            TestImportEnumReturn::BYTES => Ok("BYTES".to_string()),
            TestImportEnumReturn::_MAX_ => Ok("_MAX_".to_string()),
        }
    } else {
        Err(EnumTypeError::EnumProcessingError(format!("Invalid value for enum 'TestImportEnumReturn': {}", (value  as i32).to_string())))
    }
}

impl TryFrom<i32> for TestImportEnumReturn {
    type Error = EnumTypeError;

    fn try_from(v: i32) -> Result<TestImportEnumReturn, Self::Error> {
        match v {
            x if x == TestImportEnumReturn::STRING as i32 => Ok(TestImportEnumReturn::STRING),
            x if x == TestImportEnumReturn::BYTES as i32 => Ok(TestImportEnumReturn::BYTES),
            x if x == TestImportEnumReturn::_MAX_ as i32 => Ok(TestImportEnumReturn::_MAX_),
            _ => Err(EnumTypeError::ParseEnumError(format!("Invalid value for enum 'TestImportEnumReturn': {}", (v  as i32).to_string()))),
        }
    }
}
