// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  Client,
  InvokeApiResult
} from "@web3api/core-js";

export type UInt = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Int = number;
export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type Bytes = ArrayBuffer;
export type BigInt = string;
export type BigNumber = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Imported Objects START ///

/* URI: "ens/simple-storage.eth" */
export interface SimpleStorage_Ethereum_Connection {
  node?: Types.String | null;
  networkNameOrChainId?: Types.String | null;
}

/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "ens/simple-storage.eth" */
interface SimpleStorage_Mutation_Input_setData extends Record<string, unknown> {
  address: Types.String;
  value: Types.UInt32;
  connection?: Types.SimpleStorage_Ethereum_Connection | null;
}

/* URI: "ens/simple-storage.eth" */
interface SimpleStorage_Mutation_Input_deployContract extends Record<string, unknown> {
  connection?: Types.SimpleStorage_Ethereum_Connection | null;
}

/* URI: "ens/simple-storage.eth" */
export const SimpleStorage_Mutation = {
  setData: async (
    input: SimpleStorage_Mutation_Input_setData,
    client: Client,
    uri: string = "ens/simple-storage.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "mutation",
      method: "setData",
      input
    });
  },

  deployContract: async (
    input: SimpleStorage_Mutation_Input_deployContract,
    client: Client,
    uri: string = "ens/simple-storage.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "mutation",
      method: "deployContract",
      input
    });
  }
}

/* URI: "ens/simple-storage.eth" */
interface SimpleStorage_Query_Input_getData extends Record<string, unknown> {
  address: Types.String;
  connection?: Types.SimpleStorage_Ethereum_Connection | null;
}

/* URI: "ens/simple-storage.eth" */
export const SimpleStorage_Query = {
  getData: async (
    input: SimpleStorage_Query_Input_getData,
    client: Client,
    uri: string = "ens/simple-storage.eth"
  ): Promise<InvokeApiResult<Types.Int>> => {
    return client.invoke<Types.Int>({
      uri,
      module: "query",
      method: "getData",
      input
    });
  }
}

/// Imported Queries END ///
