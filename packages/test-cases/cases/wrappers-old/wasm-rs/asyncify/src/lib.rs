pub mod wrap;
pub use wrap::*;
use polywrap_wasm_rs::JSON;
use wrap::imported::storage_module;
use wrap::module;

pub fn get_data(args: module::ArgsGetData) -> u32 {
    match StorageModule::get_data(
        &storage_module::ArgsGetData {},
    ) {
        Ok(v) => v.try_into().unwrap(),
        Err(e) => panic!("{}", e),
    }
}

pub fn return_true() -> bool {
    true
}

pub fn set_data_with_large_args(args: module::ArgsSetDataWithLargeArgs) -> String {
    let large_string = args.value;
    match StorageModule::set_data(&storage_module::ArgsSetData {
        value: 66
    }) {
        Ok(_v) => large_string,
        Err(e) => panic!("{}", e),
    }
}

pub fn set_data_with_many_args(args: module::ArgsSetDataWithManyArgs) -> String {
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
    match StorageModule::set_data(&storage_module::ArgsSetData {
        value: 55
    }) {
        Ok(_v) => [
            args_a, args_b, args_c, args_d, args_e, args_f, args_g, args_h, args_i, args_j, args_k,
            args_l,
        ]
        .concat(),
        Err(e) => panic!("{}", e),
    }
}

pub fn set_data_with_many_structured_args(
    args: module::ArgsSetDataWithManyStructuredArgs,
) -> bool {
  match StorageModule::set_data(&storage_module::ArgsSetData {
      value: 44
  }) {
        Ok(_v) => return_true(),
        Err(_e) => false,
    }
}

pub fn local_var_method(args: module::ArgsLocalVarMethod) -> bool {
    match StorageModule::set_data(&storage_module::ArgsSetData {
        value: 88
    }) {
        Ok(_v) => true,
        Err(_e) => false,
    }
}

pub fn global_var_method(args: module::ArgsGlobalVarMethod) -> bool {
    match StorageModule::set_data(&storage_module::ArgsSetData {
        value: 77
    }) {
        Ok(_v) => true,
        Err(_e) => false,
    }
}

pub fn subsequent_invokes(args: module::ArgsSubsequentInvokes) -> Vec<String> {
    let mut result: Vec<String> = vec![];

    for i in 0..args.number_of_times {
        match StorageModule::set_data(&storage_module::ArgsSetData {
            value: i
        }) {
            Ok(_v) => {
              match StorageModule::get_data(
                  &storage_module::ArgsGetData {},
              ) {
                    Ok(v) => result.push(v.to_string()),
                    Err(e) => panic!("{}", e),
                }
            }
            Err(e) => panic!("{}", e),
        }
    }
    result
}
