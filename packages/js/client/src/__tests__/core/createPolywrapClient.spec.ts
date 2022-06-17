import { createPolywrapClient, PluginConfigs } from "../../createPolywrapClient";

describe("createPolywrapClient", () => {
  it("Should throw because the plugin requested it's not installed ", async () => {
    const clientParams = {
      nonExistantPlugin: {
        provider: "none",
      },
    } as PluginConfigs;
  
    await expect(createPolywrapClient(clientParams)).rejects.toThrow(
      "Requested plugin \"nonExistantPlugin\" is not a supported createPolywrapClient plugin."
    );
  });
});
