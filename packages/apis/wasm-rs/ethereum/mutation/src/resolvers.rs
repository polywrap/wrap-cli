use super::w3::imported::{InputSendTransaction, InputSendTransactionAndWait};
use super::w3::imported::*;
use super::w3::{InputDeployContract, InputCallContractMethod};
use super::mapping::to_tx_request;

use ethers_core::abi::{AbiParser, Tokenize, AbiError, Function, Token};
use ethers_core::abi::token::{Tokenizer, LenientTokenizer};
use ethers_core::types::{TransactionRequest, Bytes, Address};

use std::str::FromStr;

fn encode_function_data(function: &Function, args: Vec<String>) -> Result<Bytes, AbiError> {
  let tokenized_args: Vec<Token> = function.inputs.clone().into_iter().enumerate().map(|(i, param_type)| 
    match LenientTokenizer::tokenize(&param_type.kind, &args[i]) {
      Ok(token) => token,
      Err(e) => panic!("Error while tokenizing contract method argument. Err: {}", e)
    }
  ).collect();

  Ok(function.encode_input(&tokenized_args).map(Into::into)?)
}

fn from_method_and_args(method: &str, args: Vec<String>) -> TransactionRequest {
  let function = AbiParser::default().parse_function(method).unwrap();
  let data = match encode_function_data(&function, args) {
    Ok(d) => d,
    Err(e) => panic!("{}", e)
  };

  TransactionRequest { data: Some(data), ..Default::default() }
}

pub fn deploy_contract(input: InputDeployContract) -> ethereum_tx_receipt::EthereumTxReceipt {
  let abi = AbiParser::default().parse_str(&input.abi).unwrap();
  let args_list = match input.args {
    Some(a) => a,
    None => vec![]
  };
  let bytecode = Bytes::from_str(&input.bytecode).unwrap();
  
  let data: Bytes = match (abi.constructor(), args_list.is_empty()) {
    (None, false) => panic!("Constructor error"),
    (None, true) => bytecode.clone(),
    (Some(constructor), _) => {
        constructor.encode_input(bytecode.to_vec(), &args_list.into_tokens()).unwrap().into()
    }
  };
  
  let tx = TransactionRequest { to: None, data: Some(data), ..Default::default() };
  let tx_request = to_tx_request(tx);

  let send_transaction_args = InputSendTransactionAndWait {
    tx: tx_request,
    connection: input.connection
  };

  match EthereumMutation::send_transaction_and_wait(&send_transaction_args) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn call_contract_method(input: InputCallContractMethod) -> ethereum_tx_response::EthereumTxResponse {
  let to = Address::from_str(&input.address).unwrap();
  let args_list = match input.args {
    Some(a) => a,
    None => vec![]
  };
  let tx = from_method_and_args(&input.method, args_list).to(to);
  let tx_request = to_tx_request(tx);

  let send_transaction_args = InputSendTransaction {
    tx: tx_request,
    connection: input.connection
  };

  match EthereumMutation::send_transaction(&send_transaction_args) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}