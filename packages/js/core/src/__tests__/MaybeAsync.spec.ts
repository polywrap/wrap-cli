import { MaybeAsync, isPromise } from "..";

interface IClassInterface {
  normalMethod(arg: string): MaybeAsync<string>;
  asyncMethod(arg: string): MaybeAsync<string>;
}

class ClassInstance implements IClassInterface {
  constructor(private _prop: string) {}

  normalMethod(arg: string): string {
    return this._prop + arg;
  }

  async asyncMethod(arg: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return this._prop + arg;
  }
}

describe("MaybeAsync", () => {
  const testFunction = (): MaybeAsync<string> => {
    return "foo";
  };
  const testFunctionReturnPromise = (): MaybeAsync<string> =>
    new Promise<string>((resolve) => {
      resolve("foo");
    });

  it("sanity", async () => {
    expect(await testFunction()).toBe("foo");
    expect(await testFunctionReturnPromise()).toBe("foo");
  });

  it("works with class instances", async () => {
    const instance: IClassInterface = new ClassInstance("bar");
    expect(await instance.normalMethod("foo")).toBe("barfoo");
    expect(await instance.asyncMethod("foo")).toBe("barfoo");
  });
});
