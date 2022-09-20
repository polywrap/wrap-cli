import { PolywrapClient } from "@polywrap/client-js";
import { randomPlugin } from "../";

describe("e2e", () => {

  let client: PolywrapClient;
  const uri = "ens/randomplugin.eth";

  const buffersEqual = (a: Uint8Array, b: Uint8Array): boolean => {
    if (a.byteLength !== b.byteLength) {
      return false;
    }
    for (let i = 0; i < a.byteLength; ++i) {
      if (a.at(i) !== b.at(i)) {
        return false;
      }
    }
    return true;
  }

  beforeAll(() => {
    client = new PolywrapClient({
      plugins: [
        {
          uri: uri,
          plugin: randomPlugin({})
        }
      ]
    });
  });

  it("getRandom", async () => {
    const result2A = await client.invoke<Uint8Array>({
      uri,
      method: "getRandom",
      args: {
        len: 2
      },
    });
    const result2B = await client.invoke<Uint8Array>({
      uri,
      method: "getRandom",
      args: {
        len: 2
      },
    });

    expect(result2A.data).toBeTruthy();
    expect(result2A.data instanceof Uint8Array).toBeTruthy();
    expect(result2A.data?.byteLength).toEqual(2);
    expect(result2B.data).toBeTruthy();
    expect(result2B.data instanceof Uint8Array).toBeTruthy();
    expect(result2B.data?.byteLength).toEqual(2);
    if (result2A.data && result2B.data)
      expect(buffersEqual(result2A.data, result2B.data)).toBeFalsy();

    const result16A = await client.invoke<Uint8Array>({
      uri,
      method: "getRandom",
      args: {
        len: 16
      },
    });
    const result16B = await client.invoke<Uint8Array>({
      uri,
      method: "getRandom",
      args: {
        len: 16
      },
    });

    expect(result16A.data).toBeTruthy();
    expect(result16A.data instanceof Uint8Array).toBeTruthy();
    expect(result16A.data?.byteLength).toEqual(16);
    expect(result16B.data).toBeTruthy();
    expect(result16B.data instanceof Uint8Array).toBeTruthy();
    expect(result16B.data?.byteLength).toEqual(16);
    if (result16A.data && result16B.data)
      expect(buffersEqual(result16A.data, result16B.data)).toBeFalsy();
  });
});
