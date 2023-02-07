import { UriResolutionContext } from "@polywrap/core-js";
import { expectHistory, mockPluginRegistration } from "./helpers";
import { ClientConfigBuilder, PolywrapClient } from "@polywrap/client-js";
import { RecursiveResolver, InterfaceRedirectResolver } from "../../build";

jest.setTimeout(200000);

const getClientWithInterfaceRedirectResolver = (interfaceUri: string, packageUri: string): PolywrapClient => {
  const resolver = RecursiveResolver.from([
    mockPluginRegistration(packageUri),
    new InterfaceRedirectResolver(),
  ]);

  const config = new ClientConfigBuilder()
    .addInterfaceImplementations(
      interfaceUri,
      [packageUri]
    )
    .build({ resolver });

  return new PolywrapClient(config, { noDefaults: true });
};

describe("InterfaceRedirectResolver", () => {

  it("redirects from interface uri to implementation", async () => {
    const interfaceUri = "wrap://ens/wrappers.polywrap.eth:uri-resolver-ext@1.1.0";
    const packageUri = "wrap://package/uri-resolver";
    const client = getClientWithInterfaceRedirectResolver(interfaceUri, packageUri);

    // resolve uri
    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri: interfaceUri, resolutionContext });

    if (!result.ok) throw result.error;

    await expectHistory(
      resolutionContext.getHistory(),
      "interface-to-implementation-redirect"
    );

    expect(result.value.type).toEqual("package");
    expect(result.value.uri.uri).toEqual(packageUri);
  });
});
