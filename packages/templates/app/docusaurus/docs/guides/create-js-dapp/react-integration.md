---
id: 'react-integration'
title: React integration
---

To use the Polywrap React integration, you'll need to install the `@web3api/react` package.

```bash
npm install --save @web3api/react
```

### **Web3ApiProvider**

Once installed, the first step is to add the `Web3ApiProvider` to your DOM. This will instantiate an instance of the `Web3ApiClient` for all queries within the nested DOM hierarchy to use.

To use the provider, simply wrap it around whatever DOM hierarchy you'd like to use Polywrap within:

```jsx
import React from 'react';
import { Web3ApiProvider } from '@web3api/react';

export default function App() {
  return (
    <Web3ApiProvider>
      <div>{'Polywrap enabled dApp goes here!'}</div>
    </Web3ApiProvider>
  );
}
```

#### **Web3ApiProvider Props**

The `Web3ApiProvider` component's props are the same as the `Web3ApiClient` constructor's arguments. For example, you can configure redirects like so:

```jsx
<Web3ApiProvider redirects={ [...] }/>
```

#### **Multiple Web3ApiProviders**

If you need to use multiple providers, you can do so using the `createWeb3ApiProvider("...")` method, which accepts the name of your provider as an argument. For example:

```jsx
import { createWeb3ApiProvider } from '@web3api/react';

const CustomWeb3ApiProvider = createWeb3ApiProvider('custom');

<CustomWeb3ApiProvider>
  <Custom />
</CustomWeb3ApiProvider>;
```

### **useWeb3ApiQuery**

usePolywrapQuery (loading, etc)

After enabling your React application with the Web3ApiProvider, you may now use the `useWeb3ApiQuery` hook to send Polywrap queries!

Here's what our "hello world" query from above would look like if we used this method.

```jsx
const { execute, data, errors, loading } = useWeb3ApiQuery({
  uri: 'ens/api.helloworld.polywrap.eth',
  query: `{
    logMessage(message: "Hello World!")
  }`,
});
```

:::tip
By default, the `useWeb3ApiQuery` hook uses the first Web3ApiProvider found in the DOM's hierarchy. If you'd like to specify a specific provider to be used, simply set the `provider:` property:

```jsx
useWeb3ApiQuery({
  provider: 'custom',
  ...
});
```

:::
