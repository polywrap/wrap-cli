import {
  Ethereum_Mutation,
  Ethereum_TxResponse,
  Input_executeTransactions,
  TxOverrides,
  Ethereum_Query,
} from "./w3";

export function executeTransactions(
  input: Input_executeTransactions
): Ethereum_TxResponse {
  let transactionData = "0x";
  for (let i = 0; i < input.transactions.length; i++) {
    const tx = input.transactions[i];

    const encoded = Ethereum_Query.encodeTransaction({
      types: ["uint8", "address", "uint256", "uint256", "bytes"],
      values: tx,
    });
    transactionData += encoded.slice(2);
  }

  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;

  return Ethereum_Mutation.callContractMethod({
    address: input.delegatorAddress,
    method:
      "function exec(address payable to, bytes memory transactionsData) public payable",
    args: [input.multisendAddress, transactionData],
    connection: input.connection,
    txOverrides: {
      value: null,
      gasPrice: txOverrides.gasPrice,
      gasLimit: txOverrides.gasLimit,
    },
  });
}
