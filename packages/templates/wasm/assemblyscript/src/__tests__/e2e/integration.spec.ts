import { PolywrapClient } from "@polywrap/client-js";
import * as App from "../types/wrap";
import path from "path";

jest.setTimeout(60000);

describe("JSON RPC Wasm Wrapper (Rust)", () => {

  const client: PolywrapClient = new PolywrapClient();
  let wrapperUri: string;

  beforeAll(() => {
    const dirname: string = path.resolve(__dirname);
    const wrapperPath: string = path.join(dirname, "..", "..", "..");
    wrapperUri = `fs/${wrapperPath}/build`;
  })

  it("calls simpleMethod", async () => {
    const expected: string = "polywrap";

    const { data, error } = await client.invoke<App.Template_SimpleResult>({
      uri: wrapperUri,
      method: "simpleMethod",
      args: { arg: expected }
    });

    expect(error).toBeFalsy();
    expect(data?.value).toEqual(expected);
  });
});
