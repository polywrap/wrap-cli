import {
  Web3API,
  // Ethereum,
  IPFS,
  query
} from "../src"

import gql from 'graphql-tag'

const ipfs = new IPFS({
  provider: "localhost:5001"
})

/*const ethereum = new Ethereum({
  access: Ethereum.READ_AND_WRITE,
  providers: {
    read: "localhost:8545",
    write: window.ethereum
  }
})*/

const api = new Web3API({
  uri: "api.protocol.eth",
  connections: {
    // ethereum,
    ipfs
  }
});

const objects = query({
  api,
  query: gql`
    {
      objects { property }
    }
  `
})

objects.forEach((object) => {
  console.log(object.property)
})

const result = query({
  api,
  query: gql`
    mutation Func($argument: String!) {
      func(argument: $argument) {
        return
      }
    }
  `,
  variables: {
    argument: "..."
  }
})

console.log(result.return)
