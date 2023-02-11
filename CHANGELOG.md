# Polywrap Origin (0.10.0-pre.8)
## Breaking Changes
### Toolchain
**`polywrap` CLI:**
* [PR-1432](https://github.com/polywrap/toolchain/pull/1432) **Remove Legacy Polywrap Project Metadata**
  * Remove the `polywrap.meta.yaml` manifest.
* [PR-1367](https://github.com/polywrap/toolchain/pull/1367) **Client Configuration Refactor**
  * The JS/TS module passed into the `--client-config` option has a new function entrypoint signature. Instead of exporting a `getCustomConfig` function, users should export the following: `configure(builder: IClientConfigBuilder): IClientConfigBuilder`.
  * See example [config.ts](https://github.com/polywrap/toolchain/blob/1096f2f4dfb35fdcc29e9b66057f91ade8b82c67/packages/test-cases/cases/cli/test/008-custom-config/config.ts).
* [PR-1348](https://github.com/polywrap/toolchain/pull/1348) **Rename `run` to `test`**
  * Rename the `run` command to `test`, which uses the `test` project extension, as defined in the `polywrap.test.yaml` manifest file.

### JS Client
**`@polywrap/client-js`:**
* [PR-1461](https://github.com/polywrap/toolchain/pull/1461) **Remove Legacy Invocation Methods**
  * Remove `client.query(...)` & `client.subscribe(...)` methods.
* [PR-1369](https://github.com/polywrap/toolchain/pull/1369) **Remove Legacy Redirects**
  * `PolywrapClient` config when using `noDefaults: true` no longer accepts `redirects` (Since redirects have been removed from `CoreClientConfig`).
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * The Polywrap Client with `noDefaults: false` no longer accepts a `plugins` field, but it accepts `wrappers` and `packages`.
    * `resolver` field has been replaced with `resolvers`, since with default client the resolver used is the `RecursiveResolver` with the `PackageToWrapperCacheResolver`.
  * The Polywrap Client with `noDefaults: true`, no longer accepts a `plugins` field. It is expected that devs using this option will manually configure their own resolver.
  * removed `getPlugins` and `getPluginByUri`. Will add `getWrapper`, `getWrapperByUri`, `getPackage`, `getPackageByUri`, in a follow up PR.
  * `createPolywrapClient` function has been deprecated.

**`@polywrap/client-config-builder-js`:**
* [PR-1480](https://github.com/polywrap/toolchain/pull/1480) **ClientConfigBuilder-specific `BuilderConfig` Object**
  * The `ClientConfigBuilder` now uses a specific `BuilderConfig` that is easier for users to work with. It will then be turned into a `CoreClientConfig` through the use of the `build()` method.
* [PR-1498](https://github.com/polywrap/toolchain/pull/1498) **Refactor `ClientConfigBuilder.build()`**
  * Rename `buildCoreConfig()` to `build()`, which returns a `CoreClientConfig` instance.
* [PR-1494](https://github.com/polywrap/toolchain/pull/1494) **Deprecate Legacy HTTP URIs in Default Config Bundle**
  * The `wrap://ens/http.polywrap.eth` interface and wrapper have been removed from the default configuration bundle.
* [PR-1436](https://github.com/polywrap/toolchain/pull/1436) **Deprecate Legacy Logger URIs in Default Config Bundle**
  * The `wrap://ens/logger.core.polywrap.eth` interface and the `wrap://ens/js-logger.polywrap.eth` plugin wrapper have both been removed from the default configuration bundle.
* [PR-1369](https://github.com/polywrap/toolchain/pull/1369) **Remove Legacy Redirects**
  * Calling `buildCoreConfig` no longer returns a `CoreClientConfig` with redirects since redirects are no longer a part of `CoreClientConfig`.
* [PR-1367](https://github.com/polywrap/toolchain/pull/1367) **URI Redirect Renaming**
  * Renamed `removeUriRedirect(...)` to `removeRedirect(...)`.
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Now uses the `CustomClientConfig` which doesn't have `plugins` and a `resolver`, but now has `wrappers`, `packages` and `resolvers`
  * Calling build returns an instance of the `CustomClientConfig`, which can be used with defaults from the `PolywrapClient`, but can not be used if `noDefaults: true` is passed to the `PolywrapClient` constructor.
  * Removed `addPlugin` from the `ClientConfigBuilder`, users can now use `addWrapper` or `addPackage` where appropriate.

**`@polywrap/core-js`:**
* [PR-1369](https://github.com/polywrap/toolchain/pull/1369) **Remove Legacy Redirects**
  * `redirects` are no longer a part of `CoreClientConfig`.
  * `getRedirects` are no longer a part of `CoreClient`.
  * `getUriResolver` on `CoreClient` has been renamed to `getResolver`.
  * `getImplementations` returns a promise now.
  * `GetImplementationsOptions` no longer accepts `applyRedirects`. This has been replaces with `applyResolution`.
  * `applyRedirects` helper function has been replaced with `applyResolution`.
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Plugins are no longer a part of this package, they have been moved to the plugin-js package
  * Renamed `UriRedirect` to `IUriRedirect` to match `IUriWrapper` and `IUriPackage`
  * `IUriRedirect`, `IUriWrapper` and `IUriPackage` are now generic and their generic param implements `Uri | string`
  * Removed `options` argument from `client.getManifest` method since all wrappers have a deserialized manifest

**`@polywrap/uri-resolvers-js`:**
* [PR-1369](https://github.com/polywrap/toolchain/pull/1369) **Remove Legacy Redirects**
  * `LegacyRedirectsResolver` has been removed.
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Replaced helper func `buildUriResolver` with `UriResolver.from`
  * Constructors of built-in resolvers like `RecursiveResolver` and `PackageToWrapperCacheResolver` now accept a concrete `IUriResolver` while their static `from` methods accept a `UriResolverLike` 
  * Remove `PluginsResolver` and `PluginResolver`, users can now use `WrapperResolver` or `PackageResolver`

**`@polywrap/react`:**
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Replaced `plugins` on the `PolywrapProvider` with `wrappers` and `packages`

### JS Plugins
**`@polywrap/http-plugin-js`:**
* [PR-1494](https://github.com/polywrap/toolchain/pull/1494) Migrated to [polywrap/http](https://github.com/polywrap/http)

**`@polywrap/fs-plugin-js`:**
* [PR-1495](https://github.com/polywrap/toolchain/pull/1495) Migrate to [polywrap/file-system](https://github.com/polywrap/file-system)

### Interface Wrappers
**`@polywrap/http-interface`:**
* [PR-1494](https://github.com/polywrap/toolchain/pull/1494) Migrated to [polywrap/http](https://github.com/polywrap/http)

**`@polywrap/file-system-interface`:**
* [PR-1495](https://github.com/polywrap/toolchain/pull/1495) Migrate to [polywrap/file-system](https://github.com/polywrap/file-system)

## Features
### Toolchain
**`polywrap` CLI:**
* [PR-1428](https://github.com/polywrap/toolchain/pull/1428) **Rust Plugin Support**
  * Add bindings for `plugin/rust` projects.
* [PR-1437](https://github.com/polywrap/toolchain/pull/1437) **Support Custom Wrapper Environment Variables**
  * Enable users to customize the CLI's internal client's wrapper environment via a `--wrapper-envs` option, added to the `build`, `codegen`, `docgen`, and `test` commands.
* [PR-1430](https://github.com/polywrap/toolchain/pull/1430) **Support Arbitrary Resources Files**
  * Polywrap `wasm/` & `interface/` projects can now include a `resources:` directory, specified in the `polywrap.yaml` manifest. This resources directory will be copied into the `build/` folder upon runnin `polywrap build`. For example:
    ```yaml
    format: 0.3.0
    project:
      type: interface | wasm/...
      ...
    source:
      ...
    resources: ./resources
    ```
* [PR-1349](https://github.com/polywrap/toolchain/pull/1349) **Log File Support**
  * A `-l, --log-file [path]` option has been added to all commands. Its purpose is to configure a `Log file to save console output to`, useful in situations when the console log overflows.

**`@polywrap/cli-js`:**
* [PR-1359](https://github.com/polywrap/toolchain/pull/1359) **Polywrap CLI JS Wrapper**
  * Created the `polywrap/cli-js` package to wrap the `polywrap` CLI with a JavaScript/TypeScript interface.

**`@polywrap/polywrap-manifest-schemas`:**
* [PR-1430](https://github.com/polywrap/toolchain/pull/1430) **Support Arbitrary Resources Files**
  * Added version `0.3.0` of the `PolywrapManifest`, which includes the new `resources: string` field.

**`@polywrap/polywrap-manifest-types-js`:**
* [PR-1379](https://github.com/polywrap/toolchain/pull/1379) **Add Logging to Manifest Migrators**
  * Added an optional logger parameter to the deserialization function of all manifest types.
* [PR-1430](https://github.com/polywrap/toolchain/pull/1430) **Support Arbitrary Resources Files**
  * Added version `0.3.0` of the `PolywrapManifest`, which includes the new `resources: string` field.

**`@polywrap/schema-bind`:**
* [PR-1428](https://github.com/polywrap/toolchain/pull/1428) **Rust Plugin Support**
    * Add bindings for `plugin/rust` projects.
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * In `plugin-ts` bindings, the `PluginModule` type is now imported fron `@polywrap/plugin-js` instead of `@polywrap/core-js`.

### JS Client
**`@polywrap/client-js`:**
* [PR-1431](https://github.com/polywrap/toolchain/pull/1431) **WRAP Error Structure**
  * Integrate the `WrapError` structure, helping debug common client error scenarios.
* [PR-1340](https://github.com/polywrap/toolchain/pull/1340) **Wrapper Validation**
  * Added a `validate(uri, options)` method to the `PolywrapClient` class, allowing users to guarantee the client can communicate with the provided wrapper located at the provided URI.
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Polywrap Client now re-exports the config builder and uri-resolvers (in addition to core) packages. This is done to improve dev exp and remove the need for users to import those package themselves.
    * For users who do not need those packages and are using noDefaults there will be a separate PR that refactor core client functionality into a core-client package that does not depend on the config builder and uri-resolvers packages, but has no defaults.

**`@polywrap/client-config-builder-js`:**
* [PR-1518](https://github.com/polywrap/toolchain/pull/1518) **Optional Build Method Arguments**
  * The `build(...)` method now accepts a single argument of type `BuildOptions`.
* [PR-1496](https://github.com/polywrap/toolchain/pull/1496) **Use New Concurrent Wrapper**
  * The default config bundle now uses the `wrap://ens/wrappers.polywrap.eth:concurrent@1.0.0` interface, and adds the `concurrent-plugin-js` package @ `wrap://plugin/concurrent` as an implementation.
* [PR-1468](https://github.com/polywrap/toolchain/pull/1468) **Export Default Config Bundle URIs**
  * The default config now exports constants for all URIs used within the config.
* [PR-1436](https://github.com/polywrap/toolchain/pull/1436) **Use New Logger Wrapper**
  * The default config bundle now uses the `wrap://ens/wrappers.polywrap.eth:logger@1.0.0` interface, and adds the `@polywrap/logger-plugin-js` package @ `wrap://plugin/logger` as an implementation.
* [PR-1411](https://github.com/polywrap/toolchain/pull/1411) **Add `ens-text-record-resolver` to Default Config Bundle**
  * The `ens-text-record-resolver` wrapper @ [`wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY`](https://wrappers.io/v/ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY) has been added to the default client config bundle. This resolver enables ENS, text-record based, WRAP URI resolution. The text-record's key must be prepended with the `wrap/...` identifier. For example, the URI `wrap://ens/domain.eth:foo` maps to `domain.eth`'s `wrap/foo` text record. The `wrap/foo` text-record's value must contain another valid WRAP URI. For examples, see [dev.polywrap.eth](https://app.ens.domains/name/dev.polywrap.eth/details).
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Added `addRedirects`, `addWrappers`, `addPackages` methods to the `ClientConfigBuilder`, so users can add many items at once.
  * Added `buildDefault` to the `ClientConfigBuilder` which builds a `ClientConfig` using default resolvers.

**`@polywrap/plugin-js`:**
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * New package for js plugins.
  * Can create plugin packages with `PluginPackage.from`.
    * Accepts `manifest` and a `PluginModule`, or an inline `PluginModule`.

**`@polywrap/uri-resolvers-js`:**
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Added `StaticResolver` and `StaticResolver.from` to optimize building resolvers with `IUriRedirect`, `IUriWrapper` and `IUriPackage`.

**`@polywrap/core-js`:**
* [PR-1431](https://github.com/polywrap/toolchain/pull/1431) **WRAP Error Structure**
  * Created a custom `WrapError` structure that improves debugging ability for common client error scenarios.
* [PR-1369](https://github.com/polywrap/toolchain/pull/1369) **Remove Legacy Redirects**
  * `GetImplementationsOptions` now accepts an optional resolution context, to be used to handle infinite recursion when a resolver uses `getImplementations`
  * `GetImplementationsOptions` now accepts an optional `applyResolution`. This can be used to apply URI resolution to interfaces.

**`@polywrap/logging-js`:**
* [PR-1379](https://github.com/polywrap/toolchain/pull/1379) **Create `@polywrap/logging-js` Package**
  * Created the `@polywrap/logging-js` package from the logging lib previously in the CLI's codebase.

### JS Plugins
**`@polywrap/http-plugin-js`:**
* [PR-1471](https://github.com/polywrap/toolchain/pull/1471) **Add form-data Support**
  * Added form-data support through the inclusion of the `formData: [FormDataEntry!]` property on the `Request` object.

**`@polywrap/ethereum-plugin-js`:**
* [PR-1373](https://github.com/polywrap/toolchain/pull/1373) **Sign Message Bytes**
  * Added a `signMessageBytes` method.

## Bugs
### Toolchain
**`polywrap` CLI:**
* [PR-1470](https://github.com/polywrap/toolchain/pull/1470) **Fix Build Manifest Absolute Path Support**
  * Accept absolute paths within the `polywrap.build.yaml` manifest's `linked_packages` property.
* [PR-1438](https://github.com/polywrap/toolchain/pull/1438) **Support Maps In Workflows**
  * Properly handle map types when running workflows using the `test` command.
* [PR-1396](https://github.com/polywrap/toolchain/pull/1396) **Remove Wasm "Interface Types" Custom Section**
  * The rust build images have been updated to properly remove the needless inclusion of the `wasm-interface-types` custom section, as a result of running wasm-bindgen. More information can be found [here](https://github.com/polywrap/toolchain/issues/1420).
* [PR-1379](https://github.com/polywrap/toolchain/pull/1379) **Manifest Upgrade Warning Message**
  * Automatically upgrading manifests now emits a warning, suggesting users to upgrade their manifest.
* [PR-1382](https://github.com/polywrap/toolchain/pull/1382) **Execute `asc` Using `npx`**
  * Invoke `asc` using `npx` to help with program resolution.
* [PR-1368](https://github.com/polywrap/toolchain/pull/1368) **Client Config Error Messaging**
  * Update error messaging for the `--client-config` option.

**`@polywrap/schema-bind`:**
* [PR-1444](https://github.com/polywrap/toolchain/pull/1444) **TypeScript Bindings Export Imports**
  * The `plugin/typescript` and `app/typescript` bindings now properly export all interfaces.
* [PR-1443](https://github.com/polywrap/toolchain/pull/1443) **Rust Bindings Use String**
  * The `wasm/rust` bindings now use `String` instead of `str` within imported interface module typings.

### JS Client
**`@polywrap/uri-resolvers-extensions-js`:**
* [PR-1487](https://github.com/polywrap/toolchain/pull/1487) **Handle `null` URI Resolver Extension Return Results**
  * Update the `MaybeUriOrManifest` & `getFile` interfaces to properly reflect the URI resolver extension interface.

### Templates
**`@polywrap/templates`:**
* [PR-1383](https://github.com/polywrap/toolchain/pull/1383) **Default Deploy Gateway**
  * Add the `https://ipfs.wrappers.io` gateway to the interface template's `polywrap.deploy.yaml` manifest.

# Polywrap Origin (0.9.3)
## Bugs
* [PR-1344](https://github.com/polywrap/toolchain/pull/1344) `@polywrap/cli`: Improve workflow validation.
* [PR-1345](https://github.com/polywrap/toolchain/pull/1345) `@polywrap/cli`: The `ens-recursive-name-register` deploy step now properly registers ENS sub-domains recursively.
* [PR-1342](https://github.com/polywrap/toolchain/pull/1342) `@polywrap/polywrap-manifest-schemas`: Accept @ character in folder paths.
* [PR-1333](https://github.com/polywrap/toolchain/pull/1333) `@polywrap/client-js`: Added TsDoc comments to the `PolywrapClient` class.
* [PR-1337](https://github.com/polywrap/toolchain/pull/1337) `@polywrap/schema-bind`: In Rust bindings, enum imports are now added in serialization modules when the enum is a subtype of an array (Vec) or map.

# Polywrap Origin (0.9.2)
## Bugs
* [PR-1327](https://github.com/polywrap/toolchain/pull/1327) `@polywrap/schema-bind`: Added missing serialization bindings for module method arguments & return values.

# Polywrap Origin (0.9.1)
## Bugs
* [PR-1320](https://github.com/polywrap/toolchain/pull/1320) `@polywrap/ethereum-plugin-js`: Proper `view` method result parsing.
* [PR-1317](https://github.com/polywrap/toolchain/pull/1317) `@polywrap/core-js`, `@polywrap/uri-resolvers-extensions-js`: Properly check for null when using UriResolverExtensionFileReader to read wasm module.
* [PR-1318](https://github.com/polywrap/toolchain/pull/1318) `polywrap` CLI: The `codegen` command properly applies the `-g, --codegen-dir` option.
* [PR-1318](https://github.com/polywrap/toolchain/pull/1318) `@polywrap/templates`: Fix several issues within the `wasm` template projects.
* [PR-1316](https://github.com/polywrap/toolchain/pull/1316) `polywrap` CLI: Fix an issue where the CLI process would hang after the command had completed.
* [PR-1315](https://github.com/polywrap/toolchain/pull/1315) `polywrap` CLI: Minor cleanup post logging refactor.
* [PR-1310](https://github.com/polywrap/toolchain/pull/1310) `polywrap` CLI: Use base images from the "polywrap" Docker Hub organization.

# Polywrap Origin (0.9.0)
## Features
* [PR-1306](https://github.com/polywrap/toolchain/pull/1306) `polywrap` CLI: Console logging has been improved, and all commands now support `-q, --quiet` and `-v, --verbose` options.
* [PR-1204](https://github.com/polywrap/toolchain/pull/1204) `polywrap` CLI: **Build times are faster for wasm wrappers!!!** The `build` command has been updated to include the concept of "build strategies". The existing way of building (via `Dockerfile` image layers) is available through the `polywrap build --strategy image` command. Building without Docker (if all build-time dependencies are installed locally) can be performed using `--strategy local`. And lastly, the new default build strategy is `--strategy vm`, which runs all build steps in a pre-built base image, allowing for near-local speeds (once the image has been downloaded).
  * NOTE: `--strategy image` is useful for source-code verification, something we'll be better supporting in the future.
* [PR-1297](https://github.com/polywrap/toolchain/pull/1297) `@polywrap/schema-bind`: `wasm/rust` now has support for `println!(...)` and `print!(...)` macros. They have been redefined to use the `polywrap_wasm_rs::wrap_debug_log(...)` function.
* [PR-1192](https://github.com/polywrap/toolchain/pull/1192) `@polywrap/client-js`: `PolywrapClient.invoke(...)` now supports invoke-time environment variables, passed in via the `env` property.
* [PR-1270](https://github.com/polywrap/toolchain/pull/1270) `polywrap` CLI: The `manifest` command has been added:
```
Usage: polywrap manifest|m [options] [command]
Inspect & Migrade Polywrap Manifests
Options:
  -h, --help                  display help for command
Commands:
  schema|s [options] [type]   Prints out the schema for the current manifest format.
  migrate|m [options] [type]  Migrates the polywrap project manifest to the latest version.
  help [command]              display help for command
```
  * [PR-1301](https://github.com/polywrap/toolchain/pull/1301) Added a `--format` option to the `migrate` command, enabling the targeting of specific format versions when migrating manifests (ex: `polywrap manifest migrate -f 0.2.0`).
* [PR-1218](https://github.com/polywrap/toolchain/pull/1218) `polywrap` CLI, `@polywrap/tracing-js`: The `tracing` infrastructure module (i.e. `polywrap infra up --modules tracing`) now uses version `0.11.0` of the `SizNoz` tracing service. Additionally the underlying `@polywrap/tracing-js` library has been updated to support this, and also now has named traces via the `traceName` configuration property.

## Bugs
* [PR-1304](https://github.com/polywrap/toolchain/pull/1304) `polywrap` CLI: Generated build files from the `vm` strategy now have proper file-system permissions.
* [PR-1305](https://github.com/polywrap/toolchain/pull/1305) `@polywrap/ipfs-plugin-js`: Fallback providers are now properly being used.
* [PR-1296](https://github.com/polywrap/toolchain/pull/1296) `polywrap` CLI: The `polywrap.app.yaml` and `polywrap.plugin.yaml` project manifest file names are being deprecated in favor of a unified `polywrap.yaml` file for all types of projects (wasm, interface, plugin, app). They will still silently work now, but in the future will no longer be recognized defaults.
* [PR-1303](https://github.com/polywrap/toolchain/pull/1303) `@polywrap/core-js`: The `Uri` class now properly formats itself when being `JSON.stringify(...)`'d.
* [PR-1288](https://github.com/polywrap/toolchain/pull/1288) `@polywrap/core-js`: Correctly handle errors in the `getImplementations` algorithm.
* [PR-1298](https://github.com/polywrap/toolchain/pull/1298) `@polywrap/ipfs-plugin-js`, `@polywrap/ipfs-resolver-plugin-js`: Remove the use of `require(...)` statements.
* [PR-1286](https://github.com/polywrap/toolchain/pull/1286) `@polywrap/polywrap-manifest-types-js`: Manifest migration logic has been upgraded to use a strategy that finds a "shortest path" between the `from` and `to` format versions, using predefined migration functions.

## Breaking Changes
* [PR-1284](https://github.com/polywrap/toolchain/pull/1284) `@polywrap/core-js`: `Wrapper.getFile(...)` and `Wrapper.getManifest(...)` no longer require a `Client` instance as a second function argument.
* [PR-1291](https://github.com/polywrap/toolchain/pull/1291) `@polywrap/core-js`, `@polywrap/client-js`: All `ClientConfig` properties are now `readonly`.
* [PR-1287](https://github.com/polywrap/toolchain/pull/1287) `@polywrap/core-js`: `executeMaybeAsyncFunction` has been removed.
* [PR-1277](https://github.com/polywrap/toolchain/pull/1277) `@polywrap/client-js`: The following methods now return the `Result<T, E>` type, and will not throw exceptions: `getManifest(...)`, `getFile(...)`, `getImplementations(...)`, `query(...)`, `invokeWrapper(...)`, `invoke(...)`, `loadWrapper(...)`.
* [PR-1192](https://github.com/polywrap/toolchain/pull/1192) `@polywrap/client-js`: `PolywrapClient.invoke(...)` no longer accepts invoke-time reconfiguration via the `config` property. Users who wish to reconfigure the client can do so by calling `client.getConfig()`, modifying it via the `ClientConfigBuilder`, and constructing a new `PolywrapClient` instance.

# Polywrap Origin (0.8.0)
## Features
* [PR-1083](https://github.com/polywrap/toolchain/pull/1083) `@polywrap/client-config-builder-js`: The default client config now has the ability to resolve `http` URIs (ex: `wrap://http/domain.com/path`) via the `@polywrap/http-resolver-plugin-js`.
* [PR-1083](https://github.com/polywrap/toolchain/pull/1083) `polywrap` CLI: Hosting & deploying wrappers via HTTP is now possible with the new `http` deploy & infra modules.
* [PR-1097](https://github.com/polywrap/toolchain/pull/1097) & [PR-1272](https://github.com/polywrap/toolchain/pull/1272) `polywrap` CLI, `@polywrap/polywrap-manifest-schemas`, `@polywrap/polywrap-manifest-types-js`: `polywrap.deploy.yaml` format version `0.2.0` has been added, making the schema similar to the `polywrap.test.yaml` schema, where users define a series of `jobs` to be performed.
* [PR-1097](https://github.com/polywrap/toolchain/pull/1097) `polywrap` CLI: Recursive ENS domain name registration is now supported via the `ens-recursive-name-register` deploy module.
* [PR-1060](https://github.com/polywrap/toolchain/pull/1060) `@polywrap/ipfs-interface`: Added `fallbackProviders: [String!]` to `type Options`.
* [PR-1169](https://github.com/polywrap/toolchain/pull/1169) `@polywrap/core-js`, `@polywrap/client-js`: URI resolution has been refactored. Resolution is now implemented in a single `IUriResolver` instance.
* [PR-1169](https://github.com/polywrap/toolchain/pull/1169) `@polywrap/client-js`: `invokeWrapper(...)` has been added to the `PolywrapClient` class.
* [PR-1169](https://github.com/polywrap/toolchain/pull/1169) `@polywrap/client-config-builder-js`: `setResolver(...)` has been added, enabling users to set the `IUriResolver` instance on the builder's `ClientConfig`.
* [PR-1133](https://github.com/polywrap/toolchain/pull/1133) `@polywrap/core-js`, `@polywrap/client-js`: `getPluginByUri(...)` has been added to the `Client` interface, and `PolywrapClient` class.
* [PR-1231](https://github.com/polywrap/toolchain/pull/1231) `polywrap` CLI: `build` command now supports the `--no-codegen` option, which disables the automatic codegen step when compiling projects.

## Bugs
* [PR-1244](https://github.com/polywrap/toolchain/pull/1244) `polywrap` CLI: Workflows can now properly access nested properties of previous job step output.
* [PR-1243](https://github.com/polywrap/toolchain/pull/1243) `@polywrap/schema-compose`: Multi-line imports are now properly supported within block comments.
* [PR-1097](https://github.com/polywrap/toolchain/pull/1097) `polywrap` CLI: ENS deployment URIs generated via the `deploy` command now properly contain the network's name in the URI.
* [PR-1234](https://github.com/polywrap/toolchain/pull/1234) `polywrap` CLI: The `run` command and underlying `Workflow` system has had multiple bug fixes added.
  * Workflow validation always printed "SUCCESS" and errors were never printed.
  * Workflow manifest was not being validated.
  * The stderr messages were not being output (previously unnoticed because errors were not printed).
* [PR-1220](https://github.com/polywrap/toolchain/pull/1220) `@polywrap/schema-bind`: `wasm/rust` bindings handle the serialization of reserved words via serde, so that the original name of properties is reserved during encoding.
* [PR-1219](https://github.com/polywrap/toolchain/pull/1219) `@polywrap/schema-bind`: `wasm/rust` bindings now properly handle imported interface modules.
* [PR-1229](https://github.com/polywrap/toolchain/pull/1229) `polywrap` CLI: `run` command now properly resolves the `validation: ...` property within the `polywrap.test.yaml` manifest relative to the manifest's directory, instead of the user's cwd.

## Breaking Changes
* [PR-1097](https://github.com/polywrap/toolchain/pull/1097) `polywrap` CLI: The `local-dev-ens` deploy module has been removed.
* [PR-1060](https://github.com/polywrap/toolchain/pull/1060) `@polywrap/ipfs-plugin-js`: `IpfsPluginConfig` has been removed, and all properties (`provider`, `fallbackProviders`) have been moved into the wrapper's `Env`.
* [PR-1169](https://github.com/polywrap/toolchain/pull/1169) `@polywrap/client-js`: `loadUriResolvers(...)` has been removed from the `PolywrapClient` class.
* [PR-1169](https://github.com/polywrap/toolchain/pull/1169) `@polywrap/client-js`: `resolveUri(...)` has been renamed to `tryResolveUri(...)` on the `PolywrapClient` class.
* [PR-1169](https://github.com/polywrap/toolchain/pull/1169) `@polywrap/core-js`, `@polywrap/client-js`: `getUriResolvers(...)` has been renamed to `getUriResolver(...)` on the `Client` interface and `PolywrapClient` class.
* [PR-1169](https://github.com/polywrap/toolchain/pull/1169) `@polywrap/client-config-builder-js`: `addUriResolver(...)` and `setUriResolvers(...)` have been removed from the `ClientConfigBuilder` class.
* [PR-1169](https://github.com/polywrap/toolchain/pull/1169) `@polywrap/core-js`, `@polywrap/wasm-js`: Moved the `WasmWrapper` class and all related types into their own package named `@polywrap/wasm-js`.
* [PR-1235](https://github.com/polywrap/toolchain/pull/1235) `@polywrap/core-js`: `Uri.from(...)` has been added, and `toUri(...)` has been removed.

# Polywrap Origin (0.7.0)
## Bugs
* [PR-1158](https://github.com/polywrap/toolchain/pull/1158) `@polywrap/client-config-builder-js`: The following plugins have been removed from the default config, and replaced with their WebAssembly wrapper equivalents available at the same URIs:
  * `wrap://ens/uts46.polywrap.eth`
  * `wrap://ens/sha3.polywrap.eth`
  * `wrap://ens/graph-node.polywrap.eth`
* [PR-1213](https://github.com/polywrap/toolchain/pull/1213) `@polywrap/schema-bind`: Nested map types (i.e. `Map<K, Map<K, V>>`) are now properly supported for `wasm/rust` and `wasm/assemblyscript`.
* [PR-1213](https://github.com/polywrap/toolchain/pull/1213) `@polywrap/wasm-as`: Nested map types (i.e. `Map<K, Map<K, V>>`) are now properly msgpack encoded.
* [PR-1212](https://github.com/polywrap/toolchain/pull/1212) `polywrap` CLI: `wasm/rust` build image now uses the `build-deps` cargo extension to properly build dependencies in a seperate Dockerfile layer, enabling the caching of compiled artifacts.

## Breaking Changes
* [PR-1217](https://github.com/polywrap/toolchain/pull/1217) `@polywrap/schema-bind`: `plugin/typescript` and `app/typescript` bindings have been updated to improve type safety, and no longer accept generic properties for all method argument types.
* [PR-1051](https://github.com/polywrap/toolchain/pull/1051) `polywrap` CLI: `polywrap plugin codegen` and `polywrap app codegen` commands have been moved into the `polywrap codegen`, which can now generate types for any Polywrap project (wasm, plugin, app).
* [PR-1154](https://github.com/polywrap/toolchain/pull/1154) `@polywrap/schema-bind`: The `wasm/assemblyscript` bindings have been updated to use `Box<T> | null` for all optional scalar types, instead of the `Option<T>` class used before.
* [PR-1154](https://github.com/polywrap/toolchain/pull/1154) `@polywrap/ws-plugin-js`: The WebSocket plugin's schema has been updated to use `UInt32` for socket IDs, instead of `Int32`.

# Polywrap Origin (0.6.0)
## Features
* [PR-1100](https://github.com/polywrap/toolchain/pull/1100) `polywrap` CLI: A new manifest named `polywrap.test.yaml` has been added, which encapsulates workflows and validation scripts.
* [PR-1100](https://github.com/polywrap/toolchain/pull/1100) `@polywrap/polywrap-manifest-types-js`: `polywrap.test` manifest types have been added.
* [PR-1100](https://github.com/polywrap/toolchain/pull/1100) `@polywrap/polywrap-manifest-schemas`: `polywrap.test` manifest schema has been added.

## Bugs
* [PR-1205](https://github.com/polywrap/toolchain/pull/1205) `polywrap` CLI: The `run` command's output now has deterministic ordering for text emitted from both workflow & validation steps.
* [PR-1194](https://github.com/polywrap/toolchain/pull/1194) `@polywrap/msgpack-js`: Nested `Map<K, V>` serialization is now supported.
* [PR-1199](https://github.com/polywrap/toolchain/pull/1199) `@polywrap/core-js` `@polywrap/client-js`: Runtime type inference has been improved to be compatible with JavaScript minimization optimizations where the `Class.name` static property is removed.
* [PR-1196](https://github.com/polywrap/toolchain/pull/1196) `@polywrap/core-js`: All `WrapperCache` interface methods have been updated to return `MaybeAsync` promises, allowing developers to implement async logic.

## Breaking Changes
* [PR-1100](https://github.com/polywrap/toolchain/pull/1100) `polywrap` CLI: `run` command no longer accepts the `<workflow>` argument, and instead uses the new `polywrap.test.yaml` manifest.
* [PR-1100](https://github.com/polywrap/toolchain/pull/1100) `@polywrap/client-js`: The `run` method has been removed.
* [PR-1100](https://github.com/polywrap/toolchain/pull/1100) `@polywrap/core-js`: All `Workflow` related types have been removed, and migrated into the manifest packages and the CLI.

# Polywrap Origin (0.5.0)
## Features
* [PR-1042](https://github.com/polywrap/toolchain/pull/1042) `@polywrap/client-js`: The `PolywrapClientConfig` now has a `tracerConfig: Partial<TracerConfig>` property, allowing users to easily configure the tracing level, and various toggles related to tracing.
* [PR-1042](https://github.com/polywrap/toolchain/pull/1042) `polywrap` CLI: Added the `tracer` infra module, allowing developers to easily spin up an OpenTelemetry compatible tracing server. This can be used to gather runtime tracelog events from the `PolywrapClient`.
* [PR-1042](https://github.com/polywrap/toolchain/pull/1042) `@polywrap/tracing-js`: The `@Tracer.traceMethod()` function decorator now has an optional `TracingLevel` argument.
* [PR-1143](https://github.com/polywrap/toolchain/pull/1143) `@polywrap/ethereum-plugin-js`: The `EthereumPluginConfig` now has a `connections` property, which takes an instance of the `Connections` class. This new implementation makes configuring new network connections at runtime easier and more application developer friendly.
* [PR-1045](https://github.com/polywrap/toolchain/pull/1045) `@polywrap/client-config-builder-js`: The `ClientConfigBuilder` has been added to make building & customizing `PolywrapClientConfigs` easier than before with a simple user friendly interface.
* [PR-1036](https://github.com/polywrap/toolchain/pull/1036) `@polywrap/client-js`: Added the `wrapperCache: WrapperCache` property to the `PolywrapClientConfig` interface.
* [PR-1036](https://github.com/polywrap/toolchain/pull/1036) `@polywrap/core-js`: Added the `WrapperCache` core type, along with a `SimpleCache` implementation that persists wrappers within a map.

## Bugs
* [PR-1186](https://github.com/polywrap/toolchain/pull/1186) `@polywrap/schema-bind`: Using a `Map<K, V>` type within the `Map`'s value (`V`) template argument has been fixed.
* [PR-1179](https://github.com/polywrap/toolchain/pull/1179) `polywrap` CLI: Improved the readability of the `polywrap build -v` command's output from the Docker child process.

## Breaking Changes
* [PR-1042](https://github.com/polywrap/toolchain/pull/1042) `@polywrap/client-js`: The `PolywrapClientConfig`'s `tracingEnabled` property has been removed, and replaced by `tracerConfig`.
* [PR-1143](https://github.com/polywrap/toolchain/pull/1143) `@polywrap/ethereum-plugin-js`: The `EthereumPluginConfig`'s `networks` property has been removed, and replaced by `connections`.
* [PR-1045](https://github.com/polywrap/toolchain/pull/1045) `@polywrap/client-js`: The `getDefaultClientConfig()` & `defaultIpfsProviders` exports have been moved to the `@polywrap/client-config-builder-js` package.

# Polywrap Origin (0.4.1)
## Features
* [PR-1171](https://github.com/polywrap/monorepo/pull/1171) `@polywrap/schema-bind`: Handle reserve words (keywords) for object, enum, and method names.

## Bugs
* [PR-1168](https://github.com/polywrap/monorepo/pull/1168) `@polywrap/schema-bind`: Fix imported optional map issue in Rust bindings.
* [PR-1167](https://github.com/polywrap/monorepo/pull/1167) Remove all `wrap-man` folders, that were published to solve the plugin's circular dependency issue.

# Polywrap Origin (0.4.0)
## Features
* [PR-1091](https://github.com/polywrap/monorepo/pull/1091) `@polywrap/polywrap-manifest-schemas`: Polywrap project manifests (`polywrap.yaml`, `polywrap.app.yaml`, `polywrap.plugin.yaml`) have a new format `0.2.0`, which restructures the manifest into 3 top level properties: `project`, `source`, and `extensions`. Additionally all project manifests can be given the `polywrap.yaml` file name.
* [PR-1092](https://github.com/polywrap/monorepo/pull/1092) `@polywrap/ws-plugin-js`: Added a WebSocket plugin.
* [PR-1096](https://github.com/polywrap/monorepo/pull/1096) `@polywrap/client-js`: Expose the `noValidate` option for the `client.getManifest(...)` method.
* [PR-820](https://github.com/polywrap/monorepo/pull/820) `polywrap` CLI: `docgen` command added, allowing wrapper developers to easily generate documentation. Supported formats: schema, docusaurus, jsdoc.
* [PR-1068](https://github.com/polywrap/monorepo/pull/1068) `@polywrap/ethereum-plugin-js`: `requestAccounts` method added, which utilizes the `eth_requestAccounts` RPC method on the configured provider.

## Bugs
* [PR-1142](https://github.com/polywrap/monorepo/pull/1142) `wasm/rust`: `Map<K, V>` bugs have been fixed.
* [PR-1140](https://github.com/polywrap/monorepo/pull/1140) `polywrap` CLI: Added a check to make sure the Docker daemon is running, and provides an informative error if it is not.
* [PR-1090](https://github.com/polywrap/monorepo/pull/1090) `polywrap/wrap-manifest-types-js`: Remove runtime schema bundling, which required file system access.
* [PR-1050](https://github.com/polywrap/monorepo/pull/1050) `polywrap` CLI: Errors encounted in child processes now output both `stdtypesout` and `stderr`, allowing easier end-user debugging.

## Breaking Changes
* [PR-1046](https://github.com/polywrap/monorepo/pull/1046) `polywrap` CLI: `schema.graphql` has been removed from wrapper build artifacts. `polywrap.plugin.yaml` has been removed from plugin build artifacts.
* [PR-1046](https://github.com/polywrap/monorepo/pull/1046) `@polywrap/schema-bind`: `schema.ts` has been removed from typescript bindings.
* [PR-1046](https://github.com/polywrap/monorepo/pull/1046) `@polywrap/schema-bind` `@polywrap/schema-compose`: `WrapAbi` is now used in all places, instead of schema documents.
* [PR-1095](https://github.com/polywrap/monorepo/pull/1095) `@polywrap/http-plugin-js`: Use `Map<String, String>` for `headers` & `urlParams`.
* [PR-1073](https://github.com/polywrap/monorepo/pull/1073) `@polywrap/schema-compose`: The `ComposerOptions` property `schemas: SchemaFile[]` has been replaced with `schema: SchemaFile`. Additionally the function argument `schemas: SchemaFile[]` on the `resolveImports` function has bee replaced with `schema: SchemaFile`.
* [PR-1073](https://github.com/polywrap/monorepo/pull/1073) `@polywrap/wrap-manifest-types-js`: In `WrapAbi` format `0.1`, properties no longer accept `null` and instead use `undefined`. 
* [PR-1073](https://github.com/polywrap/monorepo/pull/1073) `@polywrap/schema-parse`: `Abi` export renamed to `WrapAbi`.

# Polywrap Origin (0.3.0)
## Features
* [PR-1034](https://github.com/polywrap/monorepo/pull/1034) `@polywrap/wrap-manifest-schemas`, `@polywrap/wrap-manifest-types-js`: Added a JSON-schema for the `wrap.info`'s `abi` field.
* [PR-1058](https://github.com/polywrap/monorepo/pull/1058) `polywrap` CLI: Deploy results can now be output to a file using the `-o, --output-file <path>` option of the `deploy` command.

## Bugs
* [PR-1034](https://github.com/polywrap/monorepo/pull/1034) `@polywrap/wrap-manifest-schemas`, `@polywrap/polywrap-manifest-schemas`: Version numbers for the manifest's `format: ...` field have been changed to only include `<major>.<minor>` (ex: `0.1.0` is now `0.1`). This is because there cannot be a change to a pure interface that is a `<patch>`.
* [PR-1034](https://github.com/polywrap/monorepo/pull/1034) `@polywrap/package-validation`: The `wrap.info.abi` field is no longer being validated via schema rendering, and is instead utilizing the newly added JSON-schema.
* [PR-1054](https://github.com/polywrap/monorepo/pull/1054) `polywrap` CLI: Improved `wasm/rust` build times by refactoring the build image's Dockerfile, helping reduce cache invalidations.
* [PR-1053](https://github.com/polywrap/monorepo/pull/1053) `@polywrap/wasm-as`: Increased minor version of as-bignumber. The new version has a bug fix for the toFixed method, which was incorrectly printing numbers when a decimal number was rounded to an integer.

## Breaking Changes
* [PR-1034](https://github.com/polywrap/monorepo/pull/1034) `@polywrap/wrap-manifest-types-js`: `deserializeWrapManifest` is now `async`.

# Polywrap Origin (0.2.0)
## Bugs
* [PR-1040](https://github.com/polywrap/monorepo/pull/1040) `polywrap` CLI: Added proper CORS handling for the IPFS node located within the `eth-ens-ipfs` default infra module.

## Breaking Changes
* [PR-1035](https://github.com/polywrap/monorepo/pull/1035) `polywrap.meta` Manifest: Removed the `queries` property from version `0.1.0` of the manifest.
* [PR-1039](https://github.com/polywrap/monorepo/pull/1039) `@polywrap/ipfs-resolver-plugin-js`: Remove the `IpfsResolverPlugin`'s config, as it was never being used.

# Polywrap Origin (0.1.1)
## Features
* [PR-1017](https://github.com/polywrap/monorepo/pull/1017) `@polywrap/templates`, `polywrap` CLI: Rust wasm wrapper project template has been added, and made available via the `polywrap create ...` CLI command.

## Bugs
* [PR-1016](https://github.com/polywrap/monorepo/pull/1016) `polywrap` CLI: Improved logging when running workflows using the `polywrap run ...` command.
* [PR-924](https://github.com/polywrap/monorepo/pull/924) `@polywrap/schema-parse`, `@polywrap/schema-bind`: Complex `Map<Key, Value>` type usages within wrapper schemas lead to incorrect bindings being generated. Additional tests + fixes have been added.

# Polywrap Origin (0.1.0)
![Public Release Announcement (2)](https://user-images.githubusercontent.com/5522128/177474776-76886b67-6554-41a9-841b-939728e273ca.png)

*"Good evening traveler, welcome to Polywrap, a planet in the WRAP galaxy. We're happy to have you here. Ask around, I'm sure someone can help you navigate this place..." - NPC*  

https://polywrap.io/

# Polywrap 0.0.1-prealpha.93
## Breaking Changes
* [PR-986](https://github.com/polywrap/monorepo/pull/986) WRAP build artifacts have been refined:
  * Wasm module name changed from `module.wasm` to `wrap.wasm`
  * Polywrap manifests are no longer written to build folder (except for project metadata).
  * The `wrap.info` is now the primary manifest file describing the wrapper:
    * `{ version, type, name, abi }`
    * [source](https://github.com/polywrap/monorepo/blob/7fd5b2faad2cb664044edde133d8e068d685d97a/packages/js/manifests/wrap/src/formats/wrap.info/0.0.1.ts)
    * encoded as msgpack binary file
  * `schema.graphql` remains but will be deprecated for `wrap.info`'s built-in `abi`.

# Polywrap 0.0.1-prealpha.92
## Features
* [PR-1006](https://github.com/polywrap/monorepo/pull/1006/files) `polywrap-wasm-rs`: Add Rust encoder unit tests.
* [PR-967](https://github.com/polywrap/monorepo/pull/967) `polywrap` CLI, `polywrap-wasm-rs`, `@polywrap/wasm-as`, `@polywrap/schema-parse`, `@polywrap/schema-compose`, `@polywrap/schema-bind`, `@polywrap/core-js`, `@polywrap/client-js`: Environment configuration for wrappers was refactored to enable environments at the method level, remove client env sanitization and adding support for Rust. `@env` annotation was introduced for methods declared in wrappers's schemas.
* [PR-1005](https://github.com/polywrap/monorepo/pull/1005) `@polywrap/core-js`, `@polywrap/client-js`: Refactored `client.subscribe` to use invoke syntax.

## Breaking Changes
* [PR-967](https://github.com/polywrap/monorepo/pull/967) Wasm runtime (`polywrap-wasm-rs`, `@polywrap/wasm-as`) changed invoke signature and imports/exports, schema pipeline (`@polywrap/schema-parse`, `@polywrap/schema-compose`, `@polywrap/schema-bind`) now supports external env imports and TypeInfo and `@env` annotation for methods, `polywrap` changed compiler's imports, `@polywrap/core-js` changed Plugin interface, `@polywrap/client-js` changed environment model implementation.
* [PR-1005](https://github.com/polywrap/monorepo/pull/1005) `@polywrap/core-js`, `@polywrap/client-js`: Refactored `client.subscribe` to use invoke syntax.

# Polywrap 0.0.1-prealpha.91
## Features
* [PR-989](https://github.com/polywrap/monorepo/pull/989/files) `@polywrap/core-js`: Add job status in workflow job's result object.
* [PR-992](https://github.com/polywrap/monorepo/pull/992) `polywrap` CLI: Allow configuring the client using the `--client-config` on all applicable commands.
* [PR-1000](https://github.com/polywrap/monorepo/pull/1000) `@polywrap/core-js`: Added the `encodeResult` property to `InvokeOptions`.
* [PR-1000](https://github.com/polywrap/monorepo/pull/1000) `@polywrap/core-js`: Introduced the concept of `Invoker` and `Invocable`.
* [PR-988](https://github.com/polywrap/monorepo/pull/988) `polywrap` CLI, `wasm/rust`: Updates to the default build-image (`Dockerfile`):
  * Added the system dependencies `clang`, `llvm` and `build-essentials`.
  * Added steps to remove any `wasm-bindgen` imports that may have been injected.

## Bugs
* [PR-1000](https://github.com/polywrap/monorepo/pull/1000) Fixed inconsistencies around `ArrayBuffer` and `Uint8Array`.
* [PR-1000](https://github.com/polywrap/monorepo/pull/1000) `@polywrap/client-js`: The `noDecode` flag (renamed to `encodeResult`) now enfoces the decoding properly, where before it could get confused with returning `Bytes` from a wrapper.
* [PR-981](https://github.com/polywrap/monorepo/pull/981) `polywrap-wasm-rs`: Remove the `wrap-invoke` feature because it is not being used at the moment.

## Breaking Changes
* [PR-980](https://github.com/polywrap/monorepo/pull/980) `@polywrap/schema-parse`: Rename `TypeInfo` from `Abi`.

# Polywrap 0.0.1-prealpha.90
## Features
* [PR-912](https://github.com/polywrap/monorepo/pull/912) [PR-930](https://github.com/polywrap/monorepo/pull/930) [PR-958](https://github.com/polywrap/monorepo/pull/958) All URI resolver extensions have been decoupled and moved into their own plugin packages:
  * `@polywrap/fs-resolver-plugin-js`
  * `@polywrap/ipfs-resolver-plugin-js`
  * `@polywrap/ens-resolver-plugin-js`
* [PR-912](https://github.com/polywrap/monorepo/pull/912) `@polywrap/file-system-interface` has been created to help standardize FileSystem wrapper implementations.
* [PR-930](https://github.com/polywrap/monorepo/pull/930) `@polywrap/ipfs-interface` has been created to help standardize IPFS wrapper implementations.

## Bugs
* [PR-957](https://github.com/polywrap/monorepo/pull/957) `@polywrap/schema-bind`: `plugin/typescript` module config type interfaces no longer inherit from `Record<string, unknown>`, making them more type-safe and less generic.

## Breaking Changes
* [PR-937](https://github.com/polywrap/monorepo/issues/937) [PR-960](https://github.com/polywrap/monorepo/pull/960) The term `Nullable` has been changed to `Optional` within the `wasm` wrapper codegen. Additionally in `wasm/assemblyscript` the `Nullable<T>` type has been changed to a rust-style `Optional<T>` type.
* [PR-972](https://github.com/polywrap/monorepo/pull/972) The term `input` in the context of invocations has been renamed to `args`.
* [PR-976](https://github.com/polywrap/monorepo/pull/976) The invocation `resultFilter` option has been deprecated, as it is a needless & unused feature.

# Polywrap 0.0.1-prealpha.89
## Features
* [PR-903](https://github.com/polywrap/monorepo/pull/903) `polywrap` CLI: Recipes have been re-worked into composable workflows, and they can be run using CLI commands.
* [PR-951](https://github.com/polywrap/monorepo/pull/951) `polywrap` CLI: Docker Buildx output option has been removed.
* [PR-944](https://github.com/polywrap/monorepo/pull/944) `@polywrap/schema-bind`, `@polywrap/wasm-as`: `Nullable` type has been replaced with `Option` in the Assemblyscript schema bindings.
* [PR-938](https://github.com/polywrap/monorepo/pull/938) `@polywrap/schema-bind`, `@polywrap/wasm-as`: Rollback of JSON serialization in the Assemblyscript schema bindings.

## Bugs
* [PR-946](https://github.com/polywrap/monorepo/pull/946) `@polywrap/test-env-js`: Path fix for `npmCLI` test utility.

## Breaking Changes
* [PR-903](https://github.com/polywrap/monorepo/pull/903) `polywrap` CLI: Running recipes via the `polywrap query ...` command has been deprecated in favor of a new workflows system, accessible via the `polywrap run ...` command.
* [PR-944](https://github.com/polywrap/monorepo/pull/944) `wasm/assemblyscript` Wrappers: `Nullable` type has been removed in favor of `Option` which also has a different interface.
* [PR-938](https://github.com/polywrap/monorepo/pull/938) `wasm/assemblyscript` Wrappers: `JSON` serializer and deserializer, and related methods `fromJson` and `toJson` have been removed in favor of `parse` and `stringify`.

# Polywrap 0.0.1-prealpha.88
## Bugs
* Various CI/CD fixes.

# Polywrap 0.0.1-prealpha.87
## Features
* [PR-928](https://github.com/polywrap/monorepo/pull/928) `@polywrap/manifest-schemas`: Inline documentation has been added to manifest JSON-schemas.
* [PR-933](https://github.com/polywrap/monorepo/pull/933) Validation package `@polywrap/package-validation` has been implemented to validate WASM wrapper packages.

## Bugs
* [PR-932](https://github.com/polywrap/monorepo/pull/932) `@polywrap/schema-bind`: Minor fix for JSON type schema bindings
* [PR-935](https://github.com/polywrap/monorepo/pull/935) `@polywrap/test-env-js`: Path fix for `npmCLI` test utility 

# Polywrap 0.0.1-prealpha.86
## Features
* [PR-923](https://github.com/polywrap/monorepo/pull/923) The Polywrap brand has been applied to the codebase.
* [PR-906](https://github.com/polywrap/monorepo/pull/906) The concept of `Mutation` and `Query` modules has been deprecated. Now all wrapper methods are defined within a single `Module`.

## Breaking Changes
* [PR-923](https://github.com/polywrap/monorepo/pull/923) All prior integrations using the "Web3API" packages must upgrade to the new "Polywrap" equivalents.
* [PR-906](https://github.com/polywrap/monorepo/pull/906) All wrappers created prior to this change are incompatible.

# Web3API 0.0.1-prealpha.85
## Features
* [PR-910](https://github.com/polywrap/monorepo/pull/910) `@web3api/cli`: `web3api.infra.yaml` manifests now support the concept of "default" modules.
* [PR-878](https://github.com/polywrap/monorepo/pull/878) `@web3api/client-js`: `Workflows` can now be run using the `client.run(...)` method. Integration into the Polywrap CLI will be released in the near future.

## Bugs
* [PR-908](https://github.com/polywrap/monorepo/pull/908) `@web3api/asyncify-js`: Improved WebAssembly import sanitization has been added, resolving an ambiguous error that was found when extraneous imports were added to a built module.
* [PR-902](https://github.com/polywrap/monorepo/pull/902) `@web3api/cli`: `w3 create plugin ...` & `w3 create app ...` now properly parse their expected `language` and `name` arguments.

# Web3API 0.0.1-prealpha.84
## Features
* [PR-328](https://github.com/polywrap/monorepo/pull/328) `@web3api/infra`: A modular infrastructure pipeline has been added to the CLI, available via the `w3 infra ...` command. This command allows for custom infra modules to be defined and combined, able to support any 3rd party services your development requires. This command supersedes the old `w3 test-env ...` command.
* [PR-898](https://github.com/polywrap/monorepo/pull/898) `@web3api/cli`: The `wasm/rust` default build image has been updated to include the `wasm-snip` utility, which helps remove dead code from the wasm modules in a post-processing step. This has reduce the average Rust-based wasm module's size by ~85%.
* [PR-885](https://github.com/polywrap/monorepo/pull/885) `@web3api/test-env-js`: A `buildApi` helper function has been added.

## Breaking Changes
* [PR-328](https://github.com/polywrap/monorepo/pull/328) `@web3api/cli`: The `w3 test-env ...` command has been removed and replaced by the `w3 infra ...` command.

# Web3API 0.0.1-prealpha.83
## Features
* [PR-870](https://github.com/polywrap/monorepo/pull/870) `@web3api/cli`: The `web3api.deploy.yaml` manifest file now supports the use of environment variables.
* [PR-866](https://github.com/polywrap/monorepo/pull/866) `@web3api/test-env-js`: The `buildAndDeployApi` test utility now supports recursive ENS subdomain registration.

## Bugs
* [PR-884](https://github.com/polywrap/monorepo/pull/884) `@web3api/client-js`: Plugin registrations are now properly sanitized, and overridden plugins will be removed from the plugins array.
* [PR-892](https://github.com/polywrap/monorepo/pull/892) `@web3api/cli`: Some minor fixes have been made to the `wasm/rust` build image's default Dockerfile.

# Web3API 0.0.1-prealpha.82
## Features
* [PR-699](https://github.com/polywrap/monorepo/pull/699) `@web3api/cli`: Support for Rust based WebAssembly wrappers has been added.

## Breaking Changes
* [PR-872](https://github.com/polywrap/monorepo/pull/872) `@web3api/schema-bind`: TypeScript bindings for both app & plugin projects now use `ArrayBuffer` to represent the schema's `Bytes` type, instead of the previous `Uint8Array`.

# Web3API 0.0.1-prealpha.81
## Features
* [PR-864](https://github.com/polywrap/monorepo/pull/864) `@web3api/react`: `useWeb3ApiInvoke` and `useWeb3ApiQuery` hooks now support configuring the client's environment, along with all other configuration options.
* [PR-808](https://github.com/polywrap/monorepo/pull/808) `@web3api/cli`: The `web3api.build.yaml` manifest now supports additional docker buildkit configuration options, including:
  * local docker image layer cache
  * custom image output location
  * remove image after build
  * remove builder instance after build
* [PR-827](https://github.com/polywrap/monorepo/pull/827) `@web3api/ethereum-plugin-js`: The provider's connection can now be configured via the wrapper's environment.
* [PR-807](https://github.com/polywrap/monorepo/pull/807) `@web3api/cli`: Make the CLI's Docker file-lock project specific, instead of global to the CLI installation.
## Bugs
* [PR-847](https://github.com/polywrap/monorepo/pull/847) `@web3api/templates`: The template projects used for the `w3 create ...` CLI command now have proper CI setup, and multiple bugs were fixed within them.
* [PR-861](https://github.com/polywrap/monorepo/pull/861) `@web3api/test-env-js`: The `buildAndDeployApi` function's `ensName` no longer assumes the `.eth` TLD is ommitted, and requires the user to provide it along with the domain name. This was the original behavior, and was modified in release `0.0.1-prealpha.75`.
## Breaking Changes
* [PR-859](https://github.com/polywrap/monorepo/pull/859) `@web3api/cli`: The CLI is now built using the `commander` package. The CLI's help text formatting has changed in structure as a result.

# Web3API 0.0.1-prealpha.80
## Bugs
* [PR-855](https://github.com/polywrap/monorepo/pull/855) Pinned `@types/prettier` to version `2.6.0` to fix [an issue](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/60310) that was created by the latest release.

# Web3API 0.0.1-prealpha.79
## Bugs
* [PR-852](https://github.com/polywrap/monorepo/pull/852) `@web3api/client-test-env`: The IPFS node's API endpoint now has CORS enabled via the following configuration properties:
  * API.HTTPHeaders.Access-Control-Allow-Origin: `["*"]`
  * API.HTTPHeaders.Access-Control-Allow-Methods: `["GET", "POST", "PUT", "DELETE"]`

# Web3API 0.0.1-prealpha.78
## Bugs
* Pinned `@types/prettier` to version `2.6.0` to fix [an issue](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/60310) that was created by the latest release.

# Web3API 0.0.1-prealpha.77
## Features
* [PR-846](https://github.com/polywrap/monorepo/pull/846) `@web3api/wasm-as`: Add support for automatic JSON serialization via the `@serial-as/transform` `asc` compiler transformation.
* [PR-846](https://github.com/polywrap/monorepo/pull/846) `@web3api/schema-bind`: Assemblyscript object types now have `Type.toJson(type)` and `Type.fromJson(json)` static helper methods added to all class instances.
* [PR-840](https://github.com/polywrap/monorepo/pull/840) `@web3api/cli`: Allow `async getClientConfig` functions within modules passed into the `w3 query` command's `--client-config` option.

# Web3API 0.0.1-prealpha.76
## Bugs
* [PR-836](https://github.com/polywrap/monorepo/pull/836) `@web3api/cli`: All commands properly handle the `--help` option.

# Web3API 0.0.1-prealpha.75
## Features
* [PR-814](https://github.com/polywrap/monorepo/pull/814) `@web3api/cli`: A modular deployment pipeline has been added to the CLI. It can be accessed via the `w3 deploy` command.

# Web3API 0.0.1-prealpha.74
## Bugs
* `@web3api/schema-bind`: Fix incorrect export from `plugin-ts` bindings.

# Web3API 0.0.1-prealpha.73
## Bugs
* [PR-821](https://github.com/polywrap/monorepo/pull/821) `@web3api/cli`: Fixed a codegen issue when generating types for plugins with only one module.

# Web3API 0.0.1-prealpha.72
## Features
* [PR-620](https://github.com/polywrap/monorepo/pull/620) Plugin DevExp Improvements: The plugin developer experience has been revised to be very close to the API development experience.
* [PR-697](https://github.com/polywrap/monorepo/pull/697) `BigNumber` Schema Type: The `BigNumber` type is now available for use as a base type for Web3API schemas.
* [PR-802](https://github.com/polywrap/monorepo/pull/802) `@web3api/cli`: `w3 query ...` command now supports the following options:
  * `-o, --output-file`: Output file path for the query result.
  * `-q, --quiet`: Suppress output.
* [PR-790](https://github.com/polywrap/monorepo/pull/790) `@web3api/schema-bind`: `wasm-as` bindings have been updated to include a helper function `requireEnv()`, which can be used to check if the environment is null or not.
* [PR-795](https://github.com/polywrap/monorepo/pull/795) `@web3api/templates`: The AssemblyScript & interface templates used for the `w3 create api ...` command has been updated to include metadata (descriptions, icons, etc).
* [PR-794](https://github.com/polywrap/monorepo/pull/794) `@web3api/templates`: The AssemblyScript template used for the `w3 create api assemblyscript ...` command has been updated to include e2e tests.

# Web3API 0.0.1-prealpha.71
## Features
* [PR-777](https://github.com/polywrap/monorepo/pull/777) `@web3api/client-js`: The `Web3ApiClient` now has a public method `loadUriResolvers()`, which will pre-fetch all URI resolver implementations.

## Bugs
* [Issue-715](https://github.com/polywrap/monorepo/pull/777) [PR-777](https://github.com/polywrap/monorepo/pull/777) `@web3api/client-js`: Custom URI resolver implementations now no longer cause an infinite loop during URI resolution.

## Breaking Changes
* [PR-777](https://github.com/polywrap/monorepo/pull/777) `@web3api/client-js`: `Web3ApiClient` public method `getResolvers(...)` renamed to `getUriResolvers(...)`.
* [PR-777](https://github.com/polywrap/monorepo/pull/777) `@web3api/client-js`: `Web3ApiClientConfig` property `resolvers` renamed to `uriResolvers`.

# Web3API 0.0.1-prealpha.70
## Bugs
* `@web3api/core-js`: Fixed the manifest migration script for `web3api.meta` from v1 to v3. The `name` property is now migrating properly to `displayName`.

# Web3API 0.0.1-prealpha.69
## Features
* [PR-669](https://github.com/polywrap/monorepo/pull/669) `Map<K, V>` schema base-type has been added.
* [PR-761](https://github.com/polywrap/monorepo/pull/761) Modules now subinvoke interface implementation wrappers through the `__w3_subinvokeImplementation` host import. This now gives us a specific import function for these sort of invocations, which can allow for additional types of verification features to be added by clients.
* [PR-769](https://github.com/polywrap/monorepo/pull/769) `@web3api/schema-bind`: Add support for `getImplementations` capability in TypeScript plugin (`plugin-ts`) codegen.
* [PR-763](https://github.com/polywrap/monorepo/pull/763) `@web3api/schema-bind`: The `schema-bind` project is now "module agnostic" and accepts an array of arbitrary modules, which it will pass directly to the different binding projects (`wasm-as`, `plugin-ts`, `app-ts`, etc).
* [PR-759](https://github.com/polywrap/monorepo/pull/759) `@web3api/manifest-schemas`: Added the `name: string` property to the `web3api` manifest.
* [PR-759](https://github.com/polywrap/monorepo/pull/759) `@web3api/manifest-schemas`: Renamed `web3api.meta`'s `name` property to `displayName`.
* [PR-772](https://github.com/polywrap/monorepo/pull/772) `@web3api/manifest-schemas`: Added the `tags: string[]` property to the `web3api.meta` manifest, allowing wrapper to developers to add tag keywords to their package's metadata, helping improve searchability on package indexers like The Polywrap Hub.
* [PR-747](https://github.com/polywrap/monorepo/pull/747) `@web3api/ethereum-plugin-js`: Changed all instances of the `chainId` property's type to `BigInt` from `UInt32`.
* [PR-776](https://github.com/polywrap/monorepo/pull/776) `@web3api/ethereum-plugin-js`: Added `getBalance` to the `Query` module, allowing callers to check the native balance of arbitrary addresses.

## Breaking Changes
* [PR-669](https://github.com/polywrap/monorepo/pull/669) Wrappers that utilize the new `Map<K, V>` schema base-type will break forward compatability of Polywrap clients.
  * Relevant Downstream Dependencies: `@web3api/client-js`
* [PR-761](https://github.com/polywrap/monorepo/pull/761) Modules that use the `getImplementations` capability for interfaces will now require the following host imports: `__w3_subinvokeImplementation`, `__w3_subinvokeImplementation_result_len`, `__w3_subinvokeImplementation_result`, `__w3_subinvokeImplementation_error_len`, `__w3_subinvokeImplementation_error`  
  * Relevant Upstream Dependencies: `@web3api/wasm-as`, `@web3api/schema-bind`, `@web3api/cli`, `@web3api/client-js`
* [PR-763](https://github.com/polywrap/monorepo/pull/763) `@web3api/schema-bind`: The entry point function's input & output types have changed.
* [PR-763](https://github.com/polywrap/monorepo/pull/763) `@web3api/cli`: The type of the expected export from user-defined codegen scripts has changed from:
```typescript
generateBinding = (
  output: OutputDirectory,
  typeInfo: TypeInfo,
  schema: string,
  config: Record<string, unknown>
) => void;
```
to
```typescript
generateBinding = (
  options: BindOptions
) => BindOutput;
```

## Bugs
* [PR-766](https://github.com/polywrap/monorepo/pull/766) `@web3api/client-js`: User-configured interface implementations now extend the default configuration's, instead of overwritting them.

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