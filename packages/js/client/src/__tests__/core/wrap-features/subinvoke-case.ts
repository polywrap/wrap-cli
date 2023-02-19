import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PolywrapClient } from "../../../PolywrapClient";

export const subinvokeCase = (implementation: string) => {
  describe("wrapper subinvocation", () => {
    test(implementation, async () => {
      const subinvokeUri = `file/${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/${implementation}`;
      const wrapperUri = `file/${GetPathToTestWrappers()}/subinvoke/01-invoke/implementations/${implementation}`;

      const builder = new ClientConfigBuilder();
      builder.addDefaults().addRedirect("ens/imported-subinvoke.eth", subinvokeUri);

      const client = new PolywrapClient(builder.build());

      const response = await client.invoke({
        uri: wrapperUri,
        method: "addAndIncrement",
        args: {
          a: 1,
          b: 1,
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeTruthy();
      expect(response.value).toEqual(3);
    });
  });
};
