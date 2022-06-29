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

pub fn module_method_wrapped(input: &[u8]) -> Vec<u8> {
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

pub fn object_method_wrapped(input: &[u8]) -> Vec<u8> {
    match deserialize_object_method_args(input) {
        Ok(args) => {
            let result = object_method(InputObjectMethod {
                object: args.object,
                opt_object: args.opt_object,
                object_array: args.object_array,
                opt_object_array: args.opt_object_array,
            });
            serialize_object_method_result(&result).unwrap()
        }
        Err(e) => {
            panic!("{}", e.to_string())
        }
    }
}

pub fn optional_env_method_wrapped(input: &[u8]) -> Vec<u8> {
    match deserialize_optional_env_method_args(input) {
        Ok(args) => {
            let result = optional_env_method(InputOptionalEnvMethod {
                object: args.object,
                opt_object: args.opt_object,
                object_array: args.object_array,
                opt_object_array: args.opt_object_array,
            });
            serialize_optional_env_method_result(&result).unwrap()
        }
        Err(e) => {
            panic!("{}", e.to_string())
        }
    }
}
