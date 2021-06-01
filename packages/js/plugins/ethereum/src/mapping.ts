import { TxReceipt, TxResponse, TxRequest, Log } from "./types";

import { ethers } from "ethers";

export const mapLog = (log: ethers.providers.Log): Log => ({
  blockNumber: log.blockNumber,
  blockHash: log.blockHash,
  transactionIndex: log.transactionIndex,
  removed: log.removed,
  address: log.address,
  data: log.data,
  topics: log.topics,
  transactionHash: log.transactionHash,
  logIndex: log.logIndex,
});

export const mapTxReceipt = (
  receipt: ethers.providers.TransactionReceipt
): TxReceipt => ({
  transactionHash: receipt.transactionHash,
  cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
});

// export const mapTxResponse = (
//   response: ethers.providers.TransactionResponse
// ): TxResponse => ({
//   hash: response.hash,
//   blockNumber: response.blockNumber,
//   blockHash: response.blockHash,
//   timestamp: response.timestamp,
//   confirmations: response.confirmations,
//   from: response.from,
//   raw: response.raw,
//   nonce: response.nonce.toString(),
//   gasLimit: response.gasLimit.toString(),
//   gasPrice: response.gasPrice.toString(),
//   data: response.data.toString(),
// });

export const mapTxRequest = (
  request: ethers.providers.TransactionRequest
): TxRequest => ({
  to: request.to,
  from: request.from,
  nonce: request.nonce !== undefined ? request.nonce.toString() : undefined,
  gasLimit:
    request.gasLimit !== undefined ? request.gasLimit.toString() : undefined,
  gasPrice:
    request.gasPrice !== undefined ? request.gasPrice.toString() : undefined,
  data: request.data !== undefined ? request.data.toString() : undefined,
  value: request.value !== undefined ? request.value.toString() : undefined,
  chainId: request.chainId,
});

export const parseArgs = (args: string[]): (string | string[])[] => {
  return args.map((arg: string) =>
    arg.startsWith("[") && arg.endsWith("]") ? JSON.parse(arg) : arg
  );
};
