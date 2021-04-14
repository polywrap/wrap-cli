import React from "react";
import Lottie from "react-lottie";
import { Web3ApiProvider } from "@web3api/react";

import { HelloWorld } from "./HelloWorld";
import Web3ApiAnimation from "./lottie/Web3API_Icon_Cycle.json";
import "./App.css";

export const App: React.FC = () => {

  const logoLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: Web3ApiAnimation,
  };

  return (
    <div className="main">
      <Web3ApiProvider>
        <Lottie
          options={logoLottieOptions}
          isClickToPauseDisabled={true}
          height={"300px"}
          width={"300px"}
          style={{
            width: "50%",
            height: "auto",
            maxWidth: "300px"
          }}
        />
        <HelloWorld />
      </Web3ApiProvider>
    </div>
  );
};
