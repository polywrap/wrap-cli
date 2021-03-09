# How To Run

## 1. Setup Test Env

```
npx w3 test-env up
```

## 3. Build & Deploy The Web3API

```
npx w3 build \
--ipfs http://localhost:5001 \
--graph simplestorage,http://localhost:8020 \
--test-ens simplestorage.eth
```

## 4. Test The Web3API Using A Query Recipe

```
npx w3 query ./recipes/e2e.json --test-ens
```
