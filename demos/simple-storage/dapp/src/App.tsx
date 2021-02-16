import './App.css';
import React from 'react';
import Lottie from "react-lottie";
import { Web3ApiClient } from "@web3api/client-js";

import { setupWeb3ApiClient } from "./web3api/setupClient";
import {
  setData,
  SetDataResult,
  deployContract
} from "./web3api/simplestorage";
import Web3ApiAnimation from "./lottie/Web3API_Icon_Cycle.json";

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

  const logoLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: Web3ApiAnimation
  };

  const tab = () => (<>&nbsp;&nbsp;&nbsp;&nbsp;</>);

  return (
    <div className="App">
      <header className="App-body">
        <a target="_blank" href="https://web3api.dev/">
          <Lottie
            options={logoLottieOptions}
            isClickToPauseDisabled={true}
            height={"100px"}
            width={"100px"}
          />
        </a>
        Pre-Alpha
          <h3>Web3API Demo:<br/><a target="_blank" href={"https://app.ens.domains/name/api.simplestorage.eth"}>
            api.simplestorage.eth
          </a>
          <a target="_blank" href="https://bafybeihsk2ivvcrye7bqtdukxjtmfevfxgidebqqopoqdfpucbgzyy2edu.ipfs.dweb.link/">
            &nbsp;(IPFS)
          </a></h3><br/><br/>
        {!contract ?
          <>
            Let's get started...<br/><br/>
            🔌 Set Metamask to Rinkeby<br/>
            <button onClick={async () =>
              deployContract(
                await getClient()
              ).then(address =>
                setContract(address)
              ).catch(err =>
                console.error(err)
              )
            }>
              🚀Deploy SimpleStorage.sol
            </button>
            <div className="Code-Block">
              <text className="Code-Class">Client</text>.
              <text className="Code-Prop">query</text>{"({"}<br/>
              <text className="Code-Value">&nbsp;&nbsp;&nbsp;&nbsp;uri: </text>
              <text className="Code-String">"w3://ens/api.simplestorage.eth"</text><br/>
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
          <button onClick={async () =>
            setData(
              contract,
              inputValue,
              await getClient()
            ).then((result) => {
              addSet(result);
              setValue(result.value);
            }).catch(err =>
              console.error(err)
            )
          }>
            📝 Set Value
          </button>
          <div className="Code-Block">
              <text className="Code-Class">Client</text>.
              <text className="Code-Prop">query</text>{"({"}<br/>
              <text className="Code-Value">{tab()}uri: </text>
              <text className="Code-String">"w3://ens/api.simplestorage.eth"</text><br/>
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
      </header>
    </div>
  );
}

export default App;
