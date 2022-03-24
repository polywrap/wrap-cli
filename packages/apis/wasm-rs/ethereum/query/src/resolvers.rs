use super::w3::imported::InputCallView;
use super::w3::imported::*;
use super::w3::InputCallContractView;
use super::mapping::*;

use ethers_core::abi::{AbiParser, Tokenize, AbiError, Function};
use ethers_core::types::Address;
use ethers_core::types::{TransactionRequest, Bytes};

use std::str::FromStr;

fn encode_function_data<T: Tokenize>(function: &Function, args: T) -> Result<Bytes, AbiError> {
  let tokens = args.into_tokens();
  Ok(function.encode_input(&tokens).map(Into::into)?)
}

fn from_method_and_args<T: Tokenize>(method: &str, args: T) -> TransactionRequest {
  let function = AbiParser::default().parse_function(method).unwrap();
  let data = encode_function_data(&function, args).unwrap();

  TransactionRequest { data: Some(data), ..Default::default() }
}

pub fn call_contract_view(input: InputCallContractView) -> String {
  let to = Address::from_str(&input.address).unwrap();
  let args = match input.args {
    Some(a) => a,
    None => vec![]
  };

  let tx = from_method_and_args(&input.method, args).to(to);
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

// pub async fn sign_message(input: InputSignMessage) {
  //await EthereumSigner_Mutation.signMessage(tx_request, 1, connection)
// }
