# Logger Plugin

Logger plugin calls javascript console.log with target log level and message.

## Log levels

- DEBUG
- INFO
- WARN
- ERROR

## Example

```ts
const response = await web3ApiClient.query<{ get: boolean }>({
uri: new Uri("w3://w3/logger"),
  query: `
    query {
      log(
        level: ${LogLevel.INFO}
        message: "Test message"
      )
    }
  `
})
```
