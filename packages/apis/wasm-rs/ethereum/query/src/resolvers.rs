use super::w3::imported::InputCallView;
use super::w3::imported::*;
use super::w3::InputCallContractView;
use super::mapping::*;
use super::encoding_utils::{encode_function_args, tokenize_str_args, get_address};

use ethers_core::abi::{AbiParser, encode};
use ethers_core::utils::{parse_ether, format_ether};
use ethers_core::types::{TransactionRequest, Address, NameOrAddress};
use std::str::FromStr;
use polywrap_wasm_rs::{BigInt};
use num_traits::{FromPrimitive, ToPrimitive};

pub fn call_contract_view(input: InputCallContractView) -> String {
  let to = match Address::from_str(&input.address) {
    Ok(a) => a,
    Err(e) => panic!("Invalid contract address: {}. Error: {}", &input.address, e)
  };
  let args = match input.args {
    Some(a) => a,
    None => vec![]
  };

  let tx_data = match encode_function_args(&input.method, args) {
    Ok(data) => data,
    Err(e) => panic!("Error encoding function '{}'. Error: {}", &input.method, e)
  };

  let tx = TransactionRequest { 
    data: Some(tx_data),
    to: Some(NameOrAddress::Address(to)),
    ..Default::default()
  };

  let tx_request = to_tx_request(tx);

  let contract_call_args = InputCallView {
    tx_request,
    connection: input.connection
  };

  match EthereumQuery::call_view(&contract_call_args) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn call_contract_static(input: super::w3::InputCallContractStatic) -> super::w3::imported::ethereum_static_tx_result::EthereumStaticTxResult {
  let to = match Address::from_str(&input.address) {
    Ok(a) => a,
    Err(e) => panic!("Invalid contract address: {}. Error: {}", &input.address, e)
  };

  let contract_call_args = super::w3::imported::ethereum_query::InputCallContractStatic {
    address: to.to_string(),
    method: input.method,
    args: input.args,
    connection: input.connection,
    tx_overrides: input.tx_overrides
  };

  match EthereumQuery::call_contract_static(&contract_call_args) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn encode_params(input: super::w3::InputEncodeParams) -> String {
  //Ethers's parse_param function is private. So we parse a mock function to extract the param_types
  let types_str = input.types.join(", ");
  let mock_function = AbiParser::default().parse_function(&format!("foo({})", types_str)).unwrap();

  match tokenize_str_args(
    mock_function.inputs.clone().into_iter().map(|x| x.kind).collect(),
    input.values.clone()) {
      Ok(data) => String::from_utf8(encode(&data)).unwrap(),
      Err(e) => panic!("Error tokenizing args: {}. Error: {}", input.values.join(", "), e)
  }
}

pub fn encode_function(input: super::w3::InputEncodeFunction) -> String {
  let args = match input.args {
    Some(a) => a,
    None => vec![]
  };

  match encode_function_args(&input.method, args) {
    Ok(data) => String::from_utf8(data.to_vec()).unwrap(),
    Err(e) => panic!("Error encoding function '{}'. Error: {}", &input.method, e)
  }
}

pub fn get_signer_address(input: super::w3::InputGetSignerAddress) -> String {
  match EthereumQuery::get_signer_address(&super::w3::imported::ethereum_query::InputGetSignerAddress {
    connection: input.connection
  }) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn get_signer_balance(input: super::w3::InputGetSignerBalance) -> BigInt {
  match EthereumQuery::get_signer_balance(&super::w3::imported::ethereum_query::InputGetSignerBalance {
    block_tag: input.block_tag,
    connection: input.connection
  }) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn get_signer_transaction_count(input: super::w3::InputGetSignerTransactionCount) -> BigInt {
  match EthereumQuery::get_signer_transaction_count(&super::w3::imported::ethereum_query::InputGetSignerTransactionCount {
    block_tag: input.block_tag,
    connection: input.connection
  }) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn get_gas_price(input: super::w3::InputGetGasPrice) -> BigInt {
  match EthereumQuery::get_gas_price(&super::w3::imported::ethereum_query::InputGetGasPrice {
    connection: input.connection
  }) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn estimate_transaction_gas(input: super::w3::InputEstimateTransactionGas) -> BigInt {
  match EthereumQuery::estimate_transaction_gas(&super::w3::imported::ethereum_query::InputEstimateTransactionGas {
    tx: input.tx,
    connection: input.connection
  }) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn estimate_contract_call_gas(input: super::w3::InputEstimateContractCallGas) -> BigInt {
  let to = match Address::from_str(&input.address) {
    Ok(a) => a,
    Err(e) => panic!("Invalid contract address: {}. Error: {}", &input.address, e)
  };
  let args = match input.args {
    Some(a) => a,
    None => vec![]
  };

  let tx_data = match encode_function_args(&input.method, args) {
    Ok(data) => data,
    Err(e) => panic!("Error encoding function '{}'. Error: {}", &input.method, e)
  };

  let tx = TransactionRequest { 
    data: Some(tx_data),
    to: Some(NameOrAddress::Address(to)),
    ..Default::default()
  };

  let contract_call_estimate_args = super::w3::imported::ethereum_query::InputEstimateTransactionGas {
    tx: to_tx_request(tx),
    connection: input.connection
  };
  
  match EthereumQuery::estimate_transaction_gas(&contract_call_estimate_args) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn check_address(input: super::w3::InputCheckAddress) -> bool {
  match get_address(&input.address) {
    Ok(a) => true,
    Err(e) => false
  }
}

pub fn to_wei(input: super::w3::InputToWei) -> BigInt {
  match parse_ether(input.eth) {
    Ok(wei) => FromPrimitive::from_u64(wei.as_u64()).unwrap(),
    Err(e) => panic!("{}", e)
  }
}

pub fn to_eth(input: super::w3::InputToEth) -> String {
  let wei = match input.wei.to_u64() {
    Some(w) => w,
    None => panic!("Invalid Wei number: {}", input.wei)
  };

  format_ether(wei).to_string()
}

pub fn await_transaction(input: super::w3::InputAwaitTransaction) -> super::w3::imported::ethereum_tx_receipt::EthereumTxReceipt {
  match EthereumQuery::await_transaction(&super::w3::imported::ethereum_query::InputAwaitTransaction {
    tx_hash: input.tx_hash,
    confirmations: input.confirmations,
    timeout: input.timeout,
    connection: input.connection
  }) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn wait_for_event(input: super::w3::InputWaitForEvent) -> super::w3::imported::ethereum_event_notification::EthereumEventNotification {
  match EthereumQuery::wait_for_event(&super::w3::imported::ethereum_query::InputWaitForEvent {
    address: input.address,
    event: input.event,
    args: input.args,
    timeout: input.timeout,
    connection: input.connection
  }) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn get_network(input: super::w3::InputGetNetwork) -> super::w3::imported::ethereum_network::EthereumNetwork {
  match EthereumQuery::get_network(&super::w3::imported::ethereum_query::InputGetNetwork {
    connection: input.connection
  }) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}