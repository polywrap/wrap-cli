use serde::{Deserialize, Serialize};
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
    wrap_load_env
};
use crate::module::{ModuleTrait, Module};
use crate::CustomEnum;
use crate::AnotherType;
use crate::Else;
use crate::Env;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsModuleMethod {
    pub str: String,
    #[serde(rename = "optStr")]
    pub opt_str: Option<String>,
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
    #[serde(rename = "mapOfMap")]
    pub map_of_map: Map<String, Map<String, i32>>,
    #[serde(rename = "mapOfObj")]
    pub map_of_obj: Map<String, AnotherType>,
    #[serde(rename = "mapOfArrOfObj")]
    pub map_of_arr_of_obj: Map<String, Vec<AnotherType>>,
}

pub fn module_method_wrapped(args: &[u8], env_size: u32) -> Vec<u8> {
    match from_slice::<ArgsModuleMethod>(args) {
        Ok(args) => {
            let result = Module::module_method(ArgsModuleMethod {
                str: args.str,
                opt_str: args.opt_str,
                en: args.en,
                opt_enum: args.opt_enum,
                enum_array: args.enum_array,
                opt_enum_array: args.opt_enum_array,
                map: args.map,
                map_of_arr: args.map_of_arr,
                map_of_map: args.map_of_map,
                map_of_obj: args.map_of_obj,
                map_of_arr_of_obj: args.map_of_arr_of_obj,
            });
            match result {
                Ok(res) => {
                    to_vec(&res).unwrap()
                }
                Err(e) => {
                    panic!("{}", e.to_string())
                }
            }
        }
        Err(e) => {
            panic!("{}", e.to_string())
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsObjectMethod {
    pub object: AnotherType,
    #[serde(rename = "optObject")]
    pub opt_object: Option<AnotherType>,
    #[serde(rename = "objectArray")]
    pub object_array: Vec<AnotherType>,
    #[serde(rename = "optObjectArray")]
    pub opt_object_array: Option<Vec<Option<AnotherType>>>,
}

pub fn object_method_wrapped(args: &[u8], env_size: u32) -> Vec<u8> {
    if env_size == 0 {
        panic!("Environment is not set, and it is required by method 'objectMethod'");
    }

    let env_buf = wrap_load_env(env_size);
    let env = Env::from_buffer(&env_buf).unwrap();

    match from_slice::<ArgsObjectMethod>(args) {
        Ok(args) => {
            let result = Module::object_method(ArgsObjectMethod {
                object: args.object,
                opt_object: args.opt_object,
                object_array: args.object_array,
                opt_object_array: args.opt_object_array,
            }, env);
            match result {
                Ok(res) => {
                    to_vec(&res).unwrap()
                }
                Err(e) => {
                    panic!("{}", e.to_string())
                }
            }
        }
        Err(e) => {
            panic!("{}", e.to_string())
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsOptionalEnvMethod {
    pub object: AnotherType,
    #[serde(rename = "optObject")]
    pub opt_object: Option<AnotherType>,
    #[serde(rename = "objectArray")]
    pub object_array: Vec<AnotherType>,
    #[serde(rename = "optObjectArray")]
    pub opt_object_array: Option<Vec<Option<AnotherType>>>,
}

pub fn optional_env_method_wrapped(args: &[u8], env_size: u32) -> Vec<u8> {
    let mut env: Option<Env> = None;
    if env_size > 0 {
      let env_buf = wrap_load_env(env_size);
      env = Some(Env::from_buffer(&env_buf).unwrap());
    }

    match from_slice::<ArgsOptionalEnvMethod>(args) {
        Ok(args) => {
            let result = Module::optional_env_method(ArgsOptionalEnvMethod {
                object: args.object,
                opt_object: args.opt_object,
                object_array: args.object_array,
                opt_object_array: args.opt_object_array,
            }, env);
            match result {
                Ok(res) => {
                    to_vec(&res).unwrap()
                }
                Err(e) => {
                    panic!("{}", e.to_string())
                }
            }
        }
        Err(e) => {
            panic!("{}", e.to_string())
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ArgsIf {
    #[serde(rename = "if")]
    pub _if: Else,
}

pub fn if_wrapped(args: &[u8], env_size: u32) -> Vec<u8> {
    match from_slice::<ArgsIf>(args) {
        Ok(args) => {
            let result = Module::_if(ArgsIf {
                _if: args._if,
            });
            match result {
                Ok(res) => {
                    to_vec(&res).unwrap()
                }
                Err(e) => {
                    panic!("{}", e.to_string())
                }
            }
        }
        Err(e) => {
            panic!("{}", e.to_string())
        }
    }
}
