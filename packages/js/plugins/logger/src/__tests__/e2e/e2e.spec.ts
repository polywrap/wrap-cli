import { Web3ApiClient } from "@web3api/client-js"
import { loggerPlugin, LogLevel } from "../..";

describe("log method", () => {

  it("logs to console appropriate level", async () => {
    const web3ApiClient = new Web3ApiClient({
      redirects: [
        {
          from: "w3://w3/logger",
          to: loggerPlugin(),
        }
      ]
    })

    const response = await web3ApiClient.query<{ log: boolean }>({
      uri: "w3://w3/logger",
      query: `
        query {
          log(
            level: ${LogLevel.DEBUG}
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
