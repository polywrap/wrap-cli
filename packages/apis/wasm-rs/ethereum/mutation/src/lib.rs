//! Mutation module of the Ethereum polywrapper

pub mod w3;
use query;
pub use w3::*;

pub fn call_contract_method(input: InputCallContractMethod) -> TxResponse {
    todo!()
}

pub fn call_contract_method_and_wait(input: InputCallContractMethodAndWait) -> query::TxReceipt {
    todo!()
}

pub fn send_transaction(input: InputSendTransaction) -> TxResponse {
    todo!()
}

pub fn send_transaction_and_wait(input: InputSendTransactionAndWait) -> TxReceipt {
    todo!()
}

pub fn deploy_contract(input: InputDeployContract) -> String {
    todo!()
}

pub fn sign_message(input: InputSignMessage) -> String {
    todo!()
}

pub fn send_rpc(input: InputSendRpc) -> Option<String> {
    todo!()
}
