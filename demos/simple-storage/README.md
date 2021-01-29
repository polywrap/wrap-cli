# How To Run
## 0. Move To Protocol Directory
```
cd ./protocol
```

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
npx w3 build \
--ipfs http://localhost:5001 \
--test-ens simplestorage.eth
```

## 4. Test The Web3API Using A Query Recipe
```
npx w3 query ./recipes/e2e.json --test-ens
```
