import { Nullable } from "@web3api/wasm-as";

export * from "./fetch";
export * from "./token";
export * from "./pair";
export * from "./route";

// TODO: write bignumber class? Need u256 solution
// TODO: review functions for potential overflow errors; write safemath utils for assemblyscript?
// TODO: make sure differing token decimals work out when testing

// constants ///////////////////////////////////////////////////////////////////

export const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
export const MINIMUM_LIQUIDITY: i32 = 10 ** 3;

// TODO: it won't build without these. Why?
export const factoryAddress: () => string = () => "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
export const initCodeHash: () => string = () => "";
export const minimumLiquidity: () => Nullable<u32> = () => Nullable.fromValue(<u32>1000);
