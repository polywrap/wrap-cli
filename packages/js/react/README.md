# Polywrap React (@polywrap/react)

A React library that simplifies the integration of Polywrap wrappers into React applications. Instantiates the Polywrap Client, sends queries to the wrapper and renders query results.

# Usage

## PolywrapProvider

To start using the Polywrap React library, wrap your application in a `PolywrapProvider`:

```typescript
import React from 'react';
import { PolywrapProvider } from '@polywrap/react';

export const App: React.FC = () => {
  return (
    <PolywrapProvider>
        <HelloWorld />
    </PolywrapProvider>
  );
};
```

The `PolywrapProvider` instantiates the `PolywrapClient` for all queries below it in the component tree.

The `PolywrapProvider` also accepts URI redirects as props.

You can pass the redirects array into the provider component like so:

```typescript
<PolywrapProvider redirects={ [] }/>
```

If you need to use multiple providers, you can do so using the `createPolywrapProvider("...")` method, which accepts the name of your provider as an argument. For example:

```typescript
import { createPolywrapProvider } from '@polywrap/react';

const CustomPolywrapProvider = createPolywrapProvider('custom');

export const CustomProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <CustomPolywrapProvider>
      {children}
    </CustomPolywrapProvider>
  );
};
```

## usePolywrapQuery

The `usePolywrapQuery` is the primary API for executing queries. To run a query within a React component, call `usePolywrapQuery` and pass it a GraphQL query string. When your component renders, `usePolywrapQuery` returns an object from the Polywrap client that contains `execute`, `data`, `loading`, and `error` properties you can use to render your UI.

Here's an example query that you could send:

```typescript
const { execute, data, errors, loading } = usePolywrapQuery({
  uri: 'ens/api.helloworld.polywrap.eth',
  query: `{
    logMessage(message: "Hello World!")
  }`,
});
```

By default, the `usePolywrapQuery` hook uses the first `PolywrapProvider` found in the DOM's hierarchy. If you'd like to specify a specific provider to be used, simply set the provider: property:

```typescript
const { execute, data, errors, loading } = usePolywrapQuery({
  provider: "custom",
  uri: 'ens/api.helloworld.polywrap.eth',
  query: `{
    logMessage(message: "Hello World!")
  }`,
});
```

## **usePolywrapInvoke**

The `usePolywrapInvoke` hook works the same as the `usePolywrapQuery` hook, but uses the client's `invoke` syntax instead.

Here's what our "hello world" query from above would look like with `usePolywrapInvoke`.

```jsx
const { execute, data, error, loading } = usePolywrapInvoke({
  uri: 'ens/api.helloworld.polywrap.eth',
  module: "query",
  method: "logMessage",
  input: {
    message: "Hello World!",
  },
});
```

## **usePolywrapClient**

You can obtain a copy of the client instance from your `PolywrapProvider` using the `usePolywrapClient` hook.

```jsx
const client = usePolywrapClient();
```
