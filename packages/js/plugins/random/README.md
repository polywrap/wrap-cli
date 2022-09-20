# @polywrap/random-plugin-js

Polywrap plugin in JavaScript for generating a random numbers. In Node.JS it uses the `crypto` library, and in the browser it uses the `.crypto/msCrypto` library.

## Methods
### `getRandom(len: UInt32!): Bytes!`
Returns an array of random bytes. For example:
```typescript
const result = await client.invoke({
  uri: "ens/random.polywrap.eth",
  method: "getRandom",
  args: {
    len: 5
  }
});

// [123, 5, 75, 34, 253]
console.log(result.data);
```
