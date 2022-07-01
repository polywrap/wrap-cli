use polywrap_wasm_rs::{
  wrap_load_env
};

use crate::{
    module_method,
    InputModuleMethod,
    deserialize_module_method_args,
    serialize_module_method_result,
    object_method,
    InputObjectMethod,
    deserialize_object_method_args,
    serialize_object_method_result,
    optional_env_method,
    InputOptionalEnvMethod,
    deserialize_optional_env_method_args,
    serialize_optional_env_method_result
};

use crate::Env;

pub fn module_method_wrapped(input: &[u8], env_size: u32) -> Vec<u8> {
    match deserialize_module_method_args(input) {
        Ok(args) => {
            let result = module_method(InputModuleMethod {
                str: args.str,
                opt_str: args.opt_str,
                en: args.en,
                opt_enum: args.opt_enum,
                enum_array: args.enum_array,
                opt_enum_array: args.opt_enum_array,
                map: args.map,
            });
            serialize_module_method_result(&result).unwrap()
        }
        Err(e) => {
            panic!("{}", e.to_string())
        }
    }
}

pub fn object_method_wrapped(input: &[u8], env_size: u32) -> Vec<u8> {
    if env_size == 0 {
        panic!("Environment is not set, and it is required by method 'objectMethod'");
    }

    let env_buf = wrap_load_env(env_size);
    let env = Env::from_buffer(&env_buf).unwrap();

    match deserialize_object_method_args(input) {
        Ok(args) => {
            let result = object_method(InputObjectMethod {
                object: args.object,
                opt_object: args.opt_object,
                object_array: args.object_array,
                opt_object_array: args.opt_object_array,
            }, env);
            serialize_object_method_result(&result).unwrap()
        }
        Err(e) => {
            panic!("{}", e.to_string())
        }
    }
}

pub fn optional_env_method_wrapped(input: &[u8], env_size: u32) -> Vec<u8> {
    let mut env: Option<Env> = None;

    if env_size > 0 {
      let env_buf = wrap_load_env(env_size);
      env = Some(Env::from_buffer(&env_buf).unwrap());
    }

    match deserialize_optional_env_method_args(input) {
        Ok(args) => {
            let result = optional_env_method(InputOptionalEnvMethod {
                object: args.object,
                opt_object: args.opt_object,
                object_array: args.object_array,
                opt_object_array: args.opt_object_array,
            }, env);
            serialize_optional_env_method_result(&result).unwrap()
        }
        Err(e) => {
            panic!("{}", e.to_string())
        }
    }
}
