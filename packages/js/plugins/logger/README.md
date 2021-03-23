# Consoler Logger Plugin

Console Logger plugin implements the `w3://w3/logger` core Web3API interface. By default it logs all events using the Javascript `console` module. Different logging mechanisms can be set using the `LoggerConfig`.

## Log levels

- DEBUG
- INFO
- WARN
- ERROR

## Example

```ts
import { loggerPlugin, LogLevel } from "@web3api/logger-plugin-js";

const client = new Web3ApiClient({
  redirects: {
    from: "w3://w3/logger",
    to: loggerPlugin()
  }
});

// For custom logging logic, initialize the logger like so:
// loggerPlugin((level: LogLevel, message: string) => { ... })

const response = await client.query<{ log: boolean }>({
  uri: "w3://w3/logger",
  query: `
    query {
      log(
        level: ${LogLevel.INFO}
        message: "Informational message"
      )
    }
  `
});
```
