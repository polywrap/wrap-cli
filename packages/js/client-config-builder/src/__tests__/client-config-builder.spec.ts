import { ClientConfigBuilder } from "../ClientConfigBuilder";
import {
  CoreClient,
  Uri,
  IUriResolver,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";
import { builtDefaultConfig } from "./builtDefaultConfig";

class NamedUriResolver implements IUriResolver {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }
  get name(): string {
    return this._name;
  }
  tryResolveUri(
    uri: Uri,
    client: CoreClient
  ): Promise<Result<UriPackageOrWrapper>> {
    throw new Error("Method not implemented.");
  }
}

describe("Client config builder", () => {
  const testEnv1: Record<string, Record<string, unknown>> = {
    "wrap://ens/test.plugin.one": { test: "value" },
  };

  const testEnv2: Record<string, Record<string, unknown>> = {
    "wrap://ens/test.plugin.two": { test: "value" },
  };

  const testInterface1: Record<string, Set<string>> = {
    "wrap://ens/test-interface-1.polywrap.eth": new Set([
      "wrap://ens/test1.polywrap.eth",
    ]),
  };

  const testInterface2: Record<string, Set<string>> = {
    "wrap://ens/test-interface-2.polywrap.eth": new Set([
      "wrap://ens/test2.polywrap.eth",
    ]),
  };

  const testUriRedirect1 = {
    "wrap://ens/test-one.polywrap.eth": "wrap://ens/test1.polywrap.eth",
  };

  const testUriRedirect2 = {
    "wrap://ens/test-two.polywrap.eth": "wrap://ens/test2.polywrap.eth",
  };

  const testEnvs: Record<string, Record<string, unknown>> = {
    ...testEnv1,
    ...testEnv2,
  };

  const testInterfaces: Record<string, Set<string>> = {
    ...testInterface1,
    ...testInterface2,
  };

  const testUriRedirects = {
    ...testUriRedirect1,
    ...testUriRedirect2,
  };

  const testUriResolver: IUriResolver = new NamedUriResolver("test1");

  it("should build an empty partial config", () => {
    const clientConfig = new ClientConfigBuilder().build();

    expect(clientConfig).toStrictEqual({
      envs: [],
      interfaces: [],
      redirects: [],
      wrappers: [],
      packages: [],
      resolvers: [],
    });
  });

  it("should succesfully add config object and build", () => {
    const clientConfig = new ClientConfigBuilder()
      .add({
        envs: testEnvs,
        interfaces: testInterfaces,
        redirects: testUriRedirects,
        resolvers: [testUriResolver],
      })
      .build();

    expect(clientConfig).toBeTruthy();
    expect(clientConfig.envs).toStrictEqual(
      Object.entries(testEnvs).map(([uri, env]) => ({
        uri: Uri.from(uri),
        env: env,
      }))
    );
    expect(clientConfig.interfaces).toStrictEqual(
      Object.entries(testInterfaces).map(([uri, interfaces]) => ({
        interface: Uri.from(uri),
        implementations: Array.from(interfaces).map(Uri.from),
      }))
    );
    expect(clientConfig.redirects).toStrictEqual(
      Object.entries(testUriRedirects).map(([from, to]) => ({
        from: Uri.from(from),
        to: Uri.from(to),
      }))
    );
    expect(clientConfig.resolvers).toStrictEqual([testUriResolver]);
  });

  it("should succesfully add and merge two config objects and build", () => {
    const clientConfig = new ClientConfigBuilder()
      .add({
        envs: testEnv1,
        interfaces: testInterface1,
        redirects: testUriRedirect1,
        resolvers: [testUriResolver],
      })
      .add({
        envs: testEnv2,
        interfaces: testInterface2,
        redirects: testUriRedirect2,
      })
      .build();

    expect(clientConfig).toBeTruthy();
    expect(clientConfig.envs).toStrictEqual(
      Object.entries(testEnvs).map(([uri, env]) => ({
        uri: Uri.from(uri),
        env: env,
      }))
    );
    expect(clientConfig.interfaces).toStrictEqual(
      Object.entries(testInterfaces).map(([uri, interfaces]) => ({
        interface: Uri.from(uri),
        implementations: Array.from(interfaces).map(Uri.from),
      }))
    );
    expect(clientConfig.redirects).toStrictEqual(
      Object.entries(testUriRedirects).map(([from, to]) => ({
        from: Uri.from(from),
        to: Uri.from(to),
      }))
    );
    expect(clientConfig.resolvers).toStrictEqual([testUriResolver]);
  });

  it("should successfully add the default config", () => {
    const clientConfig = new ClientConfigBuilder().addDefaults().build();

    const expectedConfig = builtDefaultConfig();

    expect(clientConfig).toBeTruthy();
    expect(clientConfig.envs).toStrictEqual(expectedConfig.envs);
    expect(clientConfig.interfaces).toStrictEqual(expectedConfig.interfaces);
    expect(clientConfig.redirects).toStrictEqual(expectedConfig.redirects);
    expect(clientConfig.resolvers).toStrictEqual(expectedConfig.resolvers);
  });

  it("should successfully add an env", () => {
    const envUri = "wrap://ens/some-plugin.polywrap.eth";
    const env = {
      foo: "bar",
      baz: {
        biz: "buz",
      },
    };

    const config = new ClientConfigBuilder().addEnv(envUri, env).build();

    if (!config.envs || config.envs.length !== 1) {
      fail(["Expected 1 env, received:", config.envs]);
    }

    expect(config.envs[0].uri).toStrictEqual(Uri.from(envUri));
    expect(config.envs[0].env).toStrictEqual(env);
  });

  it("should successfully add to an existing env", () => {
    const envUri = "wrap://ens/some-plugin.polywrap.eth";
    const env1 = {
      foo: "bar",
    };
    const env2 = {
      baz: {
        biz: "buz",
      },
    };

    const config = new ClientConfigBuilder()
      .addEnv(envUri, env1)
      .addEnv(envUri, env2)
      .build();

    const expectedEnv = { ...env1, ...env2 };

    if (!config.envs || config.envs.length !== 1) {
      fail(["Expected 1 env, received:", config.envs]);
    }

    expect(config.envs[0].uri).toStrictEqual(Uri.from(envUri));
    expect(config.envs[0].env).toStrictEqual(expectedEnv);
  });

  it("should succesfully add two separate envs", () => {
    const config = new ClientConfigBuilder()
      .addEnv(Object.keys(testEnvs)[0], Object.values(testEnvs)[0])
      .addEnv(Object.keys(testEnvs)[1], Object.values(testEnvs)[1])
      .build();

    if (!config.envs || config.envs.length !== 2) {
      fail(["Expected 2 envs, received:", config.envs]);
    }

    expect(config.envs).toContainEqual({
      uri: Uri.from(Object.keys(testEnvs)[0]),
      env: Object.values(testEnvs)[0],
    });
    expect(config.envs).toContainEqual({
      uri: Uri.from(Object.keys(testEnvs)[1]),
      env: Object.values(testEnvs)[1],
    });
  });

  it("should remove an env", () => {
    const config = new ClientConfigBuilder()
      .addEnv(Object.keys(testEnvs)[0], Object.values(testEnvs)[0])
      .addEnv(Object.keys(testEnvs)[1], Object.values(testEnvs)[1])
      .removeEnv(Object.keys(testEnvs)[0])
      .build();

    if (!config.envs || config.envs.length !== 1) {
      fail(["Expected 1 env, received:", config.envs]);
    }

    expect(config.envs).toContainEqual({
      uri: Uri.from(Object.keys(testEnvs)[1]),
      env: Object.values(testEnvs)[1],
    });
  });

  it("should set an env", () => {
    const envUri = "wrap://ens/some.plugin.eth";

    const env = {
      foo: "bar",
    };

    const config = new ClientConfigBuilder().setEnv(envUri, env).build();

    if (!config.envs || config.envs.length !== 1) {
      fail(["Expected 1 env, received:", config.envs]);
    }

    expect(config.envs[0]).toEqual({
      uri: Uri.from(envUri),
      env: env,
    });
  });

  it("should set an env over an existing env", () => {
    const envUri = "wrap://ens/some.plugin.eth";

    const env1 = {
      foo: "bar",
    };
    const env2 = {
      bar: "baz",
    };

    const config = new ClientConfigBuilder()
      .addEnv(envUri, env1)
      .setEnv(envUri, env2)
      .build();

    if (!config.envs || config.envs.length !== 1) {
      fail(["Expected 1 env, received:", config.envs]);
    }

    expect(config.envs[0]).toEqual({
      uri: Uri.from(envUri),
      env: env2,
    });
  });

  it("should add an interface implementation for a non-existent interface", () => {
    const interfaceUri = "wrap://ens/some.interface.eth";
    const implUri = "wrap://ens/interface.impl.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementation(interfaceUri, implUri)
      .build();

    if (!config.interfaces || config.interfaces.length !== 1) {
      fail(["Expected 1 interface, received:", config.interfaces]);
    }

    expect(config.interfaces[0]).toStrictEqual({
      interface: Uri.from(interfaceUri),
      implementations: [Uri.from(implUri)],
    });
  });

  it("should add an interface implementation for an interface that already exists", () => {
    const interfaceUri = "wrap://ens/some.interface.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementation(interfaceUri, implUri1)
      .addInterfaceImplementation(interfaceUri, implUri2)
      .build();

    if (!config.interfaces || config.interfaces.length !== 1) {
      fail(["Expected 1 interface, received:", config.interfaces]);
    }

    expect(config.interfaces[0].interface).toStrictEqual(
      Uri.from(interfaceUri)
    );
    expect(config.interfaces[0].implementations).toContainEqual(
      Uri.from(implUri1)
    );
    expect(config.interfaces[0].implementations).toContainEqual(
      Uri.from(implUri2)
    );
  });

  it("should add different implementations for different interfaces", () => {
    const interfaceUri1 = "wrap://ens/some.interface1.eth";
    const interfaceUri2 = "wrap://ens/some.interface2.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";
    const implUri3 = "wrap://ens/interface.impl3.eth";
    const implUri4 = "wrap://ens/interface.impl4.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementation(interfaceUri1, implUri1)
      .addInterfaceImplementation(interfaceUri2, implUri2)
      .addInterfaceImplementation(interfaceUri1, implUri3)
      .addInterfaceImplementation(interfaceUri2, implUri4)
      .build();

    if (!config.interfaces || config.interfaces.length !== 2) {
      fail(["Expected 2 interfaces, received:", config.interfaces]);
    }

    const interface1 = config.interfaces.find(
      (x) => x.interface.uri === interfaceUri1
    );
    const interface2 = config.interfaces.find(
      (x) => x.interface.uri === interfaceUri2
    );

    expect(interface1).toBeDefined();
    expect(interface1?.implementations).toHaveLength(2);
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri1));
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri3));

    expect(interface2).toBeDefined();
    expect(interface2?.implementations).toHaveLength(2);
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri2));
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri4));
  });

  it("should add multiple implementations for a non-existent interface", () => {
    const interfaceUri = "wrap://ens/some.interface.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementations(interfaceUri, [implUri1, implUri2])
      .build();

    if (!config.interfaces || config.interfaces.length !== 1) {
      fail(["Expected 1 interface, received:", config.interfaces]);
    }

    expect(config.interfaces[0].interface).toStrictEqual(
      Uri.from(interfaceUri)
    );
    expect(config.interfaces[0].implementations).toHaveLength(2);
    expect(config.interfaces[0].implementations).toContainEqual(
      Uri.from(implUri1)
    );
    expect(config.interfaces[0].implementations).toContainEqual(
      Uri.from(implUri2)
    );
  });

  it("should add multiple implementations for an existing interface", () => {
    const interfaceUri = "wrap://ens/some.interface.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";
    const implUri3 = "wrap://ens/interface.impl3.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementations(interfaceUri, [implUri1])
      .addInterfaceImplementations(interfaceUri, [implUri2, implUri3])
      .build();

    if (!config.interfaces || config.interfaces.length !== 1) {
      fail(["Expected 1 interface, received:", config.interfaces]);
    }

    expect(config.interfaces[0].interface).toStrictEqual(
      Uri.from(interfaceUri)
    );
    expect(config.interfaces[0].implementations).toHaveLength(3);
    expect(config.interfaces[0].implementations).toContainEqual(
      Uri.from(implUri1)
    );
    expect(config.interfaces[0].implementations).toContainEqual(
      Uri.from(implUri2)
    );
    expect(config.interfaces[0].implementations).toContainEqual(
      Uri.from(implUri3)
    );
  });

  it("should add multiple different implementations for different interfaces", () => {
    const interfaceUri1 = "wrap://ens/some.interface1.eth";
    const interfaceUri2 = "wrap://ens/some.interface2.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";
    const implUri3 = "wrap://ens/interface.impl3.eth";
    const implUri4 = "wrap://ens/interface.impl4.eth";
    const implUri5 = "wrap://ens/interface.impl5.eth";
    const implUri6 = "wrap://ens/interface.impl6.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementation(interfaceUri1, implUri1)
      .addInterfaceImplementation(interfaceUri2, implUri2)
      .addInterfaceImplementations(interfaceUri1, [implUri3, implUri5])
      .addInterfaceImplementations(interfaceUri2, [implUri4, implUri6])
      .build();

    if (!config.interfaces || config.interfaces.length !== 2) {
      fail(["Expected 2 interfaces, received:", config.interfaces]);
    }

    const interface1 = config.interfaces.find(
      (x) => x.interface.uri === interfaceUri1
    );
    const interface2 = config.interfaces.find(
      (x) => x.interface.uri === interfaceUri2
    );

    expect(interface1).toBeDefined();
    expect(interface1?.implementations).toHaveLength(3);
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri1));
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri3));
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri5));

    expect(interface2).toBeDefined();
    expect(interface2?.implementations).toHaveLength(3);
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri2));
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri4));
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri6));
  });

  it("should remove an interface implementation", () => {
    const interfaceUri1 = "wrap://ens/some.interface1.eth";
    const interfaceUri2 = "wrap://ens/some.interface2.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementations(interfaceUri1, [implUri1, implUri2])
      .addInterfaceImplementations(interfaceUri2, [implUri1, implUri2])
      .removeInterfaceImplementation(interfaceUri1, implUri2)
      .build();

    if (!config.interfaces || config.interfaces.length !== 2) {
      fail(["Expected 2 interfaces, received:", config.interfaces]);
    }

    const interface1 = config.interfaces.find(
      (x) => x.interface.uri === interfaceUri1
    );
    const interface2 = config.interfaces.find(
      (x) => x.interface.uri === interfaceUri2
    );

    expect(interface1).toBeDefined();
    expect(interface1?.implementations).toHaveLength(1);
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri1));

    expect(interface2).toBeDefined();
    expect(interface2?.implementations).toHaveLength(2);
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri1));
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri2));
  });

  it("should completely remove an interface if there are no implementations left", () => {
    const interfaceUri1 = "wrap://ens/some.interface1.eth";
    const interfaceUri2 = "wrap://ens/some.interface2.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementations(interfaceUri1, [implUri1, implUri2])
      .addInterfaceImplementations(interfaceUri2, [implUri1, implUri2])
      .removeInterfaceImplementation(interfaceUri1, implUri1)
      .removeInterfaceImplementation(interfaceUri1, implUri2)
      .build();

    if (!config.interfaces || config.interfaces.length !== 1) {
      fail(["Expected 1 interface, received:", config.interfaces]);
    }

    const interface1 = config.interfaces.find(
      (x) => x.interface.uri === interfaceUri1
    );
    const interface2 = config.interfaces.find(
      (x) => x.interface.uri === interfaceUri2
    );

    expect(interface1).toBeUndefined();

    expect(interface2).toBeDefined();
    expect(interface2?.implementations).toHaveLength(2);
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri1));
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri2));
  });

  it("should add an uri redirect", () => {
    const from = "wrap://ens/from.this.ens";
    const to = "wrap://ens/to.that.ens";

    const config = new ClientConfigBuilder().addRedirect(from, to).build();

    expect(config.redirects).toHaveLength(1);
    expect(config.redirects).toContainEqual({
      from: Uri.from(from),
      to: Uri.from(to),
    });
  });

  it("should add two uri redirects with different from uris", () => {
    const from1 = "wrap://ens/from.this1.ens";
    const to1 = "wrap://ens/to.that1.ens";

    const from2 = "wrap://ens/from.this2.ens";
    const to2 = "wrap://ens/to.that2.ens";

    const config = new ClientConfigBuilder()
      .addRedirect(from1, to1)
      .addRedirect(from2, to2)
      .build();

    expect(config.redirects).toHaveLength(2);
    expect(config.redirects).toContainEqual({
      from: Uri.from(from1),
      to: Uri.from(to1),
    });
    expect(config.redirects).toContainEqual({
      from: Uri.from(from2),
      to: Uri.from(to2),
    });
  });

  it("should overwrite an existing uri redirect if from matches on add", () => {
    const from1 = "wrap://ens/from1.this.ens";
    const from2 = "wrap://ens/from2.this.ens";
    const to1 = "wrap://ens/to.that1.ens";
    const to2 = "wrap://ens/to.that2.ens";

    const config = new ClientConfigBuilder()
      .addRedirect(from1, to1)
      .addRedirect(from2, to1)
      .addRedirect(from1, to2)
      .build();

    expect(config.redirects).toHaveLength(2);
    expect(config.redirects).toContainEqual({
      from: Uri.from(from1),
      to: Uri.from(to2),
    });
    expect(config.redirects).toContainEqual({
      from: Uri.from(from2),
      to: Uri.from(to1),
    });
  });

  it("should remove an uri redirect", () => {
    const from1 = "wrap://ens/from.this1.ens";
    const to1 = "wrap://ens/to.that1.ens";

    const from2 = "wrap://ens/from.this2.ens";
    const to2 = "wrap://ens/to.that2.ens";

    const config = new ClientConfigBuilder()
      .addRedirect(from1, to1)
      .addRedirect(from2, to2)
      .removeRedirect(from1)
      .build();

    expect(config.redirects).toHaveLength(1);
    expect(config.redirects).toContainEqual({
      from: Uri.from(from2),
      to: Uri.from(to2),
    });
  });

  it("should set uri resolver", () => {
    const uriResolver = new NamedUriResolver("ResolverName");

    const config = new ClientConfigBuilder().addResolver(uriResolver).build();

    expect((config.resolvers as Array<NamedUriResolver>)[0].name).toBe(
      "ResolverName"
    );
  });

  it("should overwrite uri resolver on set when it already exists", () => {
    const uriResolver1 = new NamedUriResolver("first");
    const uriResolver2 = new NamedUriResolver("second");

    const config = new ClientConfigBuilder()
      .addResolver(uriResolver1)
      .addResolver(uriResolver2)
      .build();

    expect((config.resolvers as Array<NamedUriResolver>)[0].name).toBe(
      "first"
    );
    expect((config.resolvers as Array<NamedUriResolver>)[1].name).toBe(
      "second"
    );
  });
});
