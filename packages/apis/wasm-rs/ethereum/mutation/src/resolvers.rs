//! This module executes all async operations (returning types that implement the `Future` trait) for the `Mutation` module,
//! allowing their non-async (or synchronous) counterparts (in `/mutation/src/lib.rs`) to return the desired types.

use crate::w3::*;
use ethers_core::types::TransactionReceipt;
use ethers_middleware::SignerMiddleware;
use ethers_providers::{Http, Middleware, Provider};
use ethers_signers::LocalWallet;
use query;
use std::convert::TryFrom;

pub async fn resolve_call_contract_method(input: InputCallContractMethod) -> TxResponse {
    todo!()
}

pub async fn resolve_call_contract_method_and_wait(
    input: InputCallContractMethodAndWait,
) -> query::TxReceipt {
    todo!()
}

pub async fn resolve_send_transaction(input: InputSendTransaction) -> TransactionReceipt {
    let provider = Provider::<Http>::try_from(input.connection.clone().provider.as_str()).unwrap();
    let signer: LocalWallet = input.connection.signer.as_str().parse().unwrap();
    let client = SignerMiddleware::new(provider, signer);

    let tx_request = query::mapping::from_tx_request(input.tx);
    let future_tx = async {
        let res = client.send_transaction(tx_request, None).await;
        res.unwrap()
    };

    let pending_tx = tokio::runtime::Builder::new_current_thread()
        .build()
        .unwrap()
        .block_on(future_tx);
    pending_tx.await.unwrap().unwrap()
}

pub async fn resolve_send_transaction_and_wait(input: InputSendTransactionAndWait) -> TxReceipt {
    todo!()
}

pub async fn resolve_deploy_contract(input: InputDeployContract) -> String {
    todo!()
}

pub async fn resolve_sign_message(input: InputSignMessage) -> String {
    todo!()
}

pub async fn resolve_send_rpc(input: InputSendRpc) -> Option<String> {
    todo!()
}
