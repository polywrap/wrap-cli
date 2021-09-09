# How To Run

## 1. Setup Test Env

```
npx w3 test-env up
```

## 2. Build & Deploy SimpleStorage Contract

```
node ./scripts/deploy-contracts.js
```

This will output the deployed ENS contract addresses.

## 3. Fill constants JSON

Fill the corresponding contract addresses in the `constants.json file` with the addresses from the previous step.

Verify that the `Signer` value matches the signer used for transactions. Currently, Ganache's default: `0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1`

The `Domain` and `CID` values can be changed freely.

## 4. Build & Deploy The Web3API

```
npx w3 build --ipfs http://localhost:5001 --graph ens,http://localhost:8020 --test-ens ens.eth
```

## 5. Test The Web3API Using Query/Mutation Recipes

```
npx w3 query ./recipes/e2e.json --test-ens
```
