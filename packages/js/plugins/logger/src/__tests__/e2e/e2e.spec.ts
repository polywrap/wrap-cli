import { Web3ApiClient } from "@web3api/client-js";

describe("log method", () => {

  it("logs to console appropriate level", async () => {
    const web3ApiClient = new Web3ApiClient()

    const response = await web3ApiClient.query<{ log: boolean }>({
      uri: "w3://ens/js-logger.web3api.eth",
      query: `
        query {
          log(
            level: DEBUG
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
