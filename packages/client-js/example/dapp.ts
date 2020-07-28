import {
  Web3API,
  Ethereum,
  IPFS,
  query
} from "../src"

import gql from 'graphql-tag'

const ipfs = new IPFS({
  provider: "localhost:5001"
})

const ethereum = new Ethereum({
  provider: "localhost:8545"
})

const api = new Web3API({
  uri: "api.protocol.eth",
  portals: {
    ethereum,
    ipfs
  }
});

const response = query({
  api,
  query: gql`
    {
      objects { property }
    }
  `
})

response.data.objects.forEach((object) => {
  console.log(object.property)
})

const response = query({
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

console.log(response.data.return)
