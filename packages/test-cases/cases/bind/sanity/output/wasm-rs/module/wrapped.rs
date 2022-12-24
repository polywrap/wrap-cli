use polywrap_wasm_rs::{
  wrap_load_env
};

use crate::{
    ArgsModuleMethod,
    deserialize_module_method_args,
    serialize_module_method_result,
    ArgsObjectMethod,
    deserialize_object_method_args,
    serialize_object_method_result,
    ArgsOptionalEnvMethod,
    deserialize_optional_env_method_args,
    serialize_optional_env_method_result,
    ArgsIf,
    deserialize_if_args,
    serialize_if_result
};

use crate::module::{IModule, Module};
use crate::Env;
use crate::module::EnvTrait;

pub fn module_method_wrapped(module: &mut Module, args: &[u8], env_size: u32) -> Vec<u8> {
    match deserialize_module_method_args(args) {
        Ok(args) => {
            let result = module.module_method(ArgsModuleMethod {
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
            serialize_module_method_result(&res).unwrap()
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

pub fn object_method_wrapped(module: &mut Module, args: &[u8], env_size: u32) -> Vec<u8> {
    if env_size == 0 {
        panic!("Environment is not set, and it is required by method 'objectMethod'");
    }

    let env_buf = wrap_load_env(env_size);
    module.__set_env__(Env::from_buffer(&env_buf).unwrap());

    match deserialize_object_method_args(args) {
        Ok(args) => {
            let result = module.object_method(ArgsObjectMethod {
                object: args.object,
                opt_object: args.opt_object,
                object_array: args.object_array,
                opt_object_array: args.opt_object_array,
            });
            match result {
                Ok(res) => {
            serialize_object_method_result(&res).unwrap()
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

pub fn optional_env_method_wrapped(module: &mut Module, args: &[u8], env_size: u32) -> Vec<u8> {
    if env_size > 0 {
      let env_buf = wrap_load_env(env_size);
      module.__set_env__(Env::from_buffer(&env_buf).unwrap());
    }

    match deserialize_optional_env_method_args(args) {
        Ok(args) => {
            let result = module.optional_env_method(ArgsOptionalEnvMethod {
                object: args.object,
                opt_object: args.opt_object,
                object_array: args.object_array,
                opt_object_array: args.opt_object_array,
            });
            match result {
                Ok(res) => {
            serialize_optional_env_method_result(&res).unwrap()
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

pub fn if_wrapped(module: &mut Module, args: &[u8], env_size: u32) -> Vec<u8> {
    match deserialize_if_args(args) {
        Ok(args) => {
            let result = module._if(ArgsIf {
                _if: args._if,
            });
            match result {
                Ok(res) => {
            serialize_if_result(&res).unwrap()
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
