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
