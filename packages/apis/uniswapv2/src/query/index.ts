export * from "./fetch";
export * from "./token";
export * from "./pair";
export * from "./route";
export * from "./trade";
export * from "./router";

// constants ///////////////////////////////////////////////////////////////////

export const factoryAddress: () => string = () =>
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
export const initCodeHash: () => string = () =>
  "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f";
export const minimumLiquidity: () => u32 = () => <u32>1000;
