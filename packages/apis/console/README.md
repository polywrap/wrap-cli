# Console Web3API

Calls log on logger plugin at uri `w3://w3/logger`. Default logger logs to console, but can be overridden with redirect to custom logger web3api implementation.

### Log levels

- DEBUG
- INFO
- WARN
- ERROR

## Example

### Usage

In schema:
```graph
#import { Query } into Console  from "w3://ens/console.eth"

type Query {
  customMethod(): Boolean!
}
```

In code:

```ts
import { Console_Query } from "./w3";

function customMethod(): bool {
  Console_Query.info("some useful info about my API");

  return true;
}
```
### How To Run

### 1. Setup Test Env

```
yarn run test:env:up
```

### 2. Build & Deploy The Web3API

```
yarn run build
yarn run deploy
```

### 3. Test The Web3API Using A Query Recipe

```
npx w3 query ./recipes/e2e.json
```
