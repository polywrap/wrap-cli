extern crate std;
use std::convert::TryFrom;

#[derive(Clone, Copy, Debug)]
pub enum TestImportEnum {
    STRING,
    BYTES,
    _MAX_,
}

pub fn sanitize_test_import_enum_value(value: i32) -> Result<(), String> {
    let max_as_i32 = TestImportEnum::_MAX_ as i32;
    let valid = value >= 0 && value < max_as_i32;
    if !valid {
        return Err(format!(
            "Invalid value for enum 'TestImportEnum': {}",
            value.to_string()
        ));
    }
    Ok(())
}

pub fn get_test_import_enum_value(key: &str) -> Result<TestImportEnum, String> {
    if key == "STRING" {
        return Ok(TestImportEnum::STRING);
    }
    if key == "BYTES" {
        return Ok(TestImportEnum::BYTES);
    }
    Err(format!("Invalid key for enum 'TestImportEnum': {}", key))
}

pub fn get_test_import_enum_key(value: TestImportEnum) -> String {
    if sanitize_test_import_enum_value(value as i32).is_ok() {
        return match value {
            TestImportEnum::STRING => "STRING".to_string(),
            TestImportEnum::BYTES => "BYTES".to_string(),
            _ => {
                format!(
                    "Invalid value for enum 'TestImportEnum': {}",
                    (value as i32).to_string()
                )
            }
        };
    } else {
        format!("")
    }
}

impl TryFrom<i32> for TestImportEnum {
    type Error = &'static str;

    fn try_from(v: i32) -> Result<TestImportEnum, Self::Error> {
        match v {
            x if x == TestImportEnum::STRING as i32 => Ok(TestImportEnum::STRING),
            x if x == TestImportEnum::BYTES as i32 => Ok(TestImportEnum::BYTES),
            x if x == TestImportEnum::_MAX_ as i32 => Ok(TestImportEnum::_MAX_),
            _ => Err("Error converting TestImportEnum to i32"),
        }
    }
}