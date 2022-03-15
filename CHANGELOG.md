# Web3API 0.0.1-prealpha.68
## Bugs
* [PR-756](https://github.com/polywrap/monorepo/pull/756) `@web3api/schema-bind`: Imported enums are properly included in the schema bindings when there are no objects imported.

# Web3API 0.0.1-prealpha.67
## Features
* [PR-726](https://github.com/polywrap/monorepo/pull/726) Improved the application developer experience by creating a new `w3 app codegen` command, which generated types based on the apps wrapper / plugin integrations. For an example of how this works, see the updated application template projects by running `w3 create app typescript-node my-app` or `w3 create app typescript-react my-app`.
* [PR-726](https://github.com/polywrap/monorepo/pull/726) `@web3api/react`: Added the `useWeb3ApiInvoke` hook as a non-graphql alternative to `useWeb3ApiQuery`.
* [PR-726](https://github.com/polywrap/monorepo/pull/726) `@web3api/schema-compose`: Importing all dependency types from a schema import schema statement can now be done through the new wild-card syntax: `#import * into Namespace from "w3://authority/path"`.

## Breaking Changes
* [PR-726](https://github.com/polywrap/monorepo/pull/726) `@web3api/cli`: `w3 build` CLI command now requires the use of the `--manifest-file <path>` option in order to specify a custom build manifest file path.
* [PR-726](https://github.com/polywrap/monorepo/pull/726) `@web3api/cli`: `w3 codegen` CLI command option renaming:
  * `-m, --manifest-path <path>` to `-m, --manifest-file <path>`
  * `-c, --custom <path>` to `-s, --script <path>`
  * `-o, --output-dir <path>` to `-c, --codegen-dir <path>`
* [PR-726](https://github.com/polywrap/monorepo/pull/726) `@web3api/cli`: `w3 plugin` CLI command option renaming:
  * `-m, --manifest-path <path>` to `-m, --manifest-file <path>`

# Web3API 0.0.1-prealpha.66
## Features
* [PR-718](https://github.com/polywrap/monorepo/pull/718) `@web3api/cli`: `w3 plugin codegen` now outputs the plugin manifest to the build directory.
* [PR-695](https://github.com/polywrap/monorepo/pull/695) `@web3api/ethereum-plugin-js`: Added Query methods: `solidityPack`, `solidityKeccak256`, `soliditySha256`.

## Breaking Changes
* [PR-718](https://github.com/polywrap/monorepo/pull/718) `@web3api/cli`: `w3 plugin codegen` option `-s, --output-schema-path` changed to `-p, --publish-dir`.
* [PR-718](https://github.com/polywrap/monorepo/pull/718) `@web3api/cli`: `w3 plugin codegen` option `-t, --output-types-dir` changed to `-c, --codegen-dir`.

# Web3API 0.0.1-prealpha.65
## Bugs
* [PR-690](https://github.com/polywrap/monorepo/pull/690) `@web3api/http-plugin-js`: Better axios response header handling for lists.
* [PR-692](https://github.com/polywrap/monorepo/pull/692) `@web3api/wasm-as`: Properly propogate `Result<T, E>` error upon unwrap exception.

# Web3API 0.0.1-prealpha.64
## Bugs
* [PR-685](https://github.com/polywrap/monorepo/pull/685) `@web3api/schema-parse`: Properly support recursive object definition properties.

# Web3API 0.0.1-prealpha.63
## Features
* [PR-650](https://github.com/polywrap/monorepo/pull/650) `@web3api/cli`: Add YAML support for query recipes.
* [PR-385](https://github.com/polywrap/monorepo/pull/385) `@web3api/cli`, `@web3api/client-js`: Use JSON for manifest build artifacts.
* [PR-678](https://github.com/polywrap/monorepo/pull/678) `@web3api/cli`: Build command no longer uses same docker image name by default. The concept of a "build UUID" has been added, and will be appended to the docker image name (if the develoer has not specified their own inside `web3api.build.yaml`).
* [PR-610](https://github.com/polywrap/monorepo/pull/610) `@web3api/client-js`: Support the `resolveUri(...)` method on `Web3ApiClient` instances.

## Bugs
* [PR-665](https://github.com/polywrap/monorepo/pull/665) `@web3api/ethereum-plugin-js`: Fix `TxRequest` property mapping to ethers.js types.
* [PR-672](https://github.com/polywrap/monorepo/pull/672) `@web3api/core-js`, `@web3api/schema-bind`, `@web3api/schema-parse`: Remove use of the JS string `.substr` method.
* [PR-673](https://github.com/polywrap/monorepo/pull/673) `@web3api/cli`: The `w3 query ...` command now property sets `exitCode` to 1 if a query fails.
* [PR-651](https://github.com/polywrap/monorepo/pull/651) `@web3api/http-plugin-js`: JSON payloads are now property supported.

## Breaking Changes
* [PR-674](https://github.com/polywrap/monorepo/pull/674) `@web3api/cli`, `@web3api/schema-bind`: Return `Result<T, E>` objects from all AssemblyScript subinvoke methods.

# Web3API 0.0.1-prealpha.62
## Features
* Use the https://ipfs.wrappers.io IPFS gateway throughout the codebase.
* Rename TypeInfo `queryTypes` & `importedQueryTypes` to `moduleTypes` & `importedModuleTypes`.
* `@web3api/ipfs-plugin-js`: Improve the IPFS plugin's URI resolver implementation, and add the ability to query from multiple gateways in parallel.

# Web3API 0.0.1-prealpha.61
## Features
* `@web3api/cli`: Added the `--client-config` / `-c` option to the `w3 query` CLI command, allowing the user the define their own client configurations within a JavaScript or TypeScript module.
* `@web3api/client-js`: Plugins can now be initialized with the client's environment registered at the plugin's URI.

## Bugs
* `@web3api/schema-bind`: Properly handle reserve words for the bind target's language. Reserved words will be prepended with `m_` in order to avoid compiler errors.

# Web3API 0.0.1-prealpha.60
## Breaking Changes
* `@web3api/schema-compose`: `ComposerOptions` property `schemas` is now of type `Record<SchemaKind, SchemaFile>` and not `Record<string, SchemaFile>`.
* `@web3api/schema-bind`: `TargetLanguage` type has been renamed to `BindLanguage`.
* `@web3api/schema-bind`: `BindOptions` property `language` has been renamed to `bindLanguage`.

## Bugs
* `@web3api/cli`: Properly resolve NPM dependency `colors` due to it being [corrupted](https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/).
* `@web3api/cli`: Plugin schema codegen now properly represents imports types from both Query and Mutation modules.
* `@web3api/cli`: Properly defined the separation of the `ManifestLanguage` and `BindLanguage` (ex: wasm/assemblyscript -> wasm-as).
* `@web3api/schema-compose`: Introduce the concept of a `SchemaKind` to help determine how schemas should be combined.
* `@web3api/schema-compose`: Allow plugins to import mutations within their schemas.
* `@web3api/schema-bind`: Introduced the concept of `BindTarget` to represent a list of known-good bind targets (`wasm-as`, `plugin-ts`, etc).

# Web3API 0.0.1-prealpha.59
## Features
* Web3APIs can now be configured via environment variables. Documentation will be created soon. Initial details on this features specification can be found [here](https://github.com/polywrap/monorepo/issues/140).

# Web3API 0.0.1-prealpha.58
## Features
* `@web3api/client-js`: Added `noDecode` invocation option.
* `@web3api/client-js`: Added `noDefaults` constructor option.

## Bugs
* `@web3api/ethereum-plugin-js`: The `encodeParams` now properly parses arguments of type Array & Tuple.

# Web3API 0.0.1-prealpha.57
## Features
* `@web3api/cli`: CLI command middleware support has been added. The first use-cases implemented are to help ensure Docker is available to the CLI instance, and not in-use by another CLI instance.
* `@web3api/client-js`: Query-time configuration overrides have been added, allowing developers to define new configurations without having to re-create the client instance.

## Bugs
* `@web3api/asyncify-js`: Fixed issue [#570](https://github.com/polywrap/monorepo/issues/570) by using a node-version-agnostic way of indexing into the Uint8Array buffer.

# Web3API 0.0.1-prealpha.56
## Bugs
* `@web3api/ethereum-plugin-js`: The encodeFunction now support array & object arg types.

# Web3API 0.0.1-prealpha.55
## Bugs
* `@web3api/schema-compose`: Properly support empty schema types.
* `@web3api/asyncify-js`: Fixed a low-level inconsistency between Wasm modules when using imported memory. More details [here](https://github.com/polywrap/monorepo/issues/561).
* `@web3api/schema-bind`: Fixed issue where imports were inconsistent between `serialization.ts` assemblyscript files, and some necessary imports were missing.

# Web3API 0.0.1-prealpha.54
## Features
* `@web3api/ethereum-plugin-js`: Added `getNetwork` to the Ethereum plugin's `Query` module.

# Web3API 0.0.1-prealpha.53
## Features
* `as-bigint` upgraded to version `0.4.0`. Improvements made found [here](https://github.com/polywrap/monorepo/pull/552).

# Web3API 0.0.1-prealpha.52
## Features
* Querying an interface implementation's modules given its URI is now supported within Wasm.

# Web3API 0.0.1-prealpha.51
## Features
* `as-bigint` upgraded to version `0.3.2`. Improvements made found [here](https://github.com/polywrap/monorepo/pull/535).

# Web3API 0.0.1-prealpha.50
## Features
* Getting the implementations of an interface is now supported from within Wasm.
* `@web3api/tracing-js`: Added a class method decorator for tracing.

# Web3API 0.0.1-prealpha.49
## Features
* `@web3api/fs-plugin-js`: Added a "File System" plugin, which implements the `uri-resolver` interface, enabling users to load Web3API packages from their local filesystem. For example, a user could specify the URI `/fs/path/to/package/directory`.
* Upgraded the toolchain's Node.JS version to 16.13.0, which solves compatibility issues with Mac computers using the new M1 processor.

## Bugs
* `@web3api/cli`: Fixed the `w3 query ...` command's recipe variable parsing logic, better supporting arrays and objects.
* `@web3api/schema-compose`: Improved import parsing, and added support for recursive schema imports.

# Web3API 0.0.1-prealpha.48
## Bugs
* `@web3api/test-env-js`: Allow the usage of this package as an npm package outside of the monorepo folder structure.

# Web3API 0.0.1-prealpha.47
## Features
* `@web3api/client-js`: Add the Graph Node plugin to the client's default configuration.
* `@web3api/ethereum-plugin-js`: Add the `encodeFunction` query method, allowing callers to encode smart contract methods w/ argument values.

# Web3API 0.0.1-prealpha.46
## Bugs
* `@web3api/core-js`: Properly check for "undefined" values in query arguments.
* `@web3api/wasm-as`: Improved MsgPack deserialization of integers (signed & unsigned).

# Web3API 0.0.1-prealpha.45
## Features
* `@web3api/tracing-js`: Support service name configuration.

# Web3API 0.0.1-prealpha.44
## Features
* `@web3api/client-js`: Use Fleek's IPFS gateway.

# Web3API 0.0.1-prealpha.43
## Features
* `@web3api/client-js`: Added the `client.subscribe(...)` method, enabling users to easily send queries at a specified frequency.

## Bugs
* `@web3api/tracing-js`: Replaced the `util-inspect` dependency with a browser compatible one.

# Web3API 0.0.1-prealpha.42
## Bugs
* `@web3api/schema-parse`: Removed unnecessary sanitization for imported methods without any arguments.

# Web3API 0.0.1-prealpha.41
## Features
* `@web3api/schema-parse`: Added support for `JSON` as a base type.
* `@web3api/ens-api`: Merged in an initial version of the ENS Wasm based Web3Api.
* `web3api.build.yaml`: Added support for the `linked_packages` property, allowing you to link local packages into the dockerized build-env.

## Bugs
* `@web3api/schema-compose`: Fixed an invalid GraphQL bug that occured when an imported query method did not have any arguments.

# Web3API 0.0.1-prealpha.40
## Features
* `@web3api/client-js`: Added `getManifest(...)`, `getFile(...)`, and `getSchema(...)` methods to the client, simply provide a URI.
* `@web3api/cli`: APIs can now define metadata via the `web3api.meta.yaml` manifest file. Upon compiling your project, the CLI will copy all referenced metadata files into the build directory. Applications such as The Polywrap Hub will use this metadata file to display details about your package such as: title, description, icon, example queries, etc.

## Bugs
* `@web3api/schema-parse`: Duplicate fields on object & query types are not detected, and will cause a compiler error.

## Breaking Changes
* `@web3api/client-js`: Removed the `loadWeb3Api(...)` method from the client. This is because we do not want to give the user of the client a direct reference to the underlying API class object. Since garbage collection will delete these, having the user able to hang onto references, will result in them staying in memory.

# Web3API 0.0.1-prealpha.39
## Features
* `@web3api/client-js`: Added `https://polywrap-dev.mypinata.cloud` and `https://ipfs.infura.io` as default fallback IPFS providers.

## Bugs
* `@web3api/ipfs-plugin-js`: Fallback providers are now used if an error is encountered, not just for timeouts.

# Web3API 0.0.1-prealpha.38
## Breaking Changes
* `@web3api/client-js`: Removed the usage of `_w3_init`, as it's unnecessary and caused issues with adding Rust-Wasm support.

# Web3API 0.0.1-prealpha.37
## Bugs
* `@web3api/asyncify-js`: Fixed problem when Wasm modules are larger than 4 KB. More info [here](https://github.com/polywrap/monorepo/pull/450).
* `@web3api/client-js`: Use new asyncify-js package, where instantiation is asynchronous.

# Web3API 0.0.1-prealpha.36
## Features
* Upgrade all JavaScript plugins to use the new `w3 plugin codegen` command. The command generates typings based on the GraphQL schema of the plugin. This ensures the plugin's resolvers match 1:1 with the GraphQL schema.

# Web3API 0.0.1-prealpha.35
## Bugs
* `@web3api/schema-bind`: Fix TypeScript plugin enum bindings.

# Web3API 0.0.1-prealpha.34
## Bugs
* `@web3api/schema-bind`: Fix TypeScript enum bindings.
* `@web3api/graph-node-plugin-js`: Fix mismatched schema.

# Web3API 0.0.1-prealpha.33
## Bugs
* `@web3api/schema-bind`: Fixed plugin code generation oversight. Should be using `null` instead of `undefined`.

# Web3API 0.0.1-prealpha.32
## Features
* Improved the plugin developer experience by creating a new `w3 plugin codegen` command, which generated types based on the plugin's schema. For an example of how this works, see the updated plugin template project by running `w3 create plugin typescript my-plugin`.
* `@web3api/cli`: Refactored the `w3 codegen` command, making its default behavior the generation of types for Web3APIs. It's "old" behavior of loading a custom generation script is now usable through the `--custom` option.

## Bugs
* `@web3api/cli`: Properly validate all required Wasm exports when compiling Web3APIs.

# Web3API 0.0.1-prealpha.31
## Features
* Use Binaryen's Asyncify to support async Wasm import calls. Deprecate the Wasm threading model we were using previously. This now means that the client now supports all browsers, as it no longer requires `SharedArrayBuffer` & the `atomics` library.
* `@web3api/graph-node-plugin-js`: Finalized the graph-node plugin implementation, added e2e tests. It currently only works with the hosted service.

## Bugs
* Removed support for UInt64 & Int64 base types. More info [here](https://github.com/polywrap/monorepo/pull/414).
* `@web3api/cli`: Properly validate all required exports from Web3API Wasm modules at compile-time.
* `@web3api/ethereum-plugin-js`: Properly support smart contract methods with structures as arguments.

# Web3API 0.0.1-prealpha.30
## Bugs
* `@web3api/ethereum-plugin-js`: Fix ethers.js inconsistencies.

# Web3API 0.0.1-prealpha.29
## Feature
* Web3API Interfaces are now fully supported in the tool-chain.
* GraphQL schema comments are now retained, and will show up in the build folder.
* `@web3api/parse`: Reference types definitions are now differentiated from the root definitions the reference.

## Bugs
* `@web3api/cli`: Fix MacOS specific issue w/ PATH not being retained.
* The `config` property in `web3api.build.yaml` is now optional.

# Web3API 0.0.1-prealpha.28
## Bugs
* Fixed API template project

# Web3API 0.0.1-prealpha.27
## Bugs
* Fixed API template project

# Web3API 0.0.1-prealpha.26
## Feature
* `@web3api/uniswapV2-api`: Completed the Uniswap V2 Web3API implementation.
* `@web3api/ethereum-plugin-js`: Upgraded the Ethereum plugin, added lots of new functionality.
* `@web3api/cli`: Implemented a "reproducible build pipeline", where Web3APIs are now built in an isolated docker container. These builds can be fully configurable by developers. This also paves the way for implementing Web3APIs in any Wasm compatible language. Rust support on the way!
* `@web3api/react`: Added the ability to set query `variables` within the `execute` function returned by the `useWeb3ApiQuery` hook.
* `@web3api/sha3-plugin-js`: A SHA3 plugin has been implemented, and added to the client as a "default plugin".
* `@web3api/uts46-plugin-js`: A UTS46 plugin has been implemented, and added to the client as a "default plugin".
* CI: Windows CI has been implemented using appveyor.

## Bugs
* `@web3api/client-js`: Fixed threading issue causing the "unknown wake status" error.
* Fixed Windows specific errors.

# Web3API 0.0.1-prealpha.25
## Feature
* `@web3api/client-js`: Added the `WEB3API_THREAD_PATH` env variable, allowing integrators to customize where the `thread.js` worker thread module is imported from.
* `@web3api/wasm-as`: Improved error logging w/ better error messages and a "context stack" showing exactly what properties of the MsgPack blob the serialization / deserialization is failing at.

# Web3API 0.0.1-prealpha.24
## Bugs
* `@web3api/wasm-as`: Moved `as-bigint` from `devDependencies` to `dependencies`. Fixes [issue #347](https://github.com/Web3-API/monorepo/issues/347)

# Web3API 0.0.1-prealpha.23
## Feature
* `@web3api/os-js`: This package contains OS agnostic code for doing things like writing files w/ consistent line endings.
* Windows Support: The toolchain now builds and runs properly on the Windows operating system.
* `BigInt` Schema Type: The `BigInt` type is now available for use as a base type for Web3API GraphQL schemas.
* `@web3api/react`: The `useWeb3ApiClient` hook was added, allowing users to easily get a reference to the Web3ApiClient used by the Web3ApiProvider.

# Web3API 0.0.1-prealpha.22
## Feature
* `@web3api/tracing-js`: The `tracing-js` package uses the [OpenTelemetry Standard](https://opentelemetry.io/) for logging trace events. This enables things like:
  * Benchmark Timings
  * Input Argument + Output Result Logging
  * In-Depth Exception Tracing
* `@web3api/core-js`: All functions are now traceable.
* `@web3api/client-js`: All functions are now traceable.

# Web3API 0.0.1-prealpha.21
## Feature
* Sharing code & types between `query` and `mutation` modules is now possible.

## Bugs
* Common types found in both `query` and `mutation` schemas are properly consolidated. If types have the same name, but a different structure, and error is thrown.

# Web3API 0.0.1-prealpha.20
## Bugs
* Fix the `w3 create app react ...` template project's styling to be responsive.

# Web3API 0.0.1-prealpha.19
## Features
* `@web3api/ipfs-plugin-js`: Added options for request timeouts, provider overrides, and fallback providers. Additionally a new method has been added, `resolve`, which allows the caller to try and resolve a given IFPS CID to ensure the document exists.

# Web3API 0.0.1-prealpha.18
## Features
* Updated the `app/react` template project to use the latest "Hello World" Web3API published at `ens/helloworld.web3api.eth`.

# Web3API 0.0.1-prealpha.17
## Bugs
* `@web3api/ethereum-plugin-js`: Network configurations must be nested within a property in order to allow for the `defaultNetwork` property to be set w/o causing a typing error (for not being of the `ConnectionConfig` type).

# Web3API 0.0.1-prealpha.16
## Bugs
* `@web3api/test-env`: Expose the IPFS node's swarm port (4001).

# Web3API 0.0.1-prealpha.15
## Bugs
* Fix `extractPluginConfigs.ts` output.

# Web3API 0.0.1-prealpha.14
## Features
* Network Specific ENS Lookup
  * `@web3api/ethereum-plugin-js`: The EthereumPlugin can now be constructed with multiple network connections (mainnet, rinkeby, testnet, etc).
    * All Query & Mutation methods now accept an optional `connection` property which can be used to configure a specific network to be used for the action.
  * `@web3api/ens-plugin-js`: The EnsPlugin can now handle URIs that address specific networks. For example: `w3://ens/testnet/myweb3api.eth`. It will request the `testnet` connection to be used when querying the Ethereum Web3API.

# Web3API 0.0.1-prealpha.13
## Features
* Improved template projects that are used with the `w3 create ...` CLI command.

# Web3API 0.0.1-prealpha.12
## Bug Fixes
* Added schemas to plugin manifest modules, removing the need for `import_redirects`.
* Fixed the IpfsPlugin's `addFile` method.
* Improved the api/assemblyscript template project.

# Web3API 0.0.1-prealpha.11
## Bug Fixes
* `@web3api/cli`: Include the internationalization JSON files in the published package.

# Web3API 0.0.1-prealpha.10
## Bug Fixes
* `@web3api/ens-plugin-js`: Fix the schema.

# Web3API 0.0.1-prealpha.9
## Features
* `@web3api/cli`: CLI Internalized Text Support
  * Currently English is implemented, and Spanish support is slated to be added next.
* `@web3api/schema-parse`: GraphQL Infinite Cycle Detection
  * Bad object relationships within the Web3API's GraphQL schema are now automatically detected, ensuring developers never create objects that can never be instantiated properly.
* `@web3api/templates`: Auto-Generate Smart Contract ABI & Bytecode Assemblyscript Module
  * This auto-generated module is being used within the `deployContract` mutation.

## Bug Fixes
* `@web3api/core-js`: The `resolve-uri` core algorithm had an "off by one" iteration bug, where it never retried the first `api-resolver` in the implementations array.
* `@web3api/ethereum-plugin-js`: When using a provider that lacks signing capabilities (ex: Infura RPC endpoint), the `getContract` function was trying to get a signer when one did not exist.
* `@web3api/ipfs-plugin-js`: Fixed this plugin's schema, as it was using unsupported syntax.

## Misc
* Upgrade node version to v14.16.0.
* Upgrade TypeScript version to v4.0.7.

# Web3API 0.0.1-prealpha.8
## Bug Fixes
* Fixed bug in `@web3api/react` package.

## Misc
* Removed documentation & demos from the monorepo.

# Web3API 0.0.1-prealpha.7
## Features
* Console Log Web3API
  * Calls log on logger plugin at uri w3://w3/logger. Default logger logs to console, but can be overridden with redirect to custom logger web3api implementation.
  * Log levels: Debug, Info, Warn, Error
* `createWeb3ApiClient(...)` helper for easily setting up a Web3API Client with all needed plugins (ex: ethereum, ipfs, etc) in one function call.
  * Additional support for plugins can be added in the future, without bloating the `@web3api/client-js` package thanks to dynamic imports!
* When using the Web3ApiClient, specify Web3API URIs without having to create a new URI class (`new Uri("...")`). Simply provide a string instead.
* Improved plugin instantiation interface.

## Bug Fixes
* Proper MsgPack numeric overflow assertions (closes: [#150](https://github.com/Web3-API/monorepo/issues/150))
* Proper usage of [GraphQL Aliases](https://graphql.org/learn/queries/#aliases) when invoking multiple methods in one query.

# Web3API 0.0.1-prealpha.6
## Features
* Web3API React Integration: `@web3api/react`
  * Add the `Web3ApiProvider` HOC to the root of your application.
  * Use the `useWeb3ApiQuery` hook to execute queries.
* Web3API CLI e2e tests.
* `@web3api/test-env-js` package for common testing logic.
* `@web3api/test-cases` for common test cases.

## Bug Fixes
* Remove unused `workerize-loader` package & logic.

# Web3API 0.0.1-prealpha.5
## Features
* `w3 build --watch` support, enabling the automatic rebuilding of Web3APIs whenever project files have changed.

# Web3API 0.0.1-prealpha.4
## Features
* Enum Support

## Bug Fixes
* `w3 create ...` CLI Fix (closes: [#167](https://github.com/Web3-API/monorepo/issues/167))

# Web3API 0.0.1-prealpha.2
## Bug Fixes
* Fix typescript plugin template's package.json

# Web3API 0.0.1-prealpha.1
Pre-Alpha Initial Release
