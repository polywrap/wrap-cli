# IPFS Web3API package

## Functions

### Query

`catFile(ipfsUrl: String!, cid: String!): Bytes!`

Returns byte content of file, defined by provided _cid_.

`catToString(ipfsUrl: String!, cid: String!): String!`

Returns string content of file, defined by provided _cid_.

### Mutation

`addFile(ipfsUrl: String!, fileName: String!, data: Bytes!): AddResult!`

Saves file to ipfs, returns _name_, _hash_ and _size_ as `AddResult`.

## How To Run

### 1. Setup Test Env

```
yarn test:env:up
```

### 2. Build & Deploy The Web3API

```
yarn deploy
```

### 3. Test The Web3API Using A Query Recipe

```
yarn test
```

#### Remove Test Env

```
yarn test:env:down
```
