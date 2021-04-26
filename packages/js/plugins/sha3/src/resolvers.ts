/* eslint-disable @typescript-eslint/naming-convention */
import { PluginModule } from "@web3api/core-js";
import {
  sha3_512,
  sha3_384,
  sha3_256,
  sha3_224,
  keccak_512,
  keccak_384,
  keccak_256,
  keccak_224,
  shake_128,
  shake_256,
} from "js-sha3";

export const query = (): PluginModule => ({
  sha3_512: (input: { message: string }) => {
    return sha3_512(input.message);
  },
  sha3_384: (input: { message: string }) => {
    return sha3_384(input.message);
  },
  sha3_256: (input: { message: string }) => {
    return sha3_256(input.message);
  },
  sha3_224: (input: { message: string }) => {
    return sha3_224(input.message);
  },
  keccak_512: (input: { message: string }) => {
    return keccak_512(input.message);
  },
  keccak_384: (input: { message: string }) => {
    return keccak_384(input.message);
  },
  keccak_256: (input: { message: string }) => {
    return keccak_256(input.message);
  },
  buffer_keccak_256: (input: { message: ArrayBuffer }) => {
    return keccak_256(input.message);
  },
  keccak_224: (input: { message: string }) => {
    return keccak_224(input.message);
  },
  shake_128: (input: { message: string; outputBits: number }) => {
    return shake_128(input.message, input.outputBits);
  },
  shake_256: (input: { message: string; outputBits: number }) => {
    return shake_256(input.message, input.outputBits);
  },
});
