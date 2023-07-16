use serde::{Serialize, Deserialize};
use polywrap_msgpack_serde::{
    from_slice,
    to_vec,
    wrappers::polywrap_json::JSONString,
    wrappers::polywrap_bigint::BigIntWrapper
};
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
    JSON,
    subinvoke
};
use crate::TestImportObject;
use crate::TestImportEnum;
use crate::TestImportEnumReturn;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsImportedMethod {
    pub str: String,
    #[serde(rename = "optStr")]
    pub opt_str: Option<String>,
    pub u: u32,
    #[serde(rename = "optU")]
    pub opt_u: Option<u32>,
    #[serde(rename = "uArrayArray")]
    pub u_array_array: Vec<Option<Vec<Option<u32>>>>,
    pub object: TestImportObject,
    #[serde(rename = "optObject")]
    pub opt_object: Option<TestImportObject>,
    #[serde(rename = "objectArray")]
    pub object_array: Vec<TestImportObject>,
    #[serde(rename = "optObjectArray")]
    pub opt_object_array: Option<Vec<Option<TestImportObject>>>,
    pub en: TestImportEnum,
    #[serde(rename = "optEnum")]
    pub opt_enum: Option<TestImportEnum>,
    #[serde(rename = "enumArray")]
    pub enum_array: Vec<TestImportEnum>,
    #[serde(rename = "optEnumArray")]
    pub opt_enum_array: Option<Vec<Option<TestImportEnum>>>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsAnotherMethod {
    pub arg: Vec<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsReturnsArrayOfEnums {
    pub arg: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TestImportModule {
    uri: String
}

impl TestImportModule {
    pub const INTERFACE_URI: &'static str = "testimport.uri.eth";

    pub fn new(uri: String) -> TestImportModule {
        TestImportModule { uri }
    }

    pub fn imported_method(&self, args: &ArgsImportedMethod) -> Result<Option<TestImportObject>, String> {
        let ref uri = self.uri;
        let args = to_vec(args).map_err(|e| e.to_string())?;
        let result = subinvoke::wrap_subinvoke(
            uri.as_str(),
            "importedMethod",
            args,
        )?;
        from_slice(result.as_slice()).map_err(|e| e.to_string())
    }

    pub fn another_method(&self, args: &ArgsAnotherMethod) -> Result<i32, String> {
        let ref uri = self.uri;
        let args = to_vec(args).map_err(|e| e.to_string())?;
        let result = subinvoke::wrap_subinvoke(
            uri.as_str(),
            "anotherMethod",
            args,
        )?;
        from_slice(result.as_slice()).map_err(|e| e.to_string())
    }

    pub fn returns_array_of_enums(&self, args: &ArgsReturnsArrayOfEnums) -> Result<Vec<Option<TestImportEnumReturn>>, String> {
        let ref uri = self.uri;
        let args = to_vec(args).map_err(|e| e.to_string())?;
        let result = subinvoke::wrap_subinvoke(
            uri.as_str(),
            "returnsArrayOfEnums",
            args,
        )?;
        from_slice(result.as_slice()).map_err(|e| e.to_string())
    }
}
