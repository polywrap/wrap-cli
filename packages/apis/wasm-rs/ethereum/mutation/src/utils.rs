use crate::{Access, TxResponse};
use ethers_core::abi::ethereum_types::{Address, H256};
use ethers_core::types::transaction::eip2930::AccessListItem;
use ethers_core::types::transaction::response::Transaction as TransactionResponse;
use polywrap_wasm_rs::BigInt;

pub fn to_tx_response(response: TransactionResponse) -> TxResponse {
    TxResponse {
        hash: response.hash.to_string(),
        to: response.to.map(|inner| inner.to_string()),
        from: response.from.to_string(),
        nonce: response.nonce.as_u32(),
        gas_limit: BigInt::try_from(response.max_fee_per_gas.unwrap().as_u64()).unwrap(),
        gas_price: response
            .gas_price
            .map(|inner| BigInt::try_from(inner.as_u64()).unwrap()),
        data: String::from_utf8(response.input.to_vec()).unwrap(),
        value: BigInt::try_from(response.value.as_u64()).unwrap(),
        chain_id: response.chain_id.unwrap().as_u32(),
        block_number: response
            .block_number
            .map(|inner| BigInt::try_from(inner.as_u64()).unwrap()),
        block_hash: response.block_hash.map(|inner| inner.to_string()),
        timestamp: None,  // TODO: remove this field?
        confirmations: 0, // TODO: remove this field?
        raw: None,        // TODO: remove this field?
        r: Some(response.r.to_string()),
        s: Some(response.s.to_string()),
        v: Some(response.v.as_u32()),
        m_type: response.transaction_type.map(|inner| inner.as_u32()),
        access_list: get_access_list(response),
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
