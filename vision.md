# Goal:
Support legacy codegen (a.k.a. bindings). Effectively `polywrap codegen --legacy` but better!

## Under The Hood...

### Step 1: Define the Wrap's "codegen"

`polywrap.codegen.yaml`
```yaml
# Codegen
bindings: https://github.com/polywrap/wrap-rust-bindings
output: ./src/wrap

# polywrap.codegen.yaml Version
format: "origin-0.1"

# Needed by `polywrap codegen` so we don't loose context
# (ex: project.type, source.module, etc)
project: ./polywrap.yaml
```

### Step 2: Run Codegen

`polywrap codegen`

The CLI will clone & run the `bindings` repository at "https://github.com/polywrap/wrap-rust-bindings".

Extra Credit: When the `polywrap/wrap-rust-bindings` becomes a wrapper (and not just source code), the master branch can redirect to a wrapper `./URI` of a wasm wrapper ;)

### Step 3: Codegen Legacy Bindings

Replace:
https://github.com/polywrap/wrap-rust-bindings

With:
https://github.com/polywrap/wrap-rust-bindings/legacy

`/legacy` is a git tag. Could also have old versions if you don't want latest `wasm-rust-bindings`. This allows developers to generate runnable source code for their "now old" wrappers.

NOTE: If a user runs `polywrap project upgrade` we can add the legacy URL to the source directory.

### Conclusion

As we work on this new codegen style, I think some developers may still want to use the old. Ideally they shouldn't have to download a whole new CLI (<= 0.9) and run it.

A "best practice" we try to take with feature of breaking changes at the source code level.
