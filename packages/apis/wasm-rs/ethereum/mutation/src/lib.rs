//! Mutation module of the Ethereum polywrapper

pub mod w3;
pub use w3::*;

pub async fn call_contract_method(input: InputCallContractMethod) -> TxResponse {
    todo!()
}

pub async fn call_contract_method_and_wait(input: InputCallContractMethodAndWait) -> TxResponse {
    todo!()
}

pub async fn send_transaction(input: InputSendTransaction) -> TxResponse {
    todo!()
}

pub async fn send_transaction_and_wait(input: InputSendTransactionAndWait) -> TxReceipt {
    todo!()
}

pub async fn deploy_contract(input: InputDeployContract) -> String {
    todo!()
}

pub async fn sign_message(input: InputSignMessage) -> String {
    todo!()
}

pub async fn send_rpc(input: InputSendRpc) -> String {
    todo!()
}
