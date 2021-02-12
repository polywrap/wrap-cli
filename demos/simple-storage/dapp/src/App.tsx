import React from 'react';
import logo from './logo.svg';
import './App.css';
import { setupWeb3ApiClient } from "./setupWeb3ApiClient";
import { Web3ApiClient, Uri } from "@web3api/client-js";

// Needed for bundling the @web3api/client-js web worker
process.env.WORKER_PREFIX= 'workerize-loader!';

function App() {
  const [contract, setContract] = React.useState<string | undefined>(undefined);
  const [client, setClient] = React.useState<Web3ApiClient | undefined>(undefined);

  const deployContract = async () => {
    if (!client) {
      setClient(await setupWeb3ApiClient());

      if (!client) {
        return;
      }
    }

    console.log("querying")

    const { data, errors } = await client.query({
      uri: new Uri("ens/simplestorage.web3api.eth"),
      query: `mutation { deployContract }`
    });

    console.log(data)
    console.log(errors)

    if (errors) {
      console.error(errors);
    }

    if (data) {
      setContract(
        data.deployContract as string
      );
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Web3API: SimpleStorage Demo
        </p>
        {!contract ?
          (<button onClick={deployContract}>
            Deploy Contract
          </button>) :
          <p>SimpleStorage Contract: {contract}</p>
        }
        <button>
          Set Storage
        </button>
      </header>
    </div>
  );
}

export default App;
