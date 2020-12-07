import React from 'react';
import logo from './logo.svg';
import './App.css';
import gql from "graphql-tag";

import { Uri, Web3APIClient } from "@web3api/client-js";

const client = new Web3APIClient({
  redirects: [
    {
      from: new Uri("ens://ethereum.web3api.eth"),
      to: new EthereumPlugin(window.ethereum)
    }
  ]
});

// Error: api.uniswap.eth requires an implementation for ethereum.web3api.eth, but none was found
client.query({
  uri: "ens://api.uniswap.eth", // requires ethereum.web3api.eth
  query: gql`
    mutation {
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
