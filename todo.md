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
- environment should be fully typed in the JS case
- try to make things as fully typed as possible
- generated plugin types must compile
- CLI e2e tests should replicate an example developer's project, instead of only diffing the codegen.
- comment everything :P
- remove all @ts-nocheck, make sure everything compiles, explicitely disable checks
- make sure the no-config + no-env cases work as expected, and you don't have to pass in "{}"
- rename the "common" directory to "w3" everywhere
- how to handle the circular dependency w/ plugins & CLI... release CLI first, then update the plugins

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