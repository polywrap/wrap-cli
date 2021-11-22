//! Query module of the Ethereum polywrapper

pub mod w3;
pub use w3::*;

pub async fn call_contract_view(input: InputCallContractView) -> String {
    todo!()
}

pub async fn call_contract_static(input: InputCallContractStatic) -> StaticTxResult {
    todo!()
}

pub async fn encode_params(input: InputEncodeParams) -> String {
    todo!()
}

pub async fn encode_function(input: InputEncodeFunction) -> String {
    todo!()
}

pub async fn get_signer_address(input: InputGetSignerAddress) -> String {
    todo!()
}

pub async fn get_signer_balance(input: InputGetSignerBalance) -> String {
    todo!()
}

pub async fn get_signer_transaction_count(input: InputGetSignerTransactionCount) -> String {
    todo!()
}

pub async fn get_gas_price(input: InputGetGasPrice) -> String {
    todo!()
}

pub async fn estimate_transaction_gas(input: InputEstimateTransactionGas) -> String {
    todo!()
}

pub async fn estimate_contract_call_gas(input: InputEstimateContractCallGas) -> String {
    todo!()
}

pub async fn check_address(input: InputCheckAddress) -> bool {
    todo!()
}

pub async fn to_wei(input: InputToWei) -> String {
    todo!()
}

pub async fn to_eth(input: InputToEth) -> String {
    todo!()
}

pub async fn wait_for_event(input: InputWaitForEvent) -> EventNotification {
    todo!()
}

pub async fn await_transaction(input: InputAwaitTransaction) -> TxReceipt {
    todo!()
}
