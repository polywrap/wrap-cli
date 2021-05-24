import { ethers } from "ethers";
import {
  TxReceipt,
  TxResponse,
  TxRequest
} from "./types";

export const mapTxReceipt = (
  receipt: ethers.providers.TransactionReceipt
): TxReceipt => ({
  ...receipt,
  gasUsed: receipt.gasUsed.toString(),
  cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
});

export const mapTxResponse = (
  response: ethers.providers.TransactionResponse
): TxResponse => ({
  ...response,
  nonce: response.nonce.toString(),
  gasLimit: response.gasLimit.toString(),
  gasPrice: response.gasPrice.toString(),
  data: response.data.toString(),
});

export const mapTxRequest = (
  request: ethers.providers.TransactionRequest
): TxRequest => ({
  ...request,
  nonce: request.nonce !== undefined ? request.nonce.toString() : undefined,
  gasLimit:
    request.gasLimit !== undefined ? request.gasLimit.toString() : undefined,
  gasPrice:
    request.gasPrice !== undefined ? request.gasPrice.toString() : undefined,
  value: request.value !== undefined ? request.value.toString() : undefined,
});
