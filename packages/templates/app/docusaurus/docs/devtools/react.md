---
id: polywrap-react
title: '@web3api/react'
---

<a href="https://www.npmjs.com/package/@web3api/react" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@web3api/react.svg" alt="npm"/>
</a>

<br/>
<br/>

The purpose of the Web3API React library is to simplify integration of Web3API into React applications.

## Installation

```bash
npm install @polywrap/react
```

## Usage

### Web3ApiProvider

To start using the Web3API React library, wrap your application in a `Web3ApiProvider`:

```typescript
import React from 'react';
import { Web3ApiProvider } from '@web3api/react';

export default function App() {
  return (
    <Web3ApiProvider>
      <div>{'Web3API enabled dApp goes here!'}</div>
    </Web3ApiProvider>
  );
}
```

The `Web3ApiProvider` instantiates the `Web3ApiClient` for all queries below it in the component tree.

The `Web3ApiProvider` also accepts URI redirects as props.

You can pass the redirects array into the provider component like so:

```typescript
<Web3ApiProvider redirects={ [...] }/>
```

If you need to use multiple providers, you can do so using the `createWeb3ApiProvider("...")` method, which accepts the name of your provider as an argument. For example:

```typescript
import { createWeb3ApiProvider } from '@polywrap/react';

const CustomWeb3ApiProvider = createWeb3ApiProvider('custom');

<CustomWeb3ApiProvider>
  <Custom />
</CustomWeb3ApiProvider>;
```

### useWeb3ApiQuery

The `useWeb3ApiQuery` is the primary API for executing queries. To run a query within a React component, call `useWeb3ApiQuery` and pass it a GraphQL query string. When your component renders, `useWeb3ApiQuery` returns an object from the Web3API client that contains `execute`, `data`, `loading`, and `error` properties you can use to render your UI.

Here's an example query that you could send:

```typescript
import { useWeb3ApiQuery } from '@polywrap/react';

const { execute, data, errors, loading } = useWeb3ApiQuery({
  uri: 'ens/api.helloworld.polywrap.eth',
  query: `{
    logMessage(message: "Hello World!")
  }`,
});
```

:::tip
By default, the `useWeb3ApiQuery` hook uses the first `Web3ApiProvider` found in the DOM's hierarchy. If you'd like to specify a specific provider to be used, simply set the provider: property:

```typescript
useWeb3ApiQuery({
  provider: 'custom',
  ...
});
```

:::
