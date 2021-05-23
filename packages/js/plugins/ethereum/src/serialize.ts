import { ethers } from "ethers";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type SerializableTxReceipt = Overwrite<
  ethers.providers.TransactionReceipt,
  {
    gasUsed: string;
    cumulativeGasUsed: string;
  }
>;

export type SerializableTxResponse = Overwrite<
  ethers.providers.TransactionResponse,
  {
    nonce: string;
    gasLimit: string;
    gasPrice: string;
    data: string;
  }
>;

export type SerializableTxRequest = Overwrite<
  ethers.providers.TransactionRequest,
  {
    nonce?: string;
    gasLimit?: string;
    gasPrice?: string;
    value?: string;
  }
>;

export const serializableTxReceipt = (
  receipt: ethers.providers.TransactionReceipt
): SerializableTxReceipt => ({
  ...receipt,
  gasUsed: receipt.gasUsed.toString(),
  cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
});

export const serializableTxResponse = (
  response: ethers.providers.TransactionResponse
): SerializableTxResponse => ({
  ...response,
  nonce: response.nonce.toString(),
  gasLimit: response.gasLimit.toString(),
  gasPrice: response.gasPrice.toString(),
  data: response.data.toString(),
});

export const serializableTxRequest = (
  request: ethers.providers.TransactionRequest
): SerializableTxRequest => ({
  ...request,
  nonce: request.nonce !== undefined ? request.nonce.toString() : undefined,
  gasLimit:
    request.gasLimit !== undefined ? request.gasLimit.toString() : undefined,
  gasPrice:
    request.gasPrice !== undefined ? request.gasPrice.toString() : undefined,
  value: request.value !== undefined ? request.value.toString() : undefined,
});
