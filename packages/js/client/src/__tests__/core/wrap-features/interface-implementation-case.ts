import { ExtendableUriResolver, Uri, PolywrapClient } from "../../../index";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { UriResolver } from "@polywrap/uri-resolvers-js";
import { mockPluginRegistration } from "../../helpers";
import { GetPathToTestWrappers } from "@polywrap/test-cases";

jest.setTimeout(200000);

export const interfaceInvokeCase = (implementation: string) => {
  describe("interface invoke", () => {
    test(`invoke wrappers ${implementation}`, async () => {
      const interfaceUri = "wrap://ens/interface.eth";
      const implementationPath = `${GetPathToTestWrappers()}/interface-invoke/01-implementation/implementations/${implementation}`;
      const implementationUri = `fs/${implementationPath}`;

      const config = new ClientConfigBuilder()
        .addDefaults()
        .addInterfaceImplementation(interfaceUri, implementationUri);
      const client = new PolywrapClient(config.build());

      const wrapperPath = `${GetPathToTestWrappers()}/interface-invoke/02-wrapper/implementations/${implementation}`;
      const wrapperUri = `fs/${wrapperPath}`;

      const result = await client.invoke({
        uri: wrapperUri,
        method: "moduleMethod",
        args: {
          arg: {
            uint8: 1,
            str: "Test String 1",
          },
        },
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toBeTruthy();
      expect(result.value).toEqual({
        uint8: 1,
        str: "Test String 1",
      });
    });
  });

  describe("interface-implementations", () => {
    it("should register interface implementations successfully", async () => {
      const interfaceUri = Uri.from("wrap://ens/some-interface1.eth");
      const implementation1Uri = Uri.from(
        "wrap://ens/some-implementation1.eth"
      );
      const implementation2Uri = Uri.from(
        "wrap://ens/some-implementation2.eth"
      );

      const client = new PolywrapClient({
        interfaces: [
          {
            interface: interfaceUri,
            implementations: [implementation1Uri, implementation2Uri],
          },
        ],
        resolver: UriResolver.from({
          from: Uri.from("uri/foo"),
          to: Uri.from("uri/bar"),
        }),
      });

      const interfaces = client.getInterfaces();

      expect(interfaces).toEqual([
        {
          interface: interfaceUri,
          implementations: [implementation1Uri, implementation2Uri],
        },
      ]);

      const implementations = await client.getImplementations(interfaceUri, {
        applyResolution: false,
      });

      if (!implementations.ok) fail(implementations.error);
      expect(implementations.value).toEqual([
        implementation1Uri,
        implementation2Uri,
      ]);
    });

    it("should get all implementations of interface", async () => {
      const interface1Uri = Uri.from("wrap://ens/some-interface1.eth");
      const interface2Uri = Uri.from("wrap://ens/some-interface2.eth");
      const interface3Uri = Uri.from("wrap://ens/some-interface3.eth");

      const implementation1Uri = Uri.from("wrap://ens/some-implementation.eth");
      const implementation2Uri = Uri.from(
        "wrap://ens/some-implementation2.eth"
      );
      const implementation3Uri = Uri.from(
        "wrap://ens/some-implementation3.eth"
      );
      const implementation4Uri = Uri.from(
        "wrap://ens/some-implementation4.eth"
      );

      const client = new PolywrapClient({
        resolver: UriResolver.from([
          {
            from: interface1Uri,
            to: interface2Uri,
          },
          {
            from: implementation1Uri,
            to: implementation2Uri,
          },
          {
            from: implementation2Uri,
            to: implementation3Uri,
          },
          mockPluginRegistration(implementation4Uri),
        ]),
        interfaces: [
          {
            interface: interface1Uri,
            implementations: [implementation1Uri, implementation2Uri],
          },
          {
            interface: interface2Uri,
            implementations: [implementation3Uri],
          },
          {
            interface: interface3Uri,
            implementations: [implementation3Uri, implementation4Uri],
          },
        ],
      });

      const implementations1 = await client.getImplementations(interface1Uri, {
        applyResolution: true,
      });
      const implementations2 = await client.getImplementations(interface2Uri, {
        applyResolution: true,
      });
      const implementations3 = await client.getImplementations(interface3Uri, {
        applyResolution: true,
      });

      if (!implementations1.ok) fail(implementations1.error);
      expect(implementations1.value).toEqual([
        implementation1Uri,
        implementation2Uri,
        implementation3Uri,
      ]);

      if (!implementations2.ok) fail(implementations2.error);
      expect(implementations2.value).toEqual([
        implementation1Uri,
        implementation2Uri,
        implementation3Uri,
      ]);

      if (!implementations3.ok) fail(implementations3.error);
      expect(implementations3.value).toEqual([
        implementation3Uri,
        implementation4Uri,
      ]);
    });

    it("should merge user-defined interface implementations with each other", async () => {
      const interfaceUri = Uri.from("wrap://ens/interface.eth");
      const implementationUri1 = Uri.from("wrap://ens/implementation1.eth");
      const implementationUri2 = Uri.from("wrap://ens/implementation2.eth");

      const config = new ClientConfigBuilder()
        .addDefaults()
        .addInterfaceImplementations(interfaceUri.uri, [
          implementationUri1.uri,
          implementationUri2.uri,
        ])
        .build();

      const client = new PolywrapClient(config);

      const interfaces = (client.getInterfaces() || []).filter(
        (x) => x.interface.uri === interfaceUri.uri
      );
      expect(interfaces.length).toEqual(1);

      const implementationUris = interfaces[0].implementations;

      expect(implementationUris).toEqual([
        implementationUri1,
        implementationUri2,
      ]);
    });

    it("should merge user-defined interface implementations with defaults", async () => {
      const interfaceUri = ExtendableUriResolver.defaultExtInterfaceUris[0];
      const implementationUri1 = Uri.from("wrap://ens/implementation1.eth");
      const implementationUri2 = Uri.from("wrap://ens/implementation2.eth");

      const config = new ClientConfigBuilder()
        .addDefaults()
        .addInterfaceImplementations(interfaceUri.uri, [
          implementationUri1.uri,
          implementationUri2.uri,
        ])
        .build();

      const client = new PolywrapClient(config);

      const interfaces = (client.getInterfaces() || []).filter(
        (x) => x.interface.uri === interfaceUri.uri
      );
      expect(interfaces.length).toEqual(1);

      const implementationUris = interfaces[0].implementations;

      const builder = new ClientConfigBuilder();
      const defaultClientConfig = builder.addDefaults().build();

      expect(implementationUris).toEqual([
        ...(defaultClientConfig.interfaces || []).find(
          (x) => x.interface.uri === interfaceUri.uri
        )!.implementations,
        implementationUri1,
        implementationUri2,
      ]);
    });

    test("get implementations - do not return plugins that are not explicitly registered", async () => {
      const interfaceUri = Uri.from("wrap://ens/some-interface.eth");

      const implementation1Uri = Uri.from(
        "wrap://ens/some-implementation1.eth"
      );
      const implementation2Uri = Uri.from(
        "wrap://ens/some-implementation2.eth"
      );

      const client = new PolywrapClient({
        resolver: UriResolver.from([
          mockPluginRegistration(implementation1Uri),
        ]),
        interfaces: [
          {
            interface: interfaceUri,
            implementations: [implementation2Uri],
          },
        ],
      });

      const getImplementationsResult = await client.getImplementations(
        interfaceUri,
        { applyResolution: true }
      );

      if (!getImplementationsResult.ok) fail(getImplementationsResult.error);
      expect(getImplementationsResult.value).toEqual([implementation2Uri]);
    });

    test("get implementations - return implementations for plugins which don't have interface stated in manifest", async () => {
      const interfaceUri = Uri.from("wrap://ens/some-interface.eth");

      const implementation1Uri = Uri.from(
        "wrap://ens/some-implementation1.eth"
      );
      const implementation2Uri = Uri.from(
        "wrap://ens/some-implementation2.eth"
      );

      const client = new PolywrapClient({
        resolver: UriResolver.from([
          mockPluginRegistration(implementation1Uri),
        ]),
        interfaces: [
          {
            interface: interfaceUri,
            implementations: [implementation1Uri, implementation2Uri],
          },
        ],
      });

      const getImplementationsResult = await client.getImplementations(
        interfaceUri,
        { applyResolution: true }
      );

      if (!getImplementationsResult.ok) fail(getImplementationsResult.error);
      expect(getImplementationsResult.value).toEqual([
        implementation1Uri,
        implementation2Uri,
      ]);
    });

    test("getImplementations - pass string or Uri", async () => {
      const oldInterfaceUri = Uri.from("ens/old.eth");
      const newInterfaceUri = Uri.from("ens/new.eth");

      const implementation1Uri = Uri.from(
        "wrap://ens/some-implementation1.eth"
      );
      const implementation2Uri = Uri.from(
        "wrap://ens/some-implementation2.eth"
      );

      const config = new ClientConfigBuilder()
        .addDefaults()
        .addRedirect(oldInterfaceUri.uri, newInterfaceUri.uri)
        .addInterfaceImplementation(oldInterfaceUri.uri, implementation1Uri.uri)
        .addInterfaceImplementation(newInterfaceUri.uri, implementation2Uri.uri)
        .build();

      const client = new PolywrapClient(config);

      let result = await client.getImplementations(oldInterfaceUri, {
        applyResolution: false,
      });
      if (!result.ok) fail(result.error);
      expect(result.value).toEqual([implementation1Uri]);

      result = await client.getImplementations(oldInterfaceUri, {
        applyResolution: true,
      });
      if (!result.ok) fail(result.error);
      expect(result.value).toEqual([implementation1Uri, implementation2Uri]);

      let result2 = await client.getImplementations(oldInterfaceUri, {
        applyResolution: false,
      });
      if (!result2.ok) fail(result2.error);
      expect(result2.value).toEqual([implementation1Uri]);

      result2 = await client.getImplementations(oldInterfaceUri, {
        applyResolution: true,
      });
      if (!result2.ok) fail(result2.error);
      expect(result2.value).toEqual([implementation1Uri, implementation2Uri]);
    });
  });
};
