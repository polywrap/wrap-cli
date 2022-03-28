use super::w3::imported::InputCallView;
use super::w3::imported::*;
use super::w3::InputCallContractView;
use super::mapping::*;
use super::encoding_utils::{encode_function_args, tokenize_str_args};

use ethers_core::abi::{AbiParser, ParamType, Error, encode};
use ethers_core::types::{TransactionRequest, Address, NameOrAddress};
use std::str::FromStr;

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

pub fn call_contract_static(input: super::w3::imported::InputCallContractStatic) -> super::w3::imported::ethereum_static_tx_result::EthereumStaticTxResult {
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

pub fn encode_params(input: super::w3::imported::InputEncodeParams) -> String {
  //Ethers's parse_param function is private. The smallest public parser is the function's
  let args_str = input.types.join(", ");
  let temp_abi = AbiParser::default().parse_str(&format!("foo({})", args_str)).unwrap();
  let temp_function = temp_abi
    .function("foo").unwrap();

  match tokenize_str_args(
    temp_function.inputs.clone().into_iter().map(|x| x.kind).collect(),
    input.values.clone()) {
      Ok(data) => String::from_utf8(encode(&data)).unwrap(),
      Err(e) => panic!("Error tokenizing args: {}. Error: {}", input.values.join(", "), e)
  }
}
