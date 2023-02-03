import { ClientConfigBuilder } from "../build";

// eslint-disable-next-line import/no-extraneous-dependencies
import { WasmWrapper } from "@polywrap/wasm-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { RecursiveResolver, WrapperCache } from "@polywrap/uri-resolvers-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { CoreClientConfig } from "@polywrap/core-js";

export function initialize(): ClientConfigBuilder {
  // $start: quickstart-initialize
  // start with a blank slate (typical usage)
  const builder = new ClientConfigBuilder();
  // $end

  return builder;
}

export function configure(): ClientConfigBuilder {
  const builder = new ClientConfigBuilder();

  // $start: quickstart-configure
  // add multiple items to the configuration using the catch-all `add` method
  builder.add({
    envs: {},
    interfaces: {},
    redirects: {},
    wrappers: {},
    packages: {},
    resolvers: [],
  });

  // add or remove items by chaining method calls
  builder
    .addPackage("wrap://plugin/package", httpPlugin({}))
    .removePackage("wrap://plugin/package")
    .addPackages(
      {
        "wrap://plugin/http": httpPlugin({}),
        "wrap://plugin/filesystem": fileSystemPlugin({}),
      }
    );
  // $end

  // $start: quickstart-addDefaults
  builder.addDefaults();
  // $end

  return builder;
}

export function build():
  | ClientConfigBuilder
  | CoreClientConfig {
  const builder = new ClientConfigBuilder();

  // $start: quickstart-build
  // accepted by either the PolywrapClient or the PolywrapCoreClient
  let coreClientConfig = builder.build();

  // build with a custom cache and/or resolver
  coreClientConfig = builder.build(
    new WrapperCache(),
    RecursiveResolver.from([])
  );
  // $end

  return builder ?? coreClientConfig;
}

export async function example(): Promise<CoreClientConfig> {
  // $start: quickstart-example
  // init
  const builder = new ClientConfigBuilder();

  // add the default bundle first to override its entries later
  builder.addDefaults();

  // add many config items at once
  builder.add({
    envs: {},
    interfaces: {},
    redirects: {},
    wrappers: {},
    packages: {},
    resolvers: [],
  });

  // add and remove wrappers
  builder
    .addWrapper("wrap://ens/wrapper.eth", await WasmWrapper.from(
      new Uint8Array([1, 2, 3]),
      new Uint8Array([1, 2, 3])
    ))
    .removeWrapper("wrap://ens/wrapper.eth")
    .addWrappers({
      "wrap://ens/wrapper.eth": await WasmWrapper.from(
          new Uint8Array([1, 2, 3]),
          new Uint8Array([1, 2, 3])
      )}
    );

  // add and remove wrap packages
  builder
    .addPackage("wrap://plugin/package", httpPlugin({}))
    .removePackage("wrap://plugin/package")
    .addPackages({
      "wrap://plugin/package": httpPlugin({})
    })

  // add and remove Envs
  builder
    .addEnv("wrap://ens/wrapper.eth", { key: "value" })
    .removeEnv("wrap://ens/wrapper.eth")
    .addEnvs({
      "wrap://ens/wrapper.eth": { key: "value" },
    });

  // override existing Env, or add new Env if one is not registered at URI
  builder.setEnv("wrap://ens/wrapper.eth", { key: "value" });

  // add or remove registration for an implementation of an interface
  builder
    .addInterfaceImplementation(
      "wrap://ens/interface.eth",
      "wrap://ens/wrapper.eth"
    )
    .removeInterfaceImplementation(
      "wrap://ens/interface.eth",
      "wrap://ens/wrapper.eth"
    )
    .addInterfaceImplementations("wrap://ens/interface.eth", [
      "wrap://ens/wrapper.eth",
    ]);

  // add or remove URI redirects
  builder
    .addRedirect("wrap://ens/from.eth", "wrap://ens/to.eth")
    .removeRedirect("wrap://ens/from.eth")
    .addRedirects({
       "wrap://ens/from.eth": "wrap://ens/to.eth",
    });

  // add resolvers
  builder.addResolver(RecursiveResolver.from([]));
  builder.addResolvers([]);

  // build
  const clientConfig = builder.build();
  // $end

  return clientConfig;
}
