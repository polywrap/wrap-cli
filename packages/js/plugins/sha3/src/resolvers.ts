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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  keccak_512: (input: { message: string }) => {
    return keccak_512(input.message);
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  keccak_384: (input: { message: string }) => {
    return keccak_384(input.message);
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  keccak_256: (input: { message: string }) => {
    return keccak_256(input.message);
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  buffer_keccak_256: (input: { message: string }) => {
    return keccak_256(new Buffer(input.message, "hex"));
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  keccak_224: (input: { message: string }) => {
    return keccak_224(input.message);
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  shake_128: (input: { message: string; outputBits: number }) => {
    return shake_128(input.message, input.outputBits);
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  shake_256: (input: { message: string; outputBits: number }) => {
    return shake_256(input.message, input.outputBits);
  },
});
