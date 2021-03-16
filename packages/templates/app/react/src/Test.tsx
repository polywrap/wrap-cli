import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import { useWeb3ApiQuery, createWeb3ApiRoot } from "@web3api/react";
import { Uri, UriRedirect } from "@web3api/client-js";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";

const SimpleStorageProvider = createWeb3ApiRoot("simpleStorage");
// const OneInchProvider = createWeb3ApiRoot("ta");

const ActionComponent = () => {
  useEffect(() => {
    (async () => {
      const ethereum = (window as any).ethereum;
      if (ethereum && ethereum.enable) {
        await ethereum.enable();
      }
    })();
  }, []);

  const {
    execute: deployContract,
    data: deployData,
    loading: loadingDeploy,
    errors: deployContractErrors,
  } = useWeb3ApiQuery({
    key: "simpleStorage",
    uri: new Uri("ens/api.simplestorage.eth"),
    query: `mutation { deployContract }`,
  });

  const { execute: setData, loading: loadingSetData } = useWeb3ApiQuery({
    key: "simpleStorage",
    uri: new Uri("ens/api.simplestorage.eth"),
    query: `mutation {
      setData(options: {
        address: "${deployData?.deployContract}"
        value: 5
      })
    }`,
  });

  const { execute: getStorageData } = useWeb3ApiQuery({
    key: "simpleStorage",
    uri: new Uri("ens/api.simplestorage.eth"),
    query: `query {
      getData(
        address: "${deployData?.deployContract}"
      )
    }`,
  });

  return (
    <>
      <p>Web3API: SimpleStorage Demo</p>
      {loadingDeploy ? (
        <div>Processing your request...</div>
      ) : (
        <>
          {!deployData ? (
            <button onClick={deployContract}>Deploy Contract</button>
          ) : (
            <>
              <p>
                SimpleStorage Contract: {deployData.deployContract as string}
              </p>
              <button onClick={setData}>Set the storage to 5!</button>
              {loadingSetData ? <p> Setting data to 5...</p> : null}
              <button
                onClick={async () => {
                  const result = await getStorageData();
                  console.log(result?.data);
                }}
              >
                Check storage
              </button>
            </>
          )}
          {deployContractErrors && (
            <div>
              There's an error:{" "}
              {deployContractErrors.map((e) => e.message).join(", ")}
            </div>
          )}
        </>
      )}
    </>
  );
};

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
        factory: () => new IpfsPlugin({ provider: "https://ipfs.io" }),
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

  return (
    <SimpleStorageProvider redirects={redirects}>
      {/* <OneInchProvider redirects={redirects}> */}
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <ActionComponent />
        </header>
      </div>
      {/* </OneInchProvider> */}
    </SimpleStorageProvider>
  );
}

export default Test;
