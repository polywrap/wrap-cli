use ethers::abi::AbiParser;
use ethers::abi::Token;
use ethers::contract::*;
use ethers::prelude::Address;
use ethers::types::{TransactionRequest, Bytes, BlockNumber};
use crate::w3::Connection;
use super::mapping::*;
use std::str::FromStr;
use crate::w3::*;

fn from_method_and_args(method: &str, args: Vec<Token>) -> TransactionRequest {
  let function = AbiParser::default().parse_function(method).unwrap();
  let data = encode_function_data(&function, args).unwrap();

  TransactionRequest { data: Some(data), ..Default::default() }
}

pub fn call_contract_view(input: InputCallContractView) -> String {
  // let to = Address::from_str(address).unwrap();
  // let tx = from_method_and_args(method, args).to(to);
  // let tx_request = to_tx_request(tx);

  //await EthereumSigner_Query.callContractView(tx_request, connection)
  "".to_string()
}

// pub async fn call_contract_method(input: InputCallContractMethod) {
  // let to = Address::from_str(address).unwrap();
  // let tx = from_method_and_args(method, args).to(to);
  // let tx_request = to_tx_request(tx);

  //await EthereumSigner_Mutation.sendTransaction(tx_request, connection)
// }

// pub async fn deploy_contract(input: InputDeployContract) {
  // let abi = AbiParser::default().parse_str(abi_str).unwrap();
  //
  // let data: Bytes = match (abi.constructor(), args.is_empty()) {
  //   (None, false) => return panic!("Constructor error"),
  //   (None, true) => bytecode.clone(),
  //   (Some(constructor), _) => {
  //       constructor.encode_input(bytecode.to_vec(), &args).unwrap().into()
  //   }
  // };
  //
  // let tx = TransactionRequest { to: None, data: Some(data), ..Default::default() };

  //await EthereumSigner_Mutation.sendTransactionAndWait(tx_request, 1, connection)
// }

// pub async fn sign_message(input: InputSignMessage) {
  //await EthereumSigner_Mutation.signMessage(tx_request, 1, connection)
// }