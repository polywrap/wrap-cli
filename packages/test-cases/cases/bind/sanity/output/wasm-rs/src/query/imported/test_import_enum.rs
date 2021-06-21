// FIXME:

use std::io::{Error, ErrorKind, Result};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TestImportEnum {
    STRING,
    BYTES,
    _MAX_(i32),
}

impl TestImportEnum {
    pub fn sanitize_test_import_enum_value(&mut self, value: i32) -> Result<()> {
        let valid = value >= 0 && value < TestImportEnum::_MAX_(i32);
        if !valid {
            let custom_error = format!(
                "Invalid value for enum 'TestImportEnum': {}",
                value.to_string()
            );
            return Err(Error::new(ErrorKind::Other, custom_error));
        }
        Ok(())
    }

    pub fn get_test_import_enum_value(&self, key: &str) -> Result<Self> {
        if key == "STRING" {
            return Ok(Self::STRING);
        }
        if key == "BYTES" {
            return Ok(Self::BYTES);
        }
        let custom_error = format!("Invalid key for enum 'TestImportEnum': {}", key);
        return Err(Error::new(ErrorKind::Other, custom_error));
    }

    pub fn get_test_import_enum_key(&mut self, value: Self) -> String {
        if let Ok(_) = self.sanitize_test_import_enum_value(value) {
            return match value {
                Self::STRING => "STRING".to_string(),
                Self::BYTES => "BYTES".to_string(),
                _ => {
                    format!("Invalid value for enum 'TestImportEnum': {}", value.into())
                }
            };
        }
    }
}
