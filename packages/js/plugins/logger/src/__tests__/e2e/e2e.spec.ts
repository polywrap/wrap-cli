import { Web3ApiClient } from "@web3api/client-js"
import { Uri } from "@web3api/core-js"
import { LoggerPlugin, LogLevel } from "../..";

describe("log method", () => {

  it("logs to console appropriate level", async () => {
    const web3ApiClient = new Web3ApiClient({
      redirects: [
        {
          from: new Uri("w3://w3/logger"),
          to: {
            factory: () => new LoggerPlugin(),
            manifest: LoggerPlugin.manifest(),
          },
        },
      ]
    })

    const response = await web3ApiClient.query<{ log: boolean }>({
      uri: new Uri("w3://w3/logger"),
      query: `
        query {
          log(
            logLevel: ${LogLevel.DEBUG}
            message: "Test message"
          )
        }
      `
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.log).toBe(true);
  });
});
