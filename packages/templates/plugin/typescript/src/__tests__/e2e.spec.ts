import { PolywrapClient } from "@polywrap/client-js";
import { samplePlugin } from "../";

describe("e2e", () => {

  let client: PolywrapClient;
  const uri = "ens/sampleplugin.eth";

  beforeAll(() => {
    // Add the samplePlugin to the PolywrapClient
    client = new PolywrapClient({
      plugins: [
        {
          uri: uri,
          plugin: samplePlugin({
            defaultValue: "foo bar"
          })
        }
      ]
    });
  });

  it("sampleMethod", async () => {
    const result = await client.invoke({
      uri,
      method: "sampleMethod",
      args: {
        data: "fuz baz "
      },
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data).toBe("fuz baz foo bar");
  });
});
