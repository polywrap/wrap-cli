use crate::{Access, TxResponse};
use ethers::core::{
    abi::ethereum_types::{Address, H256},
    types::transaction::{eip2930::AccessListItem, response::Transaction as TransactionResponse},
};
use polywrap_wasm_rs::BigInt;

pub fn to_tx_response(response: TransactionResponse) -> TxResponse {
    TxResponse {
        hash: response.hash.to_string(),
        nonce: response.nonce.as_u32(),
        block_hash: response.block_hash.map(|f| f.to_string()),
        block_number: response
            .block_number
            .map(|f| BigInt::try_from(f.as_u64()).unwrap()),
        transaction_index: response
            .transaction_index
            .map(|f| BigInt::try_from(f.as_u64()).unwrap()),
        from: response.from.to_string(),
        to: response.to.map(|f| f.to_string()),
        value: BigInt::try_from(response.value.as_u64()).unwrap(),
        gas_price: response
            .gas_price
            .map(|f| BigInt::try_from(f.as_u64()).unwrap()),
        gas: BigInt::try_from(response.gas.as_u64()).unwrap(),
        input: String::from_utf8(response.input.0.to_vec()).unwrap(),
        v: response.v.as_u32(),
        r: response.r.to_string(),
        s: response.s.to_string(),
        transaction_type: response.transaction_type.map(|f| f.as_u32()),
        access_list: get_access_list(&response),
        max_priority_fee_per_gas: response
            .max_priority_fee_per_gas
            .map(|f| BigInt::try_from(f.as_u64()).unwrap()),
        max_fee_per_gas: response
            .max_fee_per_gas
            .map(|f| BigInt::try_from(f.as_u64()).unwrap()),
        chain_id: response.chain_id.map(|f| f.as_u32()),
    }
}

pub fn to_access(access_list_item: AccessListItem) -> Access {
    Access {
        address: access_list_item.address.to_string(),
        storage_keys: access_list_item
            .storage_keys
            .into_iter()
            .map(|f| f.to_string())
            .collect(),
    }
}

pub fn from_access(access: Access) -> AccessListItem {
    AccessListItem {
        address: Address::from_slice(access.address.as_bytes()),
        storage_keys: access
            .storage_keys
            .into_iter()
            .map(|f| H256::from_slice(f.as_bytes()))
            .collect(),
    }
}

fn get_access_list(response: &TransactionResponse) -> Option<Vec<Access>> {
    match response.access_list.clone() {
        None => None,
        Some(list) => {
            let mut access_list: Vec<Access> = vec![];
            for entry in list.0 {
                access_list.push(Access {
                    address: entry.address.to_string(),
                    storage_keys: entry
                        .storage_keys
                        .into_iter()
                        .map(|f| String::from_utf8(f.as_bytes().to_vec()).unwrap())
                        .collect(),
                });
            }
            Some(access_list)
        }
    }
}
