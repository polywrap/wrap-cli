import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Web3ApiProvider, useWeb3ApiQuery } from "@web3api/react";
import { Uri, UriRedirect } from "@web3api/client-js";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";

// Needed for bundling the @web3api/client-js web worker
process.env.WORKER_PREFIX = "workerize-loader!";

function Test() {
  const ethereum = (window as any).ethereum;

  const redirects: UriRedirect[] = [
    {
      from: new Uri("w3://ens/ethereum.web3api.eth"),
      to: {
        factory: () => new EthereumPlugin({ provider: ethereum }),
        manifest: EthereumPlugin.manifest(),
      },
    },
    {
      from: new Uri("w3://ens/ipfs.web3api.eth"),
      to: {
        factory: () => new IpfsPlugin({ provider: "https://ipfs.io/api/v0/" }),
        manifest: IpfsPlugin.manifest(),
      },
    },
    {
      from: new Uri("w3://ens/ens.web3api.eth"),
      to: {
        factory: () => new EnsPlugin({}),
        manifest: EnsPlugin.manifest(),
      },
    },
  ];

  const ActionComponent = () => {
    useEffect(() => {
      (async () => {
        if (ethereum && ethereum.enable) {
          await ethereum.enable();
        }
      })();
    }, []);

    const { execute, data, errors } = useWeb3ApiQuery({
      uri: new Uri("ens/simplestorage.web3api.eth"),
      query: `mutation { deployContract }`,
    });

    console.log(errors);
    return (
      <>
        <p>Web3API: SimpleStorage Demo</p>
        {!data ? (
          <button onClick={execute}>Deploy Contract</button>
        ) : (
          <p>SimpleStorage Contract: {data.deployContract as string}</p>
        )}
        {errors && (
          <div>There's an error: {errors.map((e) => e.message).join(", ")}</div>
        )}
      </>
    );
  };

  return (
    <Web3ApiProvider redirects={redirects}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <ActionComponent />
        </header>
      </div>
    </Web3ApiProvider>
  );
}

export default Test;
