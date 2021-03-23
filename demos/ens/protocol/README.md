# How To Run

## 1. Setup Test Env

```
npx w3 test-env up
```

## 2. Build & Deploy SimpleStorage Contract

```
node ./deploy-contracts.js
```

## 3. Build & Deploy The Web3API

```
npx w3 build --ipfs http://localhost:5001 --graph ens,http://localhost:8020 --test-ens 0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab,ens.eth
```

## 4. Test The Web3API Using A Query Recipe

```
npx w3 query ./recipes/e2e.json --test-ens
```
