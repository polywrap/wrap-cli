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

    if (!response.ok) fail(response.error);
    expect(response.value).toBeDefined();
    expect(response.value).toBe(true);
  });
});
