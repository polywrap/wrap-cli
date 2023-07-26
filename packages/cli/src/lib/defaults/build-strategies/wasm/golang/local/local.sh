# Ensure all go mod deps are correct
go mod tidy

# Reset our build-staging directory
rm -rf ./build-staging
mkdir ./build-staging

# Build the module with tinygo
tinygo build -o ./build-staging/module.wasm -target ./.polywrap/wasm/build/strategy-used/wasm-target.json ./module/wrap/main/main.go

# Extract the names of all "extra" exports from the wasm module
EXTRA_EXPORTS=$(
  # 1. convert to wasm text
  wasm2wat ./build-staging/module.wasm |
  # 2. extract all exports
  grep -oP '(?<=export ")[^"]+' |
  # 3. keep all necessary exports (wrap & asyncify)
  grep -vE '_wrap_invoke|asyncify_start_unwind|asyncify_stop_unwind|asyncify_start_rewind|asyncify_stop_rewind|asyncify_get_state' |
  # 4. convert remaining string into single-line seperated by spaces
  tr '\n' ' '
)

if [ -z "$EXTRA_EXPORTS" ]
then
  echo "No extra exports to remove"
  cp ./build-staging/module.wasm ./build-staging/module_exports.wasm
else
  echo "Removing extra exports: $EXTRA_EXPORTS"
  # Remove these extra exports from the wasm module via wasm-snip
  wasm-snip ./build-staging/module.wasm -o ./build-staging/module_exports.wasm $EXTRA_EXPORTS
fi

# Extract the unsupported wasi imports, and forcefully remove them.
# This ideally would not be necessary, but it is for go-based wraps.
EXTRA_IMPORTS=$(
  # 1. convert to wasm text
  wasm2wat ./build-staging/module_exports.wasm |
  # 2. extract all wasi imports
  grep -oP '(?<=wasi_snapshot_preview1" ")[^"]+' |
  # 3. convert string into single-line seperated by spaces
  tr '\n' ' '
)

if [ -z "$EXTRA_IMPORTS" ]
then
  echo "No extra imports to remove"
  cp ./build-staging/module_exports.wasm ./build-staging/module_exports_imports.wasm
else
  echo "Removing extra imports: $EXTRA_IMPORTS"
  # Remove these extra imports from the wasm module via wasm-snip
  wasm-snip ./build-staging/module_exports.wasm -o ./build-staging/module_exports_imports.wasm -p $EXTRA_IMPORTS
fi

# Optimize the module now that exports & imports are removed
wasm-opt ./build-staging/module_exports_imports.wasm -Oz --converge -o ./build-staging/module_exports_imports_opt.wasm

# Copy the result to the build folder
cp ./build-staging/module_exports_imports_opt.wasm ./build/wrap.wasm
