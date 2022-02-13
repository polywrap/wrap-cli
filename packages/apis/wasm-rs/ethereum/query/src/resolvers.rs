//! This module executes all async operations (returning types that implement the `Future` trait) for the `Query` module,
//! allowing their non-async (or synchronous) counterparts (in `/query/src/lib.rs`) to return the desired types.

use crate::w3::*;
use async_trait::async_trait;
use ethers::providers::{FromErr, Middleware};
use polywrap_wasm_rs::BigInt;
use thiserror::Error;

#[derive(Debug)]
pub struct QueryMiddleware<M>(M);

#[derive(Error, Debug)]
pub enum QueryMiddlewareError<M: Middleware> {
    #[error("{0}")]
    MiddlewareError(M::Error),
}

impl<M: Middleware> FromErr<M::Error> for QueryMiddlewareError<M> {
    fn from(src: M::Error) -> QueryMiddlewareError<M> {
        QueryMiddlewareError::MiddlewareError(src)
    }
}

#[async_trait]
impl<M> Middleware for QueryMiddleware<M>
where
    M: Middleware,
{
    type Error = QueryMiddlewareError<M>;
    type Provider = M::Provider;
    type Inner = M;

    fn inner(&self) -> &M {
        &self.0
    }
}

impl<M> QueryMiddleware<M>
where
    M: Middleware,
{
    pub async fn resolve_call_contract_view(&self, input: InputCallContractView) -> String {
        todo!()
    }

    pub async fn resolve_call_contract_static(
        &self,
        input: InputCallContractStatic,
    ) -> StaticTxResult {
        todo!()
    }

    pub async fn resolve_encode_params(&self, input: InputEncodeParams) -> String {
        todo!()
    }

    pub async fn resolve_encode_function(&self, input: InputEncodeFunction) -> String {
        todo!()
    }

    pub async fn resolve_get_signer_address(&self, input: InputGetSignerAddress) -> String {
        todo!()
    }

    pub async fn resolve_get_signer_balance(&self, input: InputGetSignerBalance) -> BigInt {
        todo!()
    }

    pub async fn resolve_get_signer_transaction_count(
        &self,
        input: InputGetSignerTransactionCount,
    ) -> BigInt {
        todo!()
    }

    pub async fn resolve_get_gas_price(&self, input: InputGetGasPrice) -> BigInt {
        todo!()
    }

    pub async fn resolve_estimate_transaction_gas(
        &self,
        input: InputEstimateTransactionGas,
    ) -> BigInt {
        todo!()
    }

    pub async fn resolve_estimate_contract_call_gas(
        &self,
        input: InputEstimateContractCallGas,
    ) -> BigInt {
        todo!()
    }

    pub async fn resolve_check_address(&self, input: InputCheckAddress) -> bool {
        todo!()
    }

    pub async fn resolve_to_wei(&self, input: InputToWei) -> BigInt {
        todo!()
    }

    pub async fn resolve_to_eth(&self, input: InputToEth) -> String {
        todo!()
    }

    pub async fn resolve_wait_for_event(&self, input: InputWaitForEvent) -> EventNotification {
        todo!()
    }

    pub async fn resolve_await_transaction(&self, input: InputAwaitTransaction) -> TxReceipt {
        todo!()
    }

    pub async fn resolve_get_network(&self, input: InputGetNetwork) -> Network {
        todo!()
    }

    // Utils

    pub async fn utils_hashMessage(&self, input: InputUtilsHashMessage) -> String {
        hash_message(input.message).to_string()
    }
}
