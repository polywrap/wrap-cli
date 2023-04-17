import {
  Uri,
  UriResolutionContext,
} from "@polywrap/core-js";
import { expectHistory } from "../helpers/expectHistory";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { RedirectResolver } from "../../redirects";

jest.setTimeout(20000);

describe("RedirectResolver", () => {
  it("can redirect a URI", async () => {
    const uri = new Uri("test/from");

    const client = new PolywrapCoreClient({
      resolver: new RedirectResolver(
        Uri.from("test/from"),
        Uri.from("test/to"),
      )
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "redirect-resolver",
      "can-redirect-a-uri",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/to");
  });

  it("does not redirect a URI when not a match", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      resolver: new RedirectResolver(
        Uri.from("test/from"),
        Uri.from("test/to"),
      )
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "redirect-resolver",
      "not-a-match",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/not-a-match");
  });
});
