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
  hex_keccak_256: (input: { message: string }) => {
    // remove the leading 0x
    const hexString = input.message.replace(/^0x/, '');

    // ensure even number of characters
    if (hexString.length % 2 != 0) {
      throw Error(`expecting an even number of characters in the hexString: ${hexString.length}`);
    }

    // check for some non-hex characters
    const bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
      throw Error(`found non-hex characters: ${bad}`);
    }

    // split the string into pairs of octets
    const pairs = hexString.match(/[\dA-F]{2}/gi);

    if (!pairs) {
      throw Error("Invalid hexString, unable to split into octets");
    }

    // convert the octets to integers
    const integers = pairs.map((p) => {
        return parseInt(p, 16);
    });

    return keccak_256(new Uint8Array(integers));
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
