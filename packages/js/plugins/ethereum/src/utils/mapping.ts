import { Access, TxReceipt, TxResponse, TxRequest, Log } from "../wrap-man";

import { ethers } from "ethers";

export const toTxReceipt = (
  receipt: ethers.providers.TransactionReceipt
): TxReceipt => ({
  to: receipt.to || "",
  from: receipt.from,
  contractAddress: receipt.contractAddress,
  transactionIndex: receipt.transactionIndex,
  root: receipt.root,
  gasUsed: receipt.gasUsed.toString(),
  logsBloom: receipt.logsBloom,
  transactionHash: receipt.transactionHash,
  logs: receipt.logs.map(toLog),
  blockNumber: receipt.blockNumber.toString(),
  blockHash: receipt.blockHash,
  confirmations: receipt.confirmations,
  cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
  effectiveGasPrice: receipt.effectiveGasPrice?.toString() || "0",
  byzantium: receipt.byzantium,
  type: receipt.type || 0,
  status: receipt.status,
});

export const fromTxReceipt = (
  receipt: TxReceipt
): ethers.providers.TransactionReceipt => ({
  to: receipt.to,
  from: receipt.from,
  contractAddress: receipt.contractAddress,
  transactionIndex: receipt.transactionIndex,
  root: receipt.root || undefined,
  gasUsed: ethers.BigNumber.from(receipt.gasUsed),
  logsBloom: receipt.logsBloom,
  transactionHash: receipt.transactionHash,
  logs: receipt.logs.map(fromLog),
  blockNumber: Number(receipt.blockNumber),
  blockHash: receipt.blockHash,
  confirmations: receipt.confirmations,
  cumulativeGasUsed: ethers.BigNumber.from(receipt.cumulativeGasUsed),
  byzantium: receipt.byzantium,
  status: receipt.status || undefined,
  effectiveGasPrice: ethers.BigNumber.from(receipt.effectiveGasPrice),
  type: receipt.type,
});

export const toTxResponse = (
  response: ethers.providers.TransactionResponse
): TxResponse => ({
  hash: response.hash,
  to: response.to,
  from: response.from,
  nonce: response.nonce,
  gasLimit: response.gasLimit.toString(),
  gasPrice: response.gasPrice?.toString(),
  data: response.data,
  value: response.value.toString(),
  chainId: response.chainId.toString(),
  blockNumber: response.blockNumber?.toString(),
  blockHash: response.blockHash,
  timestamp: response.timestamp,
  confirmations: response.confirmations,
  raw: response.raw,
  r: response.r,
  s: response.s,
  v: response.v,
  type: response.type || undefined,
  accessList: response.accessList?.map(toAccess),
});

export const toTxRequest = (
  request: ethers.providers.TransactionRequest
): TxRequest => ({
  to: request.to,
  from: request.from,
  nonce: request.nonce ? Number(request.nonce.toString()) : undefined,
  gasLimit: request.gasLimit?.toString(),
  gasPrice: request.gasPrice?.toString(),
  data: request.data?.toString(),
  value: request.value?.toString(),
  chainId: request.chainId?.toString(),
  type: request.type,
});

export const fromTxRequest = (
  request: TxRequest
): ethers.providers.TransactionRequest => ({
  to: request.to || undefined,
  from: request.from || undefined,
  nonce: request.nonce || undefined,
  gasLimit: request.gasLimit
    ? ethers.BigNumber.from(request.gasLimit)
    : undefined,
  gasPrice: request.gasPrice
    ? ethers.BigNumber.from(request.gasPrice)
    : undefined,
  data: request.data || undefined,
  value: request.value ? ethers.BigNumber.from(request.value) : undefined,
  chainId: request.chainId ? Number.parseInt(request.chainId) : undefined,
  type: request.type || undefined,
});

export const toLog = (log: ethers.providers.Log): Log => ({
  blockNumber: log.blockNumber.toString(),
  blockHash: log.blockHash,
  transactionIndex: log.transactionIndex,
  removed: !!log.removed,
  address: log.address,
  data: log.data,
  topics: log.topics,
  transactionHash: log.transactionHash,
  logIndex: log.logIndex,
});

export const fromLog = (log: Log): ethers.providers.Log => ({
  blockNumber: Number(log.blockNumber),
  blockHash: log.blockHash,
  transactionIndex: log.transactionIndex,
  removed: log.removed,
  address: log.address,
  data: log.data,
  topics: log.topics,
  transactionHash: log.transactionHash,
  logIndex: log.logIndex,
});

export const toAccess = (access: {
  address: string;
  storageKeys: string[];
}): Access => ({
  address: access.address,
  storageKeys: access.storageKeys,
});

export const fromAccess = (
  access: Access
): { address: string; storageKeys: string[] } => ({
  address: access.address,
  storageKeys: access.storageKeys,
});
