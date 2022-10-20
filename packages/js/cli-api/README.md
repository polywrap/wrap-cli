# @polywrap/cli-js

Programmatically execute the Polywrap CLI

# Description

It allows user execute Polywrap CLI commands programmatically, with simple and type-safe methods.

# Usage

Start infra and build a wrapper

``` typescript
import { Commands } from "@polywrap/cli-js;
import path from "path";

// test wrapper in a test environment
export async function foo({
  // spin up infra modules defined in a polywrap.infra.yaml manifest
  await Commands.infra({ verbose: true });

  // get path to the wrapper
  const wrapperPath: string = path.join(path.resolve(__dirname), "..");

  // build current wrapper with CLI
  await Commands.build(undefined, wrapperPath);

  // get URI to the local wrapper build
  const wrapperUri = `fs/${wrapperPath}/build`;
});
```

# Reference

TODO
