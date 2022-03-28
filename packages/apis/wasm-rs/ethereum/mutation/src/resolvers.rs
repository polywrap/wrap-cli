use super::w3::imported::{InputSendTransaction, InputSendTransactionAndWait,
  EthereumMutation, ethereum_tx_receipt, ethereum_tx_response};
use super::mapping::to_tx_request;

use ethers_core::abi::{AbiParser, Token, Param};
use ethers_core::abi::token::{Tokenizer, LenientTokenizer};
use ethers_core::types::{TransactionRequest, Bytes, Address};

use std::str::FromStr;

fn tokenize_str_args(inputs: Vec<Param>, args: Vec<String>) -> Vec<Token> {
  inputs.into_iter().enumerate().map(|(i, param_type)| 
    match LenientTokenizer::tokenize(&param_type.kind, &args[i]) {
      Ok(token) => token,
      Err(e) => panic!("Error while tokenizing contract method argument. Err: {}", e)
    }
  ).collect()
}

fn tx_from_method_and_args(method: &str, args: Vec<String>) -> TransactionRequest {
  let function = AbiParser::default().parse_function(method).unwrap();
  let tokenized_args: Vec<Token> = tokenize_str_args(function.inputs.clone(), args);

  let data = match function.encode_input(&tokenized_args).map(Into::<Bytes>::into) {
    Ok(bytes) => bytes,
    Err(e) => panic!("{}", e)
  };

  TransactionRequest { data: Some(data), ..Default::default() }
}

pub fn deploy_contract(input: super::w3::InputDeployContract) -> ethereum_tx_receipt::EthereumTxReceipt {
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
        constructor.encode_input(bytecode.to_vec(), &tokenize_str_args(constructor.inputs.clone(), args_list)).unwrap().into()
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

pub fn call_contract_method(input: super::w3::InputCallContractMethod) -> ethereum_tx_response::EthereumTxResponse {
  let to = Address::from_str(&input.address).unwrap();
  let args_list = match input.args {
    Some(a) => a,
    None => vec![]
  };
  let tx = tx_from_method_and_args(&input.method, args_list).to(to);
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

pub fn call_contract_method_and_wait(input: super::w3::InputCallContractMethodAndWait) -> ethereum_tx_receipt::EthereumTxReceipt {
  let to = Address::from_str(&input.address).unwrap();
  let args_list = match input.args {
    Some(a) => a,
    None => vec![]
  };
  let tx = tx_from_method_and_args(&input.method, args_list).to(to);
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

pub fn send_transaction(input: super::w3::InputSendTransaction) -> ethereum_tx_response::EthereumTxResponse {
  let send_transaction_args = InputSendTransaction {
    tx: input.tx,
    connection: input.connection
  };

  match EthereumMutation::send_transaction(&send_transaction_args) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn send_transaction_and_wait(input: super::w3::InputSendTransactionAndWait) -> ethereum_tx_receipt::EthereumTxReceipt {
  let send_transaction_args = InputSendTransactionAndWait {
    tx: input.tx,
    connection: input.connection
  };

  match EthereumMutation::send_transaction_and_wait(&send_transaction_args) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn sign_message(input: super::w3::InputSignMessage) -> String {
  let sign_message_args = super::w3::imported::ethereum_mutation::InputSignMessage {
    message: input.message,
    connection: input.connection
  };

  match EthereumMutation::sign_message(&sign_message_args) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

pub fn send_rpc(input: super::w3::InputSendRpc) -> Option<String> {
  let send_rpc_args = super::w3::imported::ethereum_mutation::InputSendRPC {
    method: input.method,
    params: input.params,
    connection: input.connection
  };

  match EthereumMutation::send_r_p_c(&send_rpc_args) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}