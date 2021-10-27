import { BigInt } from "@web3api/wasm-as";
import { Near_AccessKeyPermission } from "../query/w3";

export class FunctionCallPermission extends Near_AccessKeyPermission {
  receiverId: string;
  methodNames: Array<string>;
  allowance: BigInt | null;
}