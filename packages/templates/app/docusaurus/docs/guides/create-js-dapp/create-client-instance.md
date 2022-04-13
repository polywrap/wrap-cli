---
id: 'create-client-instance'
title: 'Creating the Polywrap client instance'
---

Once the Polywrap JS client has been installed, the next step is to create a `Web3ApiClient` instance:

```typescript
import { Web3ApiClient } from '@web3api/client-js';

const client = new Web3ApiClient();
```

At this point, you can already send queries to Polywraps. In the simple example below, we send one to the "hello world" Polywrap.

```jsx
client.query({
  uri: 'ens/api.helloworld.web3api.eth',
  query: `{
    logMessage(message: "Hello World!")
  }`,
});
```
