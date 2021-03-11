import { createWeb3ApiClient } from "../createWeb3ApiClient";

import { clientTestEnv } from "@web3api/client-test-env";

it("Should throw because the plugin requested it's not installed ", async () => {
  const clientParams = {
    ...clientTestEnv,
    nonExistantPlugin: {
      from: "none",
      provider: "none",
    },
  };

  await expect(createWeb3ApiClient(clientParams)).rejects.toThrow(
    "You must install @web3api/nonExistantPlugin-plugin-js into your project in order to use it"
  );
});
