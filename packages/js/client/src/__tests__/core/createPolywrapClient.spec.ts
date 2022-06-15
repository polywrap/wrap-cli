import { createWeb3ApiClient, PluginConfigs } from "../../createPolywrapClient";

describe("createWeb3ApiClient", () => {
  it("Should throw because the plugin requested it's not installed ", async () => {
    const clientParams = {
      nonExistantPlugin: {
        provider: "none",
      },
    } as PluginConfigs;
  
    await expect(createWeb3ApiClient(clientParams)).rejects.toThrow(
      "Requested plugin \"nonExistantPlugin\" is not a supported createWeb3ApiClient plugin."
    );
  });
});
