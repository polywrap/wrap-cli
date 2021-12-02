//! Query module of the Ethereum polywrapper

pub mod connection_info;
pub mod mapping;
pub mod resolvers;
pub mod w3;
pub use mapping::*;
use polywrap_wasm_rs::BigInt;
pub use w3::*;

pub fn call_contract_view(input: InputCallContractView) -> String {
    todo!()
}

pub fn call_contract_static(input: InputCallContractStatic) -> StaticTxResult {
    todo!()
}

pub fn encode_params(input: InputEncodeParams) -> String {
    todo!()
}

pub fn encode_function(input: InputEncodeFunction) -> String {
    todo!()
}

pub fn get_signer_address(input: InputGetSignerAddress) -> String {
    todo!()
}

pub fn get_signer_balance(input: InputGetSignerBalance) -> BigInt {
    todo!()
}

pub fn get_signer_transaction_count(input: InputGetSignerTransactionCount) -> BigInt {
    todo!()
}

pub fn get_gas_price(input: InputGetGasPrice) -> BigInt {
    todo!()
}

pub fn estimate_transaction_gas(input: InputEstimateTransactionGas) -> BigInt {
    todo!()
}

pub fn estimate_contract_call_gas(input: InputEstimateContractCallGas) -> BigInt {
    todo!()
}

pub fn check_address(input: InputCheckAddress) -> bool {
    todo!()
}

pub fn to_wei(input: InputToWei) -> BigInt {
    todo!()
}

pub fn to_eth(input: InputToEth) -> String {
    todo!()
}

pub fn wait_for_event(input: InputWaitForEvent) -> EventNotification {
    todo!()
}

pub fn await_transaction(input: InputAwaitTransaction) -> TxReceipt {
    todo!()
}

pub fn get_network(input: InputGetNetwork) -> Network {
    todo!()
}
