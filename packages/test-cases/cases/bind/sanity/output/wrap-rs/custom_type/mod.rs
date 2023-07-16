use serde::{Serialize, Deserialize};
use polywrap_msgpack_serde::{
    wrappers::polywrap_json::JSONString,
    wrappers::polywrap_bigint::BigIntWrapper
};
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
    JSON
};
use crate::AnotherType;
use crate::CustomEnum;
use crate::CustomMapValue;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CustomType {
    pub str: String,
    #[serde(rename = "optStr")]
    pub opt_str: Option<String>,
    pub u: u32,
    #[serde(rename = "optU")]
    pub opt_u: Option<u32>,
    pub u8: u8,
    pub u16: u16,
    pub u32: u32,
    pub i: i32,
    pub i8: i8,
    pub i16: i16,
    pub i32: i32,
    pub bigint: BigIntWrapper,
    #[serde(rename = "optBigint")]
    pub opt_bigint: Option<BigIntWrapper>,
    pub bignumber: BigNumber,
    #[serde(rename = "optBignumber")]
    pub opt_bignumber: Option<BigNumber>,
    pub json: JSONString,
    #[serde(rename = "optJson")]
    pub opt_json: Option<JSONString>,
    #[serde(with = "serde_bytes")]
    pub bytes: Vec<u8>,
    #[serde(with = "serde_bytes")]
    #[serde(rename = "optBytes")]
    pub opt_bytes: Option<Vec<u8>>,
    pub boolean: bool,
    #[serde(rename = "optBoolean")]
    pub opt_boolean: Option<bool>,
    pub u_array: Vec<u32>,
    #[serde(rename = "uOpt_array")]
    pub u_opt_array: Option<Vec<u32>>,
    #[serde(rename = "_opt_uOptArray")]
    pub _opt_u_opt_array: Option<Vec<Option<u32>>>,
    #[serde(rename = "optStrOptArray")]
    pub opt_str_opt_array: Option<Vec<Option<String>>>,
    #[serde(rename = "uArrayArray")]
    pub u_array_array: Vec<Vec<u32>>,
    #[serde(rename = "uOptArrayOptArray")]
    pub u_opt_array_opt_array: Vec<Option<Vec<Option<u32>>>>,
    #[serde(rename = "uArrayOptArrayArray")]
    pub u_array_opt_array_array: Vec<Option<Vec<Vec<u32>>>>,
    #[serde(rename = "crazyArray")]
    pub crazy_array: Option<Vec<Option<Vec<Vec<Option<Vec<u32>>>>>>>,
    pub object: AnotherType,
    #[serde(rename = "optObject")]
    pub opt_object: Option<AnotherType>,
    #[serde(rename = "objectArray")]
    pub object_array: Vec<AnotherType>,
    #[serde(rename = "optObjectArray")]
    pub opt_object_array: Option<Vec<Option<AnotherType>>>,
    pub en: CustomEnum,
    #[serde(rename = "optEnum")]
    pub opt_enum: Option<CustomEnum>,
    #[serde(rename = "enumArray")]
    pub enum_array: Vec<CustomEnum>,
    #[serde(rename = "optEnumArray")]
    pub opt_enum_array: Option<Vec<Option<CustomEnum>>>,
    pub map: Map<String, i32>,
    #[serde(rename = "mapOfArr")]
    pub map_of_arr: Map<String, Vec<i32>>,
    #[serde(rename = "mapOfObj")]
    pub map_of_obj: Map<String, AnotherType>,
    #[serde(rename = "mapOfArrOfObj")]
    pub map_of_arr_of_obj: Map<String, Vec<AnotherType>>,
    #[serde(rename = "mapCustomValue")]
    pub map_custom_value: Map<String, Option<CustomMapValue>>,
}

impl CustomType {
    pub fn new() -> CustomType {
        CustomType {
            str: String::new(),
            opt_str: None,
            u: 0,
            opt_u: None,
            u8: 0,
            u16: 0,
            u32: 0,
            i: 0,
            i8: 0,
            i16: 0,
            i32: 0,
            bigint: BigIntWrapper(BigInt::default()),
            opt_bigint: None,
            bignumber: BigNumber::default(),
            opt_bignumber: None,
            json: JSONString::from(JSON::Value::Null),
            opt_json: None,
            bytes: vec![],
            opt_bytes: None,
            boolean: false,
            opt_boolean: None,
            u_array: vec![],
            u_opt_array: None,
            _opt_u_opt_array: None,
            opt_str_opt_array: None,
            u_array_array: vec![],
            u_opt_array_opt_array: vec![],
            u_array_opt_array_array: vec![],
            crazy_array: None,
            object: Option<AnotherType>::new(),
            opt_object: None,
            object_array: vec![],
            opt_object_array: None,
            en: Option<CustomEnum>::_MAX_,
            opt_enum: None,
            enum_array: vec![],
            opt_enum_array: None,
            map: Map::<String, i32>::new(),
            map_of_arr: Map::<String, Vec<i32>>::new(),
            map_of_obj: Map::<String, AnotherType>::new(),
            map_of_arr_of_obj: Map::<String, Vec<AnotherType>>::new(),
            map_custom_value: Map::<String, Option<CustomMapValue>>::new(),
        }
    }
}
