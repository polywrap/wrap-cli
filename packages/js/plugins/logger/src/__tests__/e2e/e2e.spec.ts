import { PolywrapClient } from "@polywrap/client-js";

describe("log method", () => {
  it("logs to console appropriate level", async () => {
    const polywrapClient = new PolywrapClient();

    const response = await polywrapClient.invoke<boolean>({
      uri: "wrap://ens/js-logger.polywrap.eth",
      method: "log",
      args: {
        level: "DEBUG",
        message: "Test message",
      },
    });

    expect(response.error).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data).toBe(true);
  });
});
