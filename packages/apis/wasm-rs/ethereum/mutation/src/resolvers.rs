//! This module executes all async operations (returning types that implement the `Future` trait) for the `Mutation` module,
//! allowing their non-async (or synchronous) counterparts (in `/mutation/src/lib.rs`) to return the desired types.

use crate::w3::*;
use ethers::{
    contract::{Contract, ContractFactory},
    core::{
        abi::Abi,
        types::{Address, TransactionReceipt, H256},
    },
    middleware::SignerMiddleware,
    providers::{Http, Middleware, Provider},
    signers::{LocalWallet, Signer},
};
use polywrap_wasm_rs::JSON;
use query;
use std::convert::TryFrom;

pub async fn resolve_call_contract_method(input: InputCallContractMethod) -> TransactionReceipt {
    todo!()
}

pub async fn resolve_call_contract_method_and_wait(
    input: InputCallContractMethodAndWait,
) -> TransactionReceipt {
    todo!()
}

pub async fn resolve_send_transaction(input: InputSendTransaction) -> TransactionReceipt {
    todo!()
}

pub async fn resolve_send_transaction_and_wait(
    input: InputSendTransactionAndWait,
) -> TransactionReceipt {
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

// fn example(input: InputSendTransaction) -> TransactionReceipt {
//     tokio::runtime::Builder::new_current_thread()
//         .build()
//         .unwrap()
//         .block_on(resolve_send_transaction(input))
// }

// fn use_example(input: InputSendTransaction) -> TransactionReceipt {
//     example(input)
// }
