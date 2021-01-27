import {
  MaybeAsync,
  executeMaybeAsyncFunction,
  isPromise,
} from "..";

describe("MaybeAsync", () => {
  const promise: MaybeAsync<string> =
    new Promise<string>((resolve, reject) => { return "" });
  const testFunction = (args: unknown[]) => { return "" };
  const testFunctionReturnPromise = (args: unknown[]) => new Promise<string>((resolve, reject) => { return "" });

  it("sanity", () => {
    expect(isPromise(promise)).toBe(true);
    expect(executeMaybeAsyncFunction(testFunction)).toBeDefined();
    expect(executeMaybeAsyncFunction(testFunctionReturnPromise)).toBeDefined();
  });
});
