export * from "./fetch";
export * from "./token";
export * from "./pair";
export * from "./route";
export * from "./trade";
export * from "./router";

// TODO: make sure differing token decimals work out when testing

// constants ///////////////////////////////////////////////////////////////////

export const factoryAddress: () => string = () =>
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
export const initCodeHash: () => string = () => "";
export const minimumLiquidity: () => u32 = () => <u32>1000;
