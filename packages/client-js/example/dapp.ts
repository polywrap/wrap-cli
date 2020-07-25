import { createClient } from "../src"

import gql from 'graphql-tag'

const client = createClient({
  ethereum: "localhost:8080",
  ipfs: "localhost:5001"
})

const objects = client.query({
  api: "api.protocol.eth",
  query: gql`
    {
      objects { property }
    }
  `
})

objects.forEach((object) => {
  console.log(object.property)
})

const result = client.query({
  api: "api.protocol.eth",
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
