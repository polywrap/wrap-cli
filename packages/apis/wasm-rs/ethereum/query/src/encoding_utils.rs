use ethers_core::{
  types::{Bytes},
  abi::{
    AbiParser, Token, Error, ParamType,
    token::{LenientTokenizer, Tokenizer}
  }
};

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
  let tokenized_args: Vec<Token> = tokenize_str_args(function.inputs.into_iter()
    .map(|x| x.kind).collect(), args)?;

  Ok(function.encode_input(&tokenized_args).map(Into::into)?)
}