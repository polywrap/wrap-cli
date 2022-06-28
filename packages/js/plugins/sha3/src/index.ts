/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import {
  Module,
  Args_sha3_512,
  Args_sha3_384,
  Args_sha3_256,
  Args_sha3_224,
  Args_keccak_512,
  Args_keccak_384,
  Args_keccak_256,
  Args_keccak_224,
  Args_hex_keccak_256,
  Args_buffer_keccak_256,
  Args_shake_128,
  Args_shake_256,
  manifest,
} from "./wrap";

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
import { PluginFactory } from "@polywrap/core-js";

type NoConfig = Record<string, never>;

export class Sha3Plugin extends Module<NoConfig> {
  public sha3_512(args: Args_sha3_512): string {
    return sha3_512(args.message);
  }

  public sha3_384(args: Args_sha3_384): string {
    return sha3_384(args.message);
  }

  public sha3_256(args: Args_sha3_256): string {
    return sha3_256(args.message);
  }

  public sha3_224(args: Args_sha3_224): string {
    return sha3_224(args.message);
  }

  public keccak_512(args: Args_keccak_512): string {
    return keccak_512(args.message);
  }

  public keccak_384(args: Args_keccak_384): string {
    return keccak_384(args.message);
  }

  public keccak_256(args: Args_keccak_256): string {
    return keccak_256(args.message);
  }

  public hex_keccak_256(args: Args_hex_keccak_256): string {
    // remove the leading 0x
    const hexString = args.message.replace(/^0x/, "");

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
  }

  public buffer_keccak_256(args: Args_buffer_keccak_256): string {
    return keccak_256(args.message);
  }

  public keccak_224(args: Args_keccak_224): string {
    return keccak_224(args.message);
  }

  public shake_128(args: Args_shake_128): string {
    return shake_128(args.message, args.outputBits);
  }

  public shake_256(args: Args_shake_256): string {
    return shake_256(args.message, args.outputBits);
  }
}

export const sha3Plugin: PluginFactory<NoConfig> = () => {
  return {
    factory: () => new Sha3Plugin({}),
    manifest,
  };
};

export const plugin = sha3Plugin;
