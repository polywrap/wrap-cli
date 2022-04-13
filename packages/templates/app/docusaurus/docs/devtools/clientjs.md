---
id: polywrap-clientjs
title: '@web3api/client-js'
---

<a href="https://www.npmjs.com/package/@web3api/client-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@web3api/client-js.svg" alt="npm"/>
</a>

<br/>
<br/>

The Web3API JavaScript client exists to help developers integrate Web3API into their applications. It's designed to run in any environment that can execute JavaScript (think websites, node scripts, etc.).

## Installation

```bash
npm install @web3api/client-js
```

## Usage

Use an `import` or `require` statement, depending on which your environment supports.

```js
import { Web3ApiClient } from '@polywrap/client-js';
```

Then, you will be able to use the `Web3ApiClient` like so:

```js
async function main() {
  // Simply instantiate the Web3ApiClient.
  const client = new Web3ApiClient();

  // ...And then you'll be able to use the `query`
  // method to send GraphQL requests to any Web3API
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
}
```
