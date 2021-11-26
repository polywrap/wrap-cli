use crate::{Access, TxResponse};
use ethers_core::abi::ethereum_types::{Address, H256};
use ethers_core::types::transaction::eip2930::AccessListItem;
use ethers_core::types::transaction::response::Transaction as TransactionResponse;
use polywrap_wasm_rs::BigInt;

pub fn to_tx_response(response: TransactionResponse) -> TxResponse {
    TxResponse {
        hash: todo!(),
        nonce: todo!(),
        block_hash: todo!(),
        block_number: todo!(),
        transaction_index: todo!(),
        from: todo!(),
        to: todo!(),
        value: todo!(),
        gas_price: todo!(),
        gas: todo!(),
        input: todo!(),
        v: todo!(),
        r: todo!(),
        s: todo!(),
        transaction_type: todo!(),
        access_list: todo!(),
        max_priority_fee_per_gas: todo!(),
        max_fee_per_gas: todo!(),
        chain_id: todo!(),
    }
}

pub fn to_access(access_list_item: AccessListItem) -> Access {
    Access {
        address: access_list_item.address.to_string(),
        storage_keys: access_list_item
            .storage_keys
            .into_iter()
            .map(|inner| inner.to_string())
            .collect(),
    }
}

pub fn from_access(access: Access) -> AccessListItem {
    AccessListItem {
        address: Address::from_slice(access.address.as_bytes()),
        storage_keys: access
            .storage_keys
            .into_iter()
            .map(|inner| H256::from_slice(inner.as_bytes()))
            .collect(),
    }
}

#[inline]
fn get_access_list(response: TransactionResponse) -> Option<Vec<Access>> {
    match response.access_list {
        None => None,
        Some(list) => {
            let mut access_list: Vec<Access> = vec![];
            for entry in list.0 {
                access_list.push(Access {
                    address: entry.address.to_string(),
                    storage_keys: entry
                        .storage_keys
                        .into_iter()
                        .map(|inner| String::from_utf8(inner.as_bytes().to_vec()).unwrap())
                        .collect(),
                });
            }
            Some(access_list)
        }
    }
}
