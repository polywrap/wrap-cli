# Polywrap JS Client (@polywrap/client-js)

The Polywrap client invokes functions of wrappers and plugins. It's designed to run in any environment that can execute JavaScript - browser, node, etc. Core utility functions are in core-js.

# Installation

``` shell
npm install @polywrap/client-js
```

# Usage

Use an `import` or `require` statement, depending on which your environment supports.

``` typescript
import { PolywrapClient } from "@polywrap/client-js";
```

Instantiate the PolywrapClient.

``` typescript
// Instantiate the client.
const client = new PolywrapClient();

// ...And then you'll be able to use the `query`
// method to send GraphQL requests to any Polywrap
// that's located at the specified URI.
const result = await client.query({
  uri: 'api.example.eth',
  query: `query {
    doSomething(
      variable: $variable
      value: "important value"
    ) {
      returnData
    }
  }`,
  variables: {
    variable: 555,
  },
});
```
# Workflows

The client provides a "run" method which takes a Workflow object and performs a chain of actions with multiple wrappers. For detailed examples see `src/__tests__/e2e/workflow.spec.ts`.
