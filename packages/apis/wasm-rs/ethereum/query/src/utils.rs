use crate::{Log, TxReceipt, TxRequest};
use ethers_core::abi::ethereum_types::{Address, H256, U256, U64};
use ethers_core::types::{
    transaction::{
        request::TransactionRequest,
        response::TransactionReceipt,
    },
    Bloom, Bytes,
};
use num_traits::ToPrimitive;
use polywrap_wasm_rs::BigInt;

pub fn to_tx_receipt(receipt: TransactionReceipt) -> TxReceipt {
    TxReceipt {
        transaction_hash: todo!(),
        transaction_index: todo!(),
        block_hash: todo!(),
        block_number: todo!(),
        cumulative_gas_used: todo!(),
        gas_used: todo!(),
        contract_address: todo!(),
        logs: todo!(),
        status: todo!(),
        root: todo!(),
        logs_bloom: todo!(),
        transaction_type: todo!(),
        effective_gas_price: todo!(),
    }
}

pub fn from_tx_receipt(receipt: TxReceipt) -> TransactionReceipt {
    TransactionReceipt {
        transaction_hash: todo!(),
        transaction_index: todo!(),
        block_hash: todo!(),
        block_number: todo!(),
        cumulative_gas_used: todo!(),
        gas_used: todo!(),
        contract_address: todo!(),
        logs: todo!(),
        status: todo!(),
        root: todo!(),
        logs_bloom: todo!(),
        transaction_type: todo!(),
        effective_gas_price: todo!(),
    }
}

pub fn to_tx_request(request: TransactionRequest) -> TxRequest {
    TxRequest {
        from: todo!(),
        to: todo!(),
        gas: todo!(),
        gas_price: todo!(),
        value: todo!(),
        data: todo!(),
        nonce: todo!(),
    }
}

pub fn from_tx_request(request: TxRequest) -> TransactionRequest {
    TransactionRequest {
        from: todo!(),
        to: todo!(),
        gas: todo!(),
        gas_price: todo!(),
        value: todo!(),
        data: todo!(),
        nonce: todo!(),
    }
}

pub fn to_log(log: ethers_core::types::Log) -> Log {
    Log {
        address: todo!(),
        topics: todo!(),
        data: todo!(),
        block_hash: todo!(),
        block_number: todo!(),
        transaction_hash: todo!(),
        transaction_index: todo!(),
        log_index: todo!(),
        transaction_log_index: todo!(),
        log_type: todo!(),
        removed: todo!(),
    }
}

pub fn from_log(log: Log) -> ethers_core::types::Log {
    ethers_core::types::Log {
        address: todo!(),
        topics: todo!(),
        data: todo!(),
        block_hash: todo!(),
        block_number: todo!(),
        transaction_hash: todo!(),
        transaction_index: todo!(),
        log_index: todo!(),
        transaction_log_index: todo!(),
        log_type: todo!(),
        removed: todo!(),
    }
}

//==================== HELPERS ================================

#[inline]
fn get_polywrapper_logs(receipt: TransactionReceipt) -> Vec<Log> {
    let mut logs: Vec<Log> = vec![];
    for log in receipt.logs {
        logs.push(Log {
            address: todo!(),
            topics: todo!(),
            data: todo!(),
            block_hash: todo!(),
            block_number: todo!(),
            transaction_hash: todo!(),
            transaction_index: todo!(),
            log_index: todo!(),
            transaction_log_index: todo!(),
            log_type: todo!(),
            removed: todo!(),
        });
    }
    logs
}

#[inline]
fn get_ethers_core_logs(receipt: TxReceipt) -> Vec<ethers_core::types::Log> {
    let mut logs: Vec<ethers_core::types::Log> = vec![];
    for log in receipt.logs {
        logs.push(ethers_core::types::Log {
            address: todo!(),
            topics: todo!(),
            data: todo!(),
            block_hash: todo!(),
            block_number: todo!(),
            transaction_hash: todo!(),
            transaction_index: todo!(),
            log_index: todo!(),
            transaction_log_index: todo!(),
            log_type: todo!(),
            removed: todo!(),
        });
    }
    logs
}
