use crate::{Log, TxReceipt};
use ethers_core::types::transaction::response::TransactionReceipt;
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
        logs: get_log(receipt.clone()),
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

fn get_log(receipt: TransactionReceipt) -> Vec<Log> {
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
