import {
  MaybeAsync,
  executeMaybeAsyncFunction,
  isPromise,
} from "..";

class ClassInstance {
  constructor(private _prop: string) {}

  normalMethod(arg: string): string {
    return this._prop + arg;
  }

  async asyncMethod(arg: string): Promise<string> {
    await new Promise((resolve) =>
      setTimeout(resolve, 200)
    );

    return this._prop + arg;
  }
}

describe("MaybeAsync", () => {
  const promise: MaybeAsync<string> =
    new Promise<string>((resolve, reject) => { return "" });
  const testFunction = (args: unknown[]) => { return "foo" };
  const testFunctionReturnPromise = (args: unknown[]) => new Promise<string>((resolve) => { resolve("foo") });

  it("sanity", async () => {
    expect(isPromise(promise)).toBe(true);
    expect(await executeMaybeAsyncFunction(testFunction)).toBe("foo");
    expect(await executeMaybeAsyncFunction(testFunctionReturnPromise)).toBe("foo");
  });

  it("works with class instances", async () => {
    const instance = new ClassInstance("bar");
    expect(await executeMaybeAsyncFunction(instance.normalMethod.bind(instance, "foo"))).toBe("barfoo")
    expect(await executeMaybeAsyncFunction(instance.asyncMethod.bind(instance, "foo"))).toBe("barfoo")
  })
});
