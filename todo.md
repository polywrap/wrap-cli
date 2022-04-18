# Mission
- make plugin development as similar to wrapper development as possible

# TODO
x finish the mutation module re-write in the CLI tests ->
x move onto the codegen tests -> update the tempalte project -> test: bind/client/cli/
x rename "sanitizeMutationEnv" and "sanitizeQueryEnv" to `sanitizeEnv` (<- lives in the module for wrappers and plugins)
x rewrite plugin typings + invocation flow to be similar to wasm modules
x update core/plugin types to support module-wise environments
x environment shouldn't be stored globally
x make sure all generated files have the header added

- figure out how to integrate the core changes into the client+CLI+plugins
-> hand-write the generated code for all plugins, use them in the client (plugins -> client -> cli)
-> build: plugin tsc, build cli + client, re-build plugins w/ new CLI (schema + manifest in build folder)
- - [x] ENS, [x] ETH, [x] FS, [x] Graph, [x] HTTP, [x] IPFS, [] Logger, [] Sha3, [] UTS46

- properly handle shared types
- add back entrypoint, use its directory as the "common directory"

!!!! How to handle shared config?


- environment should be fully typed in the JS case
- try to make things as fully typed as possible
- generated plugin types must compile
- CLI e2e tests should replicate an example developer's project, instead of only diffing the codegen.
- comment everything :P
- remove all @ts-nocheck, //@ts-ignore, make sure everything compiles, explicitely disable checks, move to
- make sure the no-config + no-env cases work as expected, and you don't have to pass in "{}"
- rename the "common" directory to "w3" everywhere
- how to handle the circular dependency w/ plugins & CLI... release CLI first, then update the plugins

CLI -> client -> plugins -> CLI (codegen) & core (plugin types)
- dynamically inject plugins, can still use CLI codegen w/o plugins

- cleanup
- fix circular dep
- make the all tests pass (CLI, client)
- add more tests for plugins

# Tests
- plugin shared env
- plugin different module envs
- plugin env sanitization

# Invoke Flow
- get module
- set environment
- call method

# Layout
```
* = no apart of codegen, but apart of template

w3 (common)/
  manifest.ts
  schema.ts
  plugin.ts

*index.ts

query/
  *index.ts
  w3 (module)/
    index.ts
    types.ts
    module.ts

mutation/
  *index.ts
  w3 (module)/
    index.ts
    types.ts
    module.ts
```