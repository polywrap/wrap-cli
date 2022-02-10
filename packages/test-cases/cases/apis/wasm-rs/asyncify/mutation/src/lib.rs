pub mod w3;
use polywrap_wasm_rs::JSON;
pub use query::{self, imported::ethereum_query};
pub use w3::imported::ethereum_mutation;
pub use w3::mutation;
pub use w3::*;

pub fn set_data_with_large_args(input: mutation::InputSetDataWithLargeArgs) -> String {
    let large_string = input.value;
    match EthereumMutation::call_contract_method(&ethereum_mutation::InputCallContractMethod {
        address: input.address,
        method: "function set(uint256 value)".to_string(),
        args: Some(vec!["66".to_string()]),
        connection: input.connection,
        tx_overrides: None,
    }) {
        Ok(_v) => large_string,
        Err(e) => panic!("{}", e),
    }
}

pub fn set_data_with_many_args(input: mutation::InputSetDataWithManyArgs) -> String {
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
        input.value_a,
        input.value_b,
        input.value_c,
        input.value_d,
        input.value_e,
        input.value_f,
        input.value_g,
        input.value_h,
        input.value_i,
        input.value_j,
        input.value_k,
        input.value_l,
    );
    match EthereumMutation::call_contract_method(&ethereum_mutation::InputCallContractMethod {
        address: input.address,
        method: "function set(uint256 value)".to_string(),
        args: Some(vec!["55".to_string()]),
        connection: input.connection,
        tx_overrides: None,
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
    input: mutation::InputSetDataWithManyStructuredArgs,
) -> bool {
    match EthereumMutation::call_contract_method(&ethereum_mutation::InputCallContractMethod {
        address: input.address,
        method: "function set(uint256 value)".to_string(),
        args: Some(vec!["44".to_string()]),
        connection: input.connection,
        tx_overrides: None,
    }) {
        Ok(_v) => return_true(),
        Err(_e) => false,
    }
}

pub fn deploy_contract(input: mutation::InputDeployContract) -> String {
    let abi = JSON::json!([{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"}],"name":"DataSet","type":"event"},{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}]).to_string();
    let bytecode = "0x608060405234801561001057600080fd5b5061012a806100206000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b606860eb565b6040518082815260200191505060405180910390f35b806000819055507f3d38713ec8fb49acced894a52df2f06a371a15960550da9ba0f017cb7d07a8ec33604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a150565b6000805490509056fea2646970667358221220f312fe8d32f77c74cc4eb4a1f5c805d8bb124755ca4e8a1db2cce10cbb133dc564736f6c63430006060033".to_string();

    match EthereumMutation::deploy_contract(&ethereum_mutation::InputDeployContract {
        abi,
        bytecode,
        args: None,
        connection: input.connection,
    }) {
        Ok(v) => v,
        Err(e) => panic!("{}", e),
    }
}

pub fn local_var_method(input: mutation::InputLocalVarMethod) -> bool {
    match EthereumMutation::call_contract_method(&ethereum_mutation::InputCallContractMethod {
        address: input.address,
        method: "function set(uint256 value)".to_string(),
        args: Some(vec!["88".to_string()]),
        connection: input.connection,
        tx_overrides: None,
    }) {
        Ok(_v) => true,
        Err(_e) => false,
    }
}

pub fn global_var_method(input: mutation::InputGlobalVarMethod) -> bool {
    match EthereumMutation::call_contract_method(&ethereum_mutation::InputCallContractMethod {
        address: input.address,
        method: "function set(uint256 value)".to_string(),
        args: Some(vec!["77".to_string()]),
        connection: input.connection,
        tx_overrides: None,
    }) {
        Ok(_v) => true,
        Err(_e) => false,
    }
}

pub fn subsequent_invokes(input: mutation::InputSubsequentInvokes) -> Vec<String> {
    let mut result: Vec<String> = vec![];

    for i in 0..input.number_of_times as usize {
        match EthereumMutation::call_contract_method(&ethereum_mutation::InputCallContractMethod {
            address: input.address.clone(),
            method: "function set(uint256 value)".to_string(),
            args: Some(vec![i.to_string()]),
            connection: input.connection.clone(),
            tx_overrides: None,
        }) {
            Ok(_v) => {
                match EthereumQuery::call_contract_view(&ethereum_query::InputCallContractView {
                    address: input.address.clone(),
                    method: "function get() view returns (uint256)".to_string(),
                    args: None,
                    connection: input.connection.clone(),
                }) {
                    Ok(v) => result[i] = v,
                    Err(e) => panic!("{}", e),
                }
            }
            Err(e) => panic!("{}", e),
        }
    }
    result
}

pub fn return_true() -> bool {
    query::return_true()
}
