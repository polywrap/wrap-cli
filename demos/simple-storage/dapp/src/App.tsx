import React from 'react';
import logo from './logo.svg';
import './App.css';
import gql from "graphql-tag";

import {
  Web3API,
  Ethereum,
  IPFS,
  Subgraph
} from "@web3api/client-js";

const client = new Web3APIClient({
  resolvers: [
    new Ethereum({ provider: (window as any).ethereum }),
    new IPFS({ provider: "http://localhost:5001" }),
    new Subgraph({ provider: "http://localhost:8020" })
  ]
})

client.query({
  uri: "simplestorage.eth",
  query: gql`
    mutation SetData($address: String!, $value: Int!) {
      setData(
        address: $address
        value: $value
      )
    }
  `
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
