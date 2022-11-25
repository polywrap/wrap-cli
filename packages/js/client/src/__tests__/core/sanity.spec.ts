import { coreInterfaceUris } from "@polywrap/core-js";
import { Uri } from "../..";
import { PolywrapClient } from "../../PolywrapClient";

jest.setTimeout(200000);

describe("sanity", () => {
  test("default client config", () => {
    const client = new PolywrapClient();

    new Uri("wrap://ens/http-resolver.polywrap.eth"),
      expect(client.getInterfaces()).toStrictEqual([
        {
          interface: coreInterfaceUris.uriResolver,
          implementations: [
            new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
            new Uri("wrap://ens/ens-resolver.polywrap.eth"),
            new Uri("wrap://ens/fs-resolver.polywrap.eth"),
            new Uri("wrap://ens/http-resolver.polywrap.eth"),
            new Uri("wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY"),
          ],
        },
        {
          interface: coreInterfaceUris.logger,
          implementations: [new Uri("wrap://ens/js-logger.polywrap.eth")],
        },
      ]);
  });
});
