import { PluginModule } from "@web3api/core-js";
import {
  sha3_512,
  sha3_384,
  sha3_256,
  sha3_224,
  keccak512,
  keccak384,
  keccak256,
  keccak224,
  shake128,
  shake256,
  cshake128,
  cshake256,
  kmac128,
  kmac256,
} from "js-sha3";

export const query = (): PluginModule => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  sha3_512: (input: { message: string }) => {
    return sha3_512(input.message);
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  sha3_384: (input: { message: string }) => {
    return sha3_384(input.message);
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  sha3_256: (input: { message: string }) => {
    return sha3_256(input.message);
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  sha3_224: (input: { message: string }) => {
    return sha3_224(input.message);
  },
  keccak512: (input: { message: string }) => {
    return keccak512(input.message);
  },
  keccak384: (input: { message: string }) => {
    return keccak384(input.message);
  },
  keccak256: (input: { message: string }) => {
    return keccak256(input.message);
  },
  keccak224: (input: { message: string }) => {
    return keccak224(input.message);
  },
  shake128: (input: { message: string; outputBits: number }) => {
    return shake128(input.message, input.outputBits);
  },
  shake256: (input: { message: string; outputBits: number }) => {
    return shake256(input.message, input.outputBits);
  },
  cshake128: (input: {
    message: string;
    outputBits: number;
    functionName: string;
    customization: string;
  }) => {
    return cshake128(
      input.message,
      input.outputBits,
      input.functionName,
      input.customization
    );
  },
  cshake256: (input: {
    message: string;
    outputBits: number;
    functionName: string;
    customization: string;
  }) => {
    return cshake256(
      input.message,
      input.outputBits,
      input.functionName,
      input.customization
    );
  },
  kmac128: (input: {
    key: string;
    message: string;
    outputBits: number;
    customization: string;
  }) => {
    return kmac128(
      input.key,
      input.message,
      input.outputBits,
      input.customization
    );
  },
  kmac256: (input: {
    key: string;
    message: string;
    outputBits: number;
    customization: string;
  }) => {
    return kmac256(
      input.key,
      input.message,
      input.outputBits,
      input.customization
    );
  },
});
