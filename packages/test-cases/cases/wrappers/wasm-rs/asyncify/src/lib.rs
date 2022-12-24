pub mod wrap;
use polywrap_wasm_rs::JSON;
use wrap::imported::storage_module;
use wrap::module;
use wrap::module::{IModule, Module};
pub use wrap::*;

impl IModule for Module {
    fn get_data(&self, args: module::ArgsGetData) -> Result<u32, String> {
        match StorageModule::get_data(&storage_module::ArgsGetData {}) {
            Ok(v) => Ok(v as u32),
            Err(e) => Err(e),
        }
    }

    fn set_data_with_large_args(
        &self,
        args: module::ArgsSetDataWithLargeArgs,
    ) -> Result<String, String> {
        let large_string = args.value;
        match StorageModule::set_data(&storage_module::ArgsSetData { value: 66 }) {
            Ok(_v) => Ok(large_string),
            Err(e) => Err(e),
        }
    }

    fn set_data_with_many_args(
        &self,
        args: module::ArgsSetDataWithManyArgs,
    ) -> Result<String, String> {
        let (
            args_a,
            args_b,
            args_c,
            args_d,
            args_e,
            args_f,
            args_g,
            args_h,
            args_i,
            args_j,
            args_k,
            args_l,
        ) = (
            args.value_a,
            args.value_b,
            args.value_c,
            args.value_d,
            args.value_e,
            args.value_f,
            args.value_g,
            args.value_h,
            args.value_i,
            args.value_j,
            args.value_k,
            args.value_l,
        );
        match StorageModule::set_data(&storage_module::ArgsSetData { value: 55 }) {
            Ok(_v) => Ok([
                args_a, args_b, args_c, args_d, args_e, args_f, args_g, args_h, args_i, args_j,
                args_k, args_l,
            ]
            .concat()),
            Err(e) => Err(e),
        }
    }

    fn set_data_with_many_structured_args(
        &self,
        args: module::ArgsSetDataWithManyStructuredArgs,
    ) -> Result<bool, String> {
        match StorageModule::set_data(&storage_module::ArgsSetData { value: 44 }) {
            Ok(_v) => Ok(true),
            Err(_e) => Ok(false),
        }
    }

    fn local_var_method(&self, args: module::ArgsLocalVarMethod) -> Result<bool, String> {
        match StorageModule::set_data(&storage_module::ArgsSetData { value: 88 }) {
            Ok(_v) => Ok(true),
            Err(_e) => Ok(false),
        }
    }

    fn global_var_method(&self, args: module::ArgsGlobalVarMethod) -> Result<bool, String> {
        match StorageModule::set_data(&storage_module::ArgsSetData { value: 77 }) {
            Ok(_v) => Ok(true),
            Err(_e) => Ok(false),
        }
    }

    fn subsequent_invokes(
        &self,
        args: module::ArgsSubsequentInvokes,
    ) -> Result<Vec<String>, String> {
        let mut result: Vec<String> = vec![];
        let mut err: Option<String> = None;

        for i in 0..args.number_of_times {
            match StorageModule::set_data(&storage_module::ArgsSetData { value: i }) {
                Ok(_v) => match StorageModule::get_data(&storage_module::ArgsGetData {}) {
                    Ok(v) => result.push(v.to_string()),
                    Err(e) => err = Some(e),
                },
                Err(e) => err = Some(e),
            }
        }
        match err {
            Some(e) => Err(e),
            None => Ok(result)
        }
    }
}
