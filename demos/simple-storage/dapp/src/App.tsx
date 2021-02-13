import React from 'react';
import logo from './logo.svg';
import './App.css';
import { setupWeb3ApiClient } from "./web3api/setupClient";
import { Web3ApiClient, Uri } from "@web3api/client-js";
import Lottie from "react-lottie";
import Web3ApiAnimation from "./lottie/Web3API_Icon_Cycle.json";
import Web3ApiSolution from "./lottie/Protocols_and_devices.json";

const simpleStorageUri = new Uri("ens/simplestorage.web3api.eth");

interface SetDataResult {
  txReceipt: string,
  value: number
};

function App() {
  const [client, setClient] = React.useState<Web3ApiClient | undefined>(undefined);
  const [contract, setContract] = React.useState<string | undefined>(undefined);
  const [value, setValue] = React.useState<number>(0);
  const [sets, setSets] = React.useState<SetDataResult[]>([]);
  const addSet = (set: SetDataResult) => setSets([...sets, set]);

  const [inputValue, setInputValue] = React.useState<number>(0);

  const getClient = async () => {
    if (client) {
      return client;
    }

    const newClient = await setupWeb3ApiClient();
    setClient(newClient);
    return newClient;
  }

  const deployContract = async () => {
    const client = await getClient();

    const { data, errors } = await client.query<{
      deployContract: string
    }>({
      uri: simpleStorageUri,
      query: `mutation { deployContract }`
    });

    if (errors || !data) {
      console.error(errors);
      return;
    }

    setContract(
      data.deployContract as string
    );
  }

  const setData = async (value: number) => {
    const client = await getClient();

    const { data, errors } = await client.query<{
      setData: SetDataResult
    }>({
      uri: simpleStorageUri,
      query: `mutation {
        setData(options: {
          address: "${contract}"
          value: ${value}
        })
      }`
    });

    if (errors || !data) {
      console.error(errors);
      return;
    }

    addSet(data.setData);
    setValue(data.setData.value);
  }

  const getData = async () => {
    const client = await getClient();

    const { data, errors } = await client.query<{
      getData: number
    }>({
      uri: simpleStorageUri,
      query: `query {
        getData(address: "${contract}")
      }`
    });

    if (errors || !data) {
      console.error(errors);
      return;
    }

    setValue(data.getData);
  }

  const logoLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: Web3ApiAnimation
  };

  const tab = () => (<>&nbsp;&nbsp;&nbsp;&nbsp;</>);

  return (
    <div className="App">
      <header></header>
      <body className="App-body">
        <Lottie
          options={logoLottieOptions}
          isClickToPauseDisabled={true}
          height={"100px"}
        />
        Pre-Alpha
          <h3>Web3API Demo:<br/><a target="_blank" href={"https://app.ens.domains/name/simplestorage.eth"}>
            simplestorage.eth
          </a></h3><br/>
        {!contract ?
          <>
            Let's get started...<br/>
            <button onClick={deployContract}>
              🚀Deploy SimpleStorage.sol
            </button>
            <div className="Code-Block">
              <text className="Code-Class">Client</text>.
              <text className="Code-Prop">query</text>{"({"}<br/>
              <text className="Code-Value">&nbsp;&nbsp;&nbsp;&nbsp;uri: </text>
              <text className="Code-String">"w3://ens/simplestorage.eth"</text><br/>
              <text className="Code-Value">&nbsp;&nbsp;&nbsp;&nbsp;query: </text>
              <text className="Code-String">{"\"mutation { deployContract }\""}</text><br/>
              {")}"}
            </div>
            <br/>
          </> :
          <>
            <p>
              ✔️ Deployed SimpleStorage (<a target="_blank" href={`https://rinkeby.etherscan.io/address/${contract}`}>
                {contract.substr(0, 7)}...
              </a>)
            </p>
            <br/>
          </>
        }
        {contract &&
        <>
          Storage Value: {value}<br/>
          <input
            type="number"
            min="0"
            value={inputValue}
            style={{ width: "75px" }}
            onChange={
              (e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(Number(e.target.value))
            }
          />
          <button onClick={async () => (setData(inputValue))}>
            📝 Set Value
          </button>
          <div className="Code-Block">
              <text className="Code-Class">Client</text>.
              <text className="Code-Prop">query</text>{"({"}<br/>
              <text className="Code-Value">{tab()}uri: </text>
              <text className="Code-String">"w3://ens/simplestorage.eth"</text><br/>
              <text className="Code-Value">{tab()}query: </text>
              <text className="Code-String">{"`mutation {"}</text><br/>
              <text className="Code-String">
                {tab()}{tab()}{"setData(options: {"}
              </text><br/>
              <text className="Code-String">
                {tab()}{tab()}{tab()}{`address: "${contract.substr(0, 7)}..."`}
              </text><br/>
              <text className="Code-String">
                {tab()}{tab()}{tab()}{`value: ${inputValue}`}
              </text><br/>
              <text className="Code-String">
                {tab()}{tab()}{"})"}
              </text><br/>
              <text className="Code-String">
                {tab()}{"}`"}
              </text><br/>
              {"})"}
            </div>
          <p>
            {sets.length ? <>Storage History:<br/></> : <></>}
            {sets.map((set, index) => (
              <>
                #{index} | value: {set.value} | tx: <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${set.txReceipt}`}>
                  {set.txReceipt.substr(0, 7)}...
                </a><br/>
              </>
            )).reverse()}
          </p>
        </>
        }
      </body>
    </div>
  );
}

export default App;
