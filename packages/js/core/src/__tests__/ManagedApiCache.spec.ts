import { Api, ManagedApiCache, Client, InvokeApiOptions, InvokeApiResult } from "../types";

class TestApi extends Api {
  async invoke(
    options: InvokeApiOptions,
    client: Client
  ): Promise<InvokeApiResult<unknown>> {
    return {};
  }
  async getSchema(client: Client): Promise<string> {
    return "";
  }
}

describe("ManagedApiCache (cache garbage collection)", () => {

  it("maxWrappers: limits max wrappers according to config", () => {
    const apiCache: ManagedApiCache = new ManagedApiCache({ maxWrappers: 3 });
    for (let i = 0; i < 4; i++) {
      apiCache.set(`${i}`, new TestApi());
    }
    expect(apiCache.cache.size).toEqual(3);

    apiCache.config = { maxWrappers: 5 }
    for (let i = 4; i < 8; i++) {
      apiCache.set(`${i}`, new TestApi());
    }
    expect(apiCache.cache.size).toEqual(5);
  });

  it("maxWrappers: drops wrapper queried least recently", () => {
    const apiCache: ManagedApiCache = new ManagedApiCache({ maxWrappers: 3 });
    apiCache.set("0", new TestApi());
    apiCache.set("1", new TestApi());
    apiCache.set("2", new TestApi());
    apiCache.get("0");
    apiCache.get("1");
    apiCache.set("3", new TestApi());
    expect(apiCache.cache.size).toEqual(3);
    expect(apiCache.get("0")).toBeTruthy();
    expect(apiCache.get("1")).toBeTruthy();
    expect(apiCache.get("2")).toEqual(undefined);
    expect(apiCache.get("3")).toBeTruthy();
  });

  it("staleThreshold: drops stale wrappers according to config", () => {
    const apiCache: ManagedApiCache = new ManagedApiCache({ staleThreshold: 4 });
    for (let i = 0; i < 4; i++) {
      apiCache.set(`${i}`, new TestApi());
    }
    expect(apiCache.cache.size).toEqual(4);
    apiCache.get("0");
    apiCache.get("1");
    apiCache.get("2");
    expect(apiCache.cache.size).toEqual(4);
    apiCache.get("2");
    expect(apiCache.cache.size).toEqual(3);
    expect(apiCache.get("3")).toEqual(undefined);
    apiCache.get("2");
    expect(apiCache.cache.size).toEqual(2);
    expect(apiCache.get("0")).toEqual(undefined);
    expect(apiCache.get("1")).toBeTruthy();
    expect(apiCache.get("2")).toBeTruthy();
  });

});