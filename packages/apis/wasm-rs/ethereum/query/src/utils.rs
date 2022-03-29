use ethers_core::{
  utils::{to_checksum},
  types::{Bytes, H160, Address, transaction::request::TransactionRequest, NameOrAddress},
  abi::{
    AbiParser, Token, Error, ParamType,
    token::{LenientTokenizer, Tokenizer}
  }
};
use regex::Regex;
use std::str::FromStr;
use super::mapping::to_tx_request;

pub fn tokenize_str_args(param_types: Vec<ParamType>, args: Vec<String>) -> Result<Vec<Token>, Error> {
  let mut tokens: Vec<Result<Token, Error>> = Vec::new();
  let mut i = 0;

  for param_type in param_types.into_iter() {
    tokens.push(LenientTokenizer::tokenize(&param_type, &args[i]));
    i += 1;
  }

  tokens.into_iter().collect()
}

pub fn encode_function_args(method: &str, args: Vec<String>) -> Result<Bytes, Error> {
  let function = AbiParser::default().parse_function(method).unwrap();
  let tokenized_args: Vec<Token> = tokenize_str_args(function.inputs.clone().into_iter()
    .map(|x| x.kind).collect(), args)?;

  Ok(function.encode_input(&tokenized_args).map(Into::into)?)
}

pub fn get_address(addr_str: &str) -> Result<String, String> {
  let is_regular_regex = Regex::new(r"^(0x)?[0-9a-fA-F]{40}$").unwrap();

  if is_regular_regex.is_match(addr_str) {
    let mut address = String::from(addr_str);

    if !addr_str.starts_with("0x") {
      address = String::from("0x") + &address;
    }

    let h160_address = H160::from_str(&address).map_err(|e| e.to_string())?;
    let checksum_regex = Regex::new(r"([A-F].*[a-f])|([a-f].*[A-F])").unwrap();

    let checksum = to_checksum(&h160_address, Option::None);

    if checksum_regex.is_match(&address) && address.ne(&checksum) {
      return Err(format!("Bad address checksum: {}", addr_str))
    }

    Ok(checksum)
  } else {
    Err(format!("Invalid address: {}", addr_str))
  }
}

pub fn contract_call_to_tx(address: &str, method: &str, args: Option<Vec<String>>) -> super::w3::imported::EthereumTxRequest {
  let to = match Address::from_str(&address) {
    Ok(a) => a,
    Err(e) => panic!("Invalid contract address: {}. Error: {}", &address, e)
  };
  let args = match args {
    Some(a) => a,
    None => vec![]
  };

  let tx_data = match encode_function_args(&method, args) {
    Ok(data) => data,
    Err(e) => panic!("Error encoding function '{}'. Error: {}", &method, e)
  };

  let tx = TransactionRequest { 
    data: Some(tx_data),
    to: Some(NameOrAddress::Address(to)),
    ..Default::default()
  };

  to_tx_request(tx)
}