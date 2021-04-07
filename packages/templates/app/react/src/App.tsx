import React, { useEffect, useState, FC } from "react";
import "./App.css";
import { useWeb3ApiQuery } from "@web3api/react";
import Lottie from "react-lottie";
import Web3ApiAnimation from "./lottie/Web3API_Icon_Cycle.json";

const App: FC = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const ethereum = (window as any).ethereum;
      if (ethereum && ethereum.enable) {
        await ethereum.enable();
      }
    })();
  }, []);

  const logoLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: Web3ApiAnimation,
  };

  const { execute: logMessage } = useWeb3ApiQuery({
    provider: "helloWorld",
    uri: "ens/helloworld.eth",
    query: `query { 
        logMessage(
            message: ${message} 
        )
     }`,
  });

  // data: deployData,
  // loading: loadingDeploy,
  // errors: deployContractErrors,
  const logMsgHandler = async (): Promise<any> => {
    const result = await logMessage();
    console.log(result);
  };

  const onChangeHandler = (event: any): void => {
    setMessage(event?.target.value);
  };

  return (
    <>
      <div className="main">
        <Lottie
          options={logoLottieOptions}
          isClickToPauseDisabled={true}
          height={"300px"}
          width={"300px"}
        />
        <text className="main__heading">Hello world from Web3API!</text>
        <text className="main__text">
          Try out our Hello World demo by connecting your MetaMask, type
          anything into the input below, click the submit and check out your
          developer console logs.
        </text>
        <input
          className="main__input"
          onChange={(event) => onChangeHandler(event)}
        />
        <button className="main__btn" onClick={logMsgHandler}>
          Submit
        </button>
        <a
          className="main__link"
          href="https://documentation-master.on.fleek.co/"
        >
          Want to build your own Web3API? Visit our documentation{" "}
          <span style={{ color: "blue" }}>here</span>.
        </a>
      </div>
    </>
  );
};

export default App;
