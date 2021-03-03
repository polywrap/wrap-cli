import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Uri, UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";

// Needed for bundling the @web3api/client-js web worker
process.env.WORKER_PREFIX= 'workerize-loader!';

function App() {
  const [contract, setContract] = React.useState<string | undefined>(undefined);
  const [client, setClient] = React.useState<Web3ApiClient | undefined>(undefined);

  async function setupClient() {
    const ethereum = (window as any).ethereum;
    if (ethereum && ethereum.enable) {
      await ethereum.enable();
    }

    const redirects: UriRedirect[] = [
      {
        from: new Uri("w3://ens/ethereum.web3api.eth"),
        to: {
          factory: () => new EthereumPlugin({ provider: ethereum }),
          manifest: EthereumPlugin.manifest()
        }
      },
      {
        from: new Uri("w3://ens/ipfs.web3api.eth"),
        to: {
          factory: () => new IpfsPlugin({ provider: 'https://ipfs.io/api/v0/' }),
          manifest: IpfsPlugin.manifest()
        }
      },
      {
        from: new Uri("w3://ens/ens.web3api.eth"),
        to: {
          factory: () => new EnsPlugin({ }),
          manifest: EnsPlugin.manifest()
        }
      }
    ];
    setClient(new Web3ApiClient({ redirects }));
  }

  const deployContract = async () => {
    if (!client) {
      await setupClient();

      if (!client) {
        return;
      }
    }

    console.log("querying")

    const { data, errors } = await client.query({
      uri: new Uri("ens/api.simplestorage.eth"),
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
