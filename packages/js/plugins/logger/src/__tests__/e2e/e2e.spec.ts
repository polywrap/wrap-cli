import { PolywrapClient } from "@polywrap/client-js";

describe("log method", () => {

  it("logs to console appropriate level", async () => {
    const polywrapClient = new PolywrapClient()

    const response = await polywrapClient.query<{ log: boolean }>({
      uri: "wrap://ens/js-logger.polywrap.eth",
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
