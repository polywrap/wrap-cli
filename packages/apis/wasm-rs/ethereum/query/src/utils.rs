use crate::{Log, TxReceipt, TxRequest};
use ethers_core::abi::ethereum_types::{Address, H256, U256, U64};
use ethers_core::types::{
    transaction::response::{Transaction as TransactionRequest, TransactionReceipt},
    Bloom, Bytes,
};
use num_traits::ToPrimitive;
use polywrap_wasm_rs::BigInt;

pub fn to_tx_receipt(receipt: TransactionReceipt) -> TxReceipt {
    TxReceipt {
        to: "Some Address".to_string(),   // TODO: remove this field?
        from: "Some Address".to_string(), // TODO: remove this field?
        contract_address: receipt.contract_address.unwrap().to_string(),
        transaction_index: receipt.transaction_index.as_u32(),
        root: receipt.root.map(|root| root.to_string()),
        gas_used: BigInt::try_from(receipt.gas_used.unwrap().as_u64()).unwrap(),
        logs_bloom: receipt.logs_bloom.to_string(),
        transaction_hash: receipt.transaction_hash.to_string(),
        logs: get_polywrapper_logs(receipt.clone()),
        block_number: BigInt::try_from(receipt.block_number.unwrap().as_u64()).unwrap(),
        block_hash: receipt.block_hash.unwrap().to_string(),
        confirmations: 0, // TODO: remove this field?
        cumulative_gas_used: BigInt::try_from(receipt.cumulative_gas_used.as_u64()).unwrap(),
        effective_gas_price: BigInt::try_from(receipt.effective_gas_price.unwrap().as_u64())
            .unwrap(),
        byzantium: false, // TODO: remove this field?
        m_type: receipt.transaction_type.unwrap().as_u32(),
        status: receipt.status.map(|num| num.as_u32()),
    }
}

pub fn from_tx_receipt(receipt: TxReceipt) -> TransactionReceipt {
    TransactionReceipt {
        transaction_hash: H256::from_slice(receipt.transaction_hash.as_bytes()),
        transaction_index: U64::try_from(receipt.transaction_index as u64).unwrap(),
        block_hash: Some(H256::from_slice(receipt.block_hash.as_bytes())),
        block_number: Some(U64::try_from(receipt.block_number.to_u64().unwrap()).unwrap()),
        cumulative_gas_used: U256::try_from(receipt.cumulative_gas_used.to_u64().unwrap()).unwrap(),
        gas_used: Some(U256::try_from(receipt.gas_used.to_u64().unwrap()).unwrap()),
        contract_address: Some(Address::from_slice(receipt.contract_address.as_bytes())),
        logs: get_ethers_core_logs(receipt.clone()),
        status: receipt.status.map(|inner| U64::try_from(inner).unwrap()),
        root: receipt.root.map(|inner| H256::from_slice(inner.as_bytes())),
        logs_bloom: Bloom::from_slice(receipt.logs_bloom.as_bytes()),
        transaction_type: Some(U64::try_from(receipt.m_type as u64).unwrap()),
        effective_gas_price: Some(
            U256::try_from(receipt.effective_gas_price.to_u64().unwrap()).unwrap(),
        ),
    }
}

pub fn to_tx_request(request: TransactionRequest) -> TxRequest {
    TxRequest {
        to: request.to.map(|inner| inner.to_string()),
        from: Some(request.from.to_string()),
        nonce: Some(request.nonce.as_u32()),
        gas_limit: request
            .max_fee_per_gas
            .map(|inner| BigInt::try_from(inner.as_u64()).unwrap()),
        gas_price: request
            .gas_price
            .map(|inner| BigInt::try_from(inner.as_u64()).unwrap()),
        data: Some(String::from_utf8(request.input.0.to_vec()).unwrap()),
        value: Some(BigInt::try_from(request.value.as_u64()).unwrap()),
        chain_id: request.chain_id.map(|inner| inner.as_u32()),
        m_type: request.transaction_type.map(|inner| inner.as_u32()),
    }
}

pub fn from_tx_request(request: TxRequest) -> TransactionRequest {
    TransactionRequest {
        hash: H256::default(),
        nonce: U256::try_from(request.nonce.unwrap()).unwrap(),
        block_hash: None,
        block_number: None,
        transaction_index: None,
        from: Address::from_slice(request.from.unwrap().as_bytes()),
        to: request
            .to
            .map(|inner| Address::from_slice(inner.as_bytes())),
        value: U256::try_from(request.value.unwrap().to_u64().unwrap()).unwrap(),
        gas_price: request
            .gas_price
            .map(|inner| U256::try_from(inner.to_u64().unwrap()).unwrap()),
        gas: U256::default(),
        input: Bytes::try_from(request.data.unwrap().as_bytes().to_vec()).unwrap(),
        v: U64::default(),
        r: U256::default(),
        s: U256::default(),
        transaction_type: request.m_type.map(|inner| U64::try_from(inner).unwrap()),
        access_list: None,
        max_priority_fee_per_gas: None,
        max_fee_per_gas: request
            .gas_limit
            .map(|inner| U256::try_from(inner.to_u64().unwrap()).unwrap()),
        chain_id: request.chain_id.map(|inner| U256::try_from(inner).unwrap()),
    }
}

pub fn to_log(log: ethers_core::types::Log) -> Log {
    Log {
        block_number: BigInt::try_from(log.block_number.unwrap().as_u64()).unwrap(),
        block_hash: log.block_hash.unwrap().to_string(),
        transaction_index: log.transaction_index.unwrap().as_u32(),
        removed: log.removed.unwrap(),
        address: String::from_utf8(log.address.as_bytes().to_vec()).unwrap(),
        data: String::from_utf8(log.data.to_vec()).unwrap(),
        topics: log
            .topics
            .into_iter()
            .map(|inner| inner.to_string())
            .collect(),
        transaction_hash: log.transaction_hash.unwrap().to_string(),
        log_index: log.log_index.unwrap().as_u32(),
    }
}

pub fn from_log(log: Log) -> ethers_core::types::Log {
    ethers_core::types::Log {
        address: Address::from_slice(log.address.as_bytes()),
        topics: log
            .topics
            .into_iter()
            .map(|inner| H256::from_slice(inner.as_bytes()))
            .collect(),
        data: Bytes::try_from(log.data.as_bytes().to_vec()).unwrap(),
        block_hash: Some(H256::from_slice(log.block_hash.as_bytes())),
        block_number: Some(U64::try_from(log.block_number.to_u64().unwrap()).unwrap()),
        transaction_hash: Some(H256::from_slice(log.transaction_hash.as_bytes())),
        transaction_index: Some(U64::try_from(log.transaction_index).unwrap()),
        log_index: Some(U256::try_from(log.log_index).unwrap()),
        transaction_log_index: None,
        log_type: None,
        removed: Some(log.removed),
    }
}

//==================== HELPERS ================================

#[inline]
fn get_polywrapper_logs(receipt: TransactionReceipt) -> Vec<Log> {
    let mut logs: Vec<Log> = vec![];
    for log in receipt.logs {
        logs.push(Log {
            block_number: BigInt::try_from(log.block_number.unwrap().as_u64()).unwrap(),
            block_hash: log.block_hash.unwrap().to_string(),
            transaction_index: log.transaction_index.unwrap().as_u32(),
            removed: log.removed.unwrap(),
            address: log.address.to_string(),
            data: String::from_utf8(log.data.0.to_vec()).unwrap(),
            topics: log
                .topics
                .into_iter()
                .map(|inner| String::from_utf8(inner.0.to_vec()).unwrap())
                .collect(),
            transaction_hash: String::from_utf8(log.transaction_hash.unwrap().0.to_vec()).unwrap(),
            log_index: log.log_index.unwrap().as_u32(),
        });
    }
    logs
}

#[inline]
fn get_ethers_core_logs(receipt: TxReceipt) -> Vec<ethers_core::types::Log> {
    let mut logs: Vec<ethers_core::types::Log> = vec![];
    for log in receipt.logs {
        logs.push(ethers_core::types::Log {
            address: Address::from_slice(log.address.as_bytes()),
            topics: log
                .topics
                .into_iter()
                .map(|inner| H256::from_slice(inner.as_bytes()))
                .collect(),
            data: Bytes::try_from(log.data.as_bytes().to_vec()).unwrap(),
            block_hash: Some(H256::from_slice(log.block_hash.as_bytes())),
            block_number: Some(U64::try_from(BigInt::to_u64(&log.block_number).unwrap()).unwrap()),
            transaction_hash: Some(H256::from_slice(log.transaction_hash.as_bytes())),
            transaction_index: Some(U64::try_from(log.transaction_index).unwrap()),
            log_index: Some(U256::try_from(log.log_index).unwrap()),
            transaction_log_index: None,
            log_type: None,
            removed: Some(log.removed),
        });
    }
    logs
}
