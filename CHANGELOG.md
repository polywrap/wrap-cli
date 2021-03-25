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
