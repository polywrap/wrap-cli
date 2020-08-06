import {
  Ethereum,
  IPFS,
  Subgraph,
  Web3API
} from "@web3api/client-js";
import gql from "graphql-tag"

const api = new Web3API({
  uri: "api.myens.eth",
  portals: {
    ethereum: new Ethereum({ provider: window.ethereum }),
    ipfs: new IPFS({ provider: "localhost:5001" }),
    subgraph: new Subgraph({ provider: "localhost:8020" })
  }
})

const { data } = api.query({
  query: gql`
    mutation Deploy() {
      deployContract
    }
  `
})

const address = data.deployContract

api.query({
  query: gql`
    mutation SetData($address: String!, $value: Int!) {
      setData(address: $address, value: $value)
    }
  `,
  variables: {
    address: address,
    value: 5
  }
})

api.query({
  query: gql`
    query GetData($address: String!) {
      getData(address: $address)
    }
  `,
  variables: {
    address: address
  }
})

api.query({
  query: gql`
    query GetStorageContracts() {
      simplestorages {
        id
      }
    }
  `
})
