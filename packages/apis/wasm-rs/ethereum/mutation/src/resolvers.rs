//! This module executes all async operations (returning types that implement the `Future` trait) for the `Mutation` module,
//! allowing their non-async (or synchronous) counterparts (in `/mutation/src/lib.rs`) to return the desired types.

use crate::w3::*;
use async_trait::async_trait;
use ethers::{
    contract::{Contract, ContractFactory},
    core::{
        abi::Abi,
        types::{Address, TransactionReceipt, H256},
    },
    middleware::SignerMiddleware,
    providers::{FromErr, Http, Middleware, Provider},
    signers::{LocalWallet, Signer},
};
use polywrap_wasm_rs::JSON;
use query;
use std::convert::TryFrom;
use thiserror::Error;

#[derive(Debug)]
pub struct MutationMiddleware<M>(M);

#[derive(Error, Debug)]
pub enum MutationMiddlewareError<M: Middleware> {
    #[error("{0}")]
    MiddlewareError(M::Error),
}

impl<M: Middleware> FromErr<M::Error> for MutationMiddlewareError<M> {
    fn from(src: M::Error) -> MutationMiddlewareError<M> {
        MutationMiddlewareError::MiddlewareError(src)
    }
}

#[async_trait]
impl<M> Middleware for MutationMiddleware<M>
where
    M: Middleware,
{
    type Error = MutationMiddlewareError<M>;
    type Provider = M::Provider;
    type Inner = M;

    fn inner(&self) -> &M {
        &self.0
    }
}

impl<M> MutationMiddleware<M>
where
    M: Middleware,
{
    pub async fn resolve_call_contract_method(
        input: InputCallContractMethod,
    ) -> TransactionReceipt {
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
}
