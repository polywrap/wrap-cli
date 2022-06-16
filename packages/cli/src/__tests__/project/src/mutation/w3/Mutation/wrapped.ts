import {
  setData,
  deployContract
} from "../../index";
import {
  deserializesetDataArgs,
  serializesetDataResult,
  deserializedeployContractArgs,
  serializedeployContractResult
} from "./serialization";

export function setDataWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesetDataArgs(argsBuf);
  const result = setData({
    options: args.options,
    connection: args.connection
  });
  return serializesetDataResult(result);
}

export function deployContractWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializedeployContractArgs(argsBuf);
  const result = deployContract({
    connection: args.connection
  });
  return serializedeployContractResult(result);
}
