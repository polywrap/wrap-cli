import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeMutationEnv,
  deserializeMutationEnv,
  writeMutationEnv,
  readMutationEnv
} from "./serialization";
import * as Types from "..";

export class MutationEnv {
  mutProp: string;
  prop: string;
  optProp: string | null;

  constructor(
    mutProp: string,
    prop: string,
    optProp: string | null,
  ) {
    this.mutProp = mutProp;
    this.prop = prop;
    this.optProp = optProp;
  }

  static toBuffer(type: MutationEnv): ArrayBuffer {
    return serializeMutationEnv(type);
  }

  static fromBuffer(buffer: ArrayBuffer): MutationEnv {
    return deserializeMutationEnv(buffer);
  }

  static write(writer: Write, type: MutationEnv): void {
    writeMutationEnv(writer, type);
  }

  static read(reader: Read): MutationEnv {
    return readMutationEnv(reader);
  }
}
