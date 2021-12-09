import { useWeb3ApiQuery, Web3ApiProvider, useWeb3ApiClient, createWeb3ApiProvider } from "@web3api/react";
import { PluginRegistration } from "@web3api/client-js";
// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";

const SimpleStorage = ({ uri }: { uri: string }) => {
  const { execute: deployContract, data: deployData } = useWeb3ApiQuery<{
    deployContract: string
  }>({
    uri,
    query: `mutation {
      deployContract(
        connection: {
          networkNameOrChainId: "testnet"
        }
      )
    }`,
  });

  const { execute: setData } = useWeb3ApiQuery({
    uri,
    query: `mutation {
      setData(
        address: $address
        value: $value
        connection: {
          networkNameOrChainId: "testnet"
        }
      )
    }`,
    variables: {
      value: 5,
      address: deployData?.deployContract
    }
  });

  const { execute: getStorageData, data: currentStorage } = useWeb3ApiQuery({
    uri,
    query: `query {
      getData(
        address: "${deployData?.deployContract}"
        connection: {
          networkNameOrChainId: "testnet"
        }
      )
    }`,
  });

  const client1 = useWeb3ApiClient();
  const client2 = useWeb3ApiClient({ provider: "custom" });

  const updateStorageData = async () => {
    await setData();
    await getStorageData();
  };

  return (
    <>
      {!deployData ? (
        <button onClick={() => deployContract()}>Deploy</button>
      ) : (
        <>
          <p>SimpleStorage Contract: {deployData.deployContract}</p>
          <button onClick={updateStorageData}>Set the storage to 5!</button>
          <button onClick={() => getStorageData()}>Check storage</button>
          <div>{currentStorage?.getData} </div>
          <div>
            {
              client1.getPlugins().length > client2.getPlugins().length 
                ? 'Provider plugin counts are correct' 
                : 'Provider plugin counts are not correct'
            }
          </div>
        </>
      )}
    </>
  );
};

const CustomProvider = createWeb3ApiProvider("custom");

export const SimpleStorageContainer = ({
  plugins,
  ensUri,
}: {
  plugins: PluginRegistration[];
  ensUri: string;
}) => (
  <CustomProvider>
    <Web3ApiProvider plugins={plugins}>
      <SimpleStorage uri={ensUri} />
    </Web3ApiProvider>
  </CustomProvider>
);
