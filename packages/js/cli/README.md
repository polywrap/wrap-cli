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
  
  // wait for infra to be ready to go
  await awaitResponse("http://localhost:5001");

  // get path to the wrapper
  const wrapperPath: string = path.join(path.resolve(__dirname), "..");

  // build current wrapper with CLI
  await Commands.build(undefined, wrapperPath);

  // get invokable URI to the local wrapper build
  const wrapperUri = `fs/${wrapperPath}/build`;
});
```

# Reference

TODO
