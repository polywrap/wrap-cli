use super::w3::imported::InputSendTransaction;
use super::w3::imported::*;
use super::w3::InputDeployContract;
use super::mapping::to_tx_request;

use ethers_core::abi::{AbiParser, Tokenize};
use ethers_core::types::{TransactionRequest, Bytes};

use std::str::FromStr;

pub fn deploy_contract(input: InputDeployContract) -> ethereum_tx_response::EthereumTxResponse {
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

  let send_transaction_args = InputSendTransaction {
    tx: tx_request,
    connection: input.connection
  };

  match EthereumMutation::send_transaction(&send_transaction_args) {
    Ok(result) => result,
    Err(e) => panic!("{}", e)
  }
}

// pub fn call_contract_method(input: InputCallContractMethod) {
//   let to = Address::from_str(address).unwrap();
//   let tx = from_method_and_args(method, args).to(to);
//   let tx_request = to_tx_request(tx);

//   await EthereumSigner_Mutation.sendTransaction(tx_request, connection)
// }