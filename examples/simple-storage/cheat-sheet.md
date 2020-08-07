# Smart Contract Development
## 1. Setup Test Env
```
npx w3 test-env up
```

## 2. Build & Deploy Contracts
```
node ./deploy-contracts.js
```

## 3. Build & Deploy Web3 API
```
npx w3 build \
--ipfs http://localhost:5001 \
--graph simplestorage,http://localhost:8020 \
--test-ens simplestorage.eth
```

## 3. Test
```
yarn test
```
or
```
npx w3 query ./recipes/e2e.json --test-ens
```

## Last but not least, dApp integration...
🤦





# dApp Development
## 1. Initialize Client


## 2. Query Protocol

