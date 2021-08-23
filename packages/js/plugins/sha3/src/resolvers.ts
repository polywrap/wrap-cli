/* eslint-disable @typescript-eslint/naming-convention */
import { Query } from "./w3";

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

export const query = (): Query.Module => ({
  sha3_512: (input: Query.Input_sha3_512) => {
    return sha3_512(input.message);
  },
  sha3_384: (input: Query.Input_sha3_384) => {
    return sha3_384(input.message);
  },
  sha3_256: (input: Query.Input_sha3_256) => {
    return sha3_256(input.message);
  },
  sha3_224: (input: Query.Input_sha3_224) => {
    return sha3_224(input.message);
  },
  keccak_512: (input: Query.Input_keccak_512) => {
    return keccak_512(input.message);
  },
  keccak_384: (input: Query.Input_keccak_384) => {
    return keccak_384(input.message);
  },
  keccak_256: (input: Query.Input_keccak_256) => {
    return keccak_256(input.message);
  },
  hex_keccak_256: (input: Query.Input_hex_keccak_256) => {
    // remove the leading 0x
    const hexString = input.message.replace(/^0x/, "");

    // ensure even number of characters
    if (hexString.length % 2 != 0) {
      throw Error(
        `expecting an even number of characters in the hexString: ${hexString.length}`
      );
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
  buffer_keccak_256: (input: Query.Input_buffer_keccak_256) => {
    return keccak_256(input.message);
  },
  keccak_224: (input: Query.Input_keccak_224) => {
    return keccak_224(input.message);
  },
  shake_128: (input: Query.Input_shake_128) => {
    return shake_128(input.message, input.outputBits);
  },
  shake_256: (input: Query.Input_shake_256) => {
    return shake_256(input.message, input.outputBits);
  },
});
