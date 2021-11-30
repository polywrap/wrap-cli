//! This module executes all async operations (returning types that implement the `Future` trait) for the `Query` module,
//! allowing their non-async (or synchronous) counterparts (in `/query/src/lib.rs`) to return the desired types.

use crate::w3::*;
use polywrap_wasm_rs::BigInt;

pub async fn resolve_call_contract_view(input: InputCallContractView) -> String {
    todo!()
}

pub async fn resolve_call_contract_static(input: InputCallContractStatic) -> StaticTxResult {
    todo!()
}

pub async fn resolve_encode_params(input: InputEncodeParams) -> String {
    todo!()
}

pub async fn resolve_encode_function(input: InputEncodeFunction) -> String {
    todo!()
}

pub async fn resolve_get_signer_address(input: InputGetSignerAddress) -> String {
    todo!()
}

pub async fn resolve_get_signer_balance(input: InputGetSignerBalance) -> BigInt {
    todo!()
}

pub async fn resolve_get_signer_transaction_count(input: InputGetSignerTransactionCount) -> BigInt {
    todo!()
}

pub async fn resolve_get_gas_price(input: InputGetGasPrice) -> BigInt {
    todo!()
}

pub async fn resolve_estimate_transaction_gas(input: InputEstimateTransactionGas) -> BigInt {
    todo!()
}

pub async fn resolve_estimate_contract_call_gas(input: InputEstimateContractCallGas) -> BigInt {
    todo!()
}

pub async fn resolve_check_address(input: InputCheckAddress) -> bool {
    todo!()
}

pub async fn resolve_to_wei(input: InputToWei) -> BigInt {
    todo!()
}

pub async fn resolve_to_eth(input: InputToEth) -> String {
    todo!()
}

pub async fn resolve_wait_for_event(input: InputWaitForEvent) -> EventNotification {
    todo!()
}

pub async fn resolve_await_transaction(input: InputAwaitTransaction) -> TxReceipt {
    todo!()
}
