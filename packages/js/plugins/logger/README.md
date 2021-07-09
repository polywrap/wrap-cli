# Consoler Logger Plugin

Console Logger plugin implements the `w3://ens/logger.core.web3api.eth` core Web3API interface. By default it logs all events using the Javascript `console` module. Different logging mechanisms can be set using the `LoggerConfig`.

## Log levels

- DEBUG
- INFO
- WARN
- ERROR

## Example

```ts
import { loggerPlugin, LogLevel } from "@web3api/logger-plugin-js";

const client = new Web3ApiClient({
  plugins: [{
    from: "w3://ens/js-logger.web3api.eth",
    to: loggerPlugin()
  }],
  interfaces: [{
    interface: "w3://ens/logger.core.web3api.eth",
    implementations: ["w3://ens/js-logger.web3api.eth"],
  }]
});

// For custom logging logic, initialize the logger like so:
// loggerPlugin((level: LogLevel, message: string) => { ... })

const response = await client.query<{ log: boolean }>({
  uri: "w3://ens/js-logger.web3api.eth",
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
