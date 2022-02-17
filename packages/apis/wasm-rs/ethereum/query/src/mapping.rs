// use crate::{Log, TxReceipt, TxRequest};
// use ethers::core::{
//     abi::ethereum_types::{Address, H160, H256, U256, U64},
//     types::{
//         transaction::{request::TransactionRequest, response::TransactionReceipt},
//         Bloom, Bytes, Log as EthersLog, NameOrAddress,
//     },
// };
// use num_traits::ToPrimitive;
// use polywrap_wasm_rs::BigInt;
//
// pub fn to_tx_receipt(receipt: TransactionReceipt) -> TxReceipt {
//     TxReceipt {
//         transaction_hash: receipt.transaction_hash.to_string(),
//         transaction_index: receipt.transaction_index.as_u32(),
//         block_hash: receipt.block_hash.map(|f| f.to_string()),
//         block_number: receipt
//             .block_number
//             .map(|f| BigInt::try_from(f.as_u64()).unwrap()),
//         cumulative_gas_used: BigInt::try_from(receipt.cumulative_gas_used.as_u64()).unwrap(),
//         gas_used: receipt
//             .gas_used
//             .map(|f| BigInt::try_from(f.as_u64()).unwrap()),
//         contract_address: receipt.contract_address.map(|f| f.to_string()),
//         logs: get_polywrapper_logs(&receipt),
//         status: receipt.status.map(|f| f.as_u32()),
//         root: receipt.root.map(|f| f.to_string()),
//         logs_bloom: receipt.logs_bloom.to_string(),
//         transaction_type: receipt.transaction_type.map(|f| f.as_u32()),
//         effective_gas_price: receipt
//             .effective_gas_price
//             .map(|f| BigInt::try_from(f.as_u64()).unwrap()),
//     }
// }
//
// pub fn from_tx_receipt(receipt: TxReceipt) -> TransactionReceipt {
//     TransactionReceipt {
//         transaction_hash: H256::from_slice(receipt.transaction_hash.as_bytes()),
//         transaction_index: U64::try_from(receipt.transaction_index).unwrap(),
//         block_hash: receipt
//             .block_hash
//             .as_ref()
//             .map(|f| H256::from_slice(f.as_bytes())),
//         block_number: receipt
//             .block_number
//             .as_ref()
//             .map(|f| U64::try_from(f.to_u64().unwrap()).unwrap()),
//         cumulative_gas_used: U256::try_from(receipt.cumulative_gas_used.to_u128().unwrap())
//             .unwrap(),
//         gas_used: receipt
//             .gas_used
//             .as_ref()
//             .map(|f| U256::try_from(f.to_u128().unwrap()).unwrap()),
//         contract_address: receipt
//             .contract_address
//             .as_ref()
//             .map(|f| H160::from_slice(f.as_bytes())),
//         logs: get_ethers_core_logs(&receipt),
//         status: receipt.status.map(|f| U64::try_from(f).unwrap()),
//         root: receipt.root.map(|f| H256::from_slice(f.as_bytes())),
//         logs_bloom: Bloom::from_slice(receipt.logs_bloom.as_bytes()),
//         transaction_type: receipt.transaction_type.map(|f| U64::try_from(f).unwrap()),
//         effective_gas_price: receipt
//             .effective_gas_price
//             .map(|f| U256::try_from(f.to_u128().unwrap()).unwrap()),
//     }
// }
//
// pub fn to_tx_request(request: TransactionRequest) -> TxRequest {
//     TxRequest {
//         from: request.from.map(|f| f.to_string()),
//         to: request.to.map(|f| match f {
//             NameOrAddress::Address(addr) => addr.to_string(),
//             NameOrAddress::Name(name) => name,
//         }),
//         gas: request.gas.map(|f| BigInt::try_from(f.as_u128()).unwrap()),
//         gas_price: request
//             .gas_price
//             .map(|f| BigInt::try_from(f.as_u128()).unwrap()),
//         value: request
//             .value
//             .map(|f| BigInt::try_from(f.as_u128()).unwrap()),
//         data: request
//             .data
//             .map(|f| String::from_utf8(f.0.to_vec()).unwrap()),
//         nonce: request.nonce.map(|f| f.as_u32()),
//     }
// }
//
// pub fn from_tx_request(request: TxRequest) -> TransactionRequest {
//     TransactionRequest {
//         from: request.from.map(|f| H160::from_slice(f.as_bytes())),
//         to: request.to.map(|f| match NameOrAddress::Name(f.clone()) {
//             NameOrAddress::Address(_) => NameOrAddress::Address(H160::from_slice(f.as_bytes())),
//             _ => NameOrAddress::Name(f),
//         }),
//         gas: request
//             .gas
//             .map(|f| U256::try_from(f.to_u128().unwrap()).unwrap()),
//         gas_price: request
//             .gas_price
//             .map(|f| U256::try_from(f.to_u128().unwrap()).unwrap()),
//         value: request
//             .value
//             .map(|f| U256::try_from(f.to_u128().unwrap()).unwrap()),
//         data: request
//             .data
//             .map(|f| Bytes::try_from(f.as_bytes().to_vec()).unwrap()),
//         nonce: request.nonce.map(|f| U256::try_from(f).unwrap()),
//     }
// }
//
// pub fn to_log(log: EthersLog) -> Log {
//     Log {
//         address: log.address.to_string(),
//         topics: log.topics.into_iter().map(|f| f.to_string()).collect(),
//         data: String::from_utf8(log.data.0.to_vec()).unwrap(),
//         block_hash: log.block_hash.map(|f| f.to_string()),
//         block_number: log
//             .block_number
//             .map(|f| BigInt::try_from(f.as_u64()).unwrap()),
//         transaction_hash: log.transaction_hash.map(|f| f.to_string()),
//         transaction_index: log.transaction_index.map(|f| f.as_u32()),
//         log_index: log.log_index.map(|f| f.as_u32()),
//         transaction_log_index: log.transaction_log_index.map(|f| f.as_u32()),
//         log_type: log.log_type,
//         removed: log.removed,
//     }
// }
//
// pub fn from_log(log: Log) -> EthersLog {
//     EthersLog {
//         address: H160::from_slice(log.address.as_bytes()),
//         topics: log
//             .topics
//             .into_iter()
//             .map(|f| H256::from_slice(f.as_bytes()))
//             .collect(),
//         data: Bytes::try_from(log.data.as_bytes().to_vec()).unwrap(),
//         block_hash: log.block_hash.map(|f| H256::from_slice(f.as_bytes())),
//         block_number: log
//             .block_number
//             .map(|f| U64::try_from(f.to_u64().unwrap()).unwrap()),
//         transaction_hash: log.transaction_hash.map(|f| H256::from_slice(f.as_bytes())),
//         transaction_index: log.transaction_index.map(|f| U64::try_from(f).unwrap()),
//         log_index: log.log_index.map(|f| U256::try_from(f).unwrap()),
//         transaction_log_index: log
//             .transaction_log_index
//             .map(|f| U256::try_from(f).unwrap()),
//         log_type: log.log_type,
//         removed: log.removed,
//     }
// }
//
// //==================== HELPERS ================================
//
// fn get_polywrapper_logs(receipt: &TransactionReceipt) -> Vec<Log> {
//     let mut logs: Vec<Log> = vec![];
//     for log in receipt.logs.clone() {
//         logs.push(Log {
//             address: log.address.to_string(),
//             topics: log.topics.into_iter().map(|f| f.to_string()).collect(),
//             data: String::from_utf8(log.data.0.to_vec()).unwrap(),
//             block_hash: log.block_hash.map(|f| f.to_string()),
//             block_number: log
//                 .block_number
//                 .map(|f| BigInt::try_from(f.as_u64()).unwrap()),
//             transaction_hash: log.transaction_hash.map(|f| f.to_string()),
//             transaction_index: log.transaction_index.map(|f| f.as_u32()),
//             log_index: log.log_index.map(|f| f.as_u32()),
//             transaction_log_index: log.transaction_log_index.map(|f| f.as_u32()),
//             log_type: log.log_type,
//             removed: log.removed,
//         });
//     }
//     logs
// }
//
// fn get_ethers_core_logs(receipt: &TxReceipt) -> Vec<EthersLog> {
//     let mut logs: Vec<EthersLog> = vec![];
//     for log in receipt.logs.clone() {
//         logs.push(EthersLog {
//             address: H160::from_slice(log.address.as_bytes()),
//             topics: log
//                 .topics
//                 .into_iter()
//                 .map(|f| H256::from_slice(f.as_bytes()))
//                 .collect(),
//             data: Bytes::try_from(log.data.as_bytes().to_vec()).unwrap(),
//             block_hash: log.block_hash.map(|f| H256::from_slice(f.as_bytes())),
//             block_number: log
//                 .block_number
//                 .map(|f| U64::try_from(f.to_u64().unwrap()).unwrap()),
//             transaction_hash: log.transaction_hash.map(|f| H256::from_slice(f.as_bytes())),
//             transaction_index: log.transaction_index.map(|f| U64::try_from(f).unwrap()),
//             log_index: log.log_index.map(|f| U256::try_from(f).unwrap()),
//             transaction_log_index: log
//                 .transaction_log_index
//                 .map(|f| U256::try_from(f).unwrap()),
//             log_type: log.log_type,
//             removed: log.removed,
//         });
//     }
//     logs
// }
