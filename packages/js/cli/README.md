# @polywrap/cli-js

Programmatically execute the Polywrap CLI

# Description

It allows user execute Polywrap CLI commands programmatically, with simple and type-safe methods.

# Usage

Build a wrapper:
``` typescript
import { Commands } from "@polywrap/cli-js;

async function main() {
  const wrapperPath = "/path/to/wrapper";

  const res = await Commands.build(
    { }, // build command options
    { cwd: wrapperPath }
  );

  console.log(res.stdout);
  console.log(res.stderr);
  console.log(res.exitCode);
}
```

# Reference

TODO
