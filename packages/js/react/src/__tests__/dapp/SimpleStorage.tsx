import { useWeb3ApiQuery, Web3ApiProvider } from "@web3api/react";
import { Uri, UriRedirect } from "@web3api/client-js";
import React from "react";

const SimpleStorage = ({ uri }: { uri: Uri }) => {
  const { execute: deployContract, data: deployData } = useWeb3ApiQuery({
    uri,
    query: `mutation { deployContract }`,
  });

  const { execute: setData } = useWeb3ApiQuery({
    uri,
    query: `mutation {
      setData(
        address: "${deployData?.deployContract}"
        value: 5
      )
    }`,
  });

  const { execute: getStorageData, data: currentStorage } = useWeb3ApiQuery({
    uri,
    query: `query {
      getData(
        address: "${deployData?.deployContract}"
      )
    }`,
  });

  const updateStorageData = async () => {
    await setData();
    await getStorageData();
  };

  return (
    <>
      {!deployData ? (
        <button onClick={deployContract}>Deploy</button>
      ) : (
        <>
          <p>SimpleStorage Contract: {deployData.deployContract}</p>
          <button onClick={updateStorageData}>Set the storage to 5!</button>
          <button onClick={getStorageData}>Check storage</button>
          <div>{currentStorage?.getData} </div>
        </>
      )}
    </>
  );
};

export const SimpleStorageContainer = ({
  redirects,
  ensUri,
}: {
  redirects: UriRedirect[];
  ensUri: Uri;
}) => (
  <Web3ApiProvider redirects={redirects}>
    <SimpleStorage uri={ensUri} />
  </Web3ApiProvider>
);
