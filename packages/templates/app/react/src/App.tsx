import React from "react";
import Lottie from "react-lottie";
import Web3ApiAnimation from "./lottie/Web3API_Icon_Cycle.json";
import { Web3ApiProvider } from "@web3api/react";
import { HelloWorld } from "./HelloWorld";
import { Header } from "./Header";
import "./App.css";

export const App: React.FC = () => {
  const logoLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: Web3ApiAnimation,
  };

  return (
    <Web3ApiProvider>
      <Header />
      <div className="main">
        <Lottie
          options={logoLottieOptions}
          isClickToPauseDisabled={true}
          height={"320px"}
          width={"320px"}
          style={{ width: "50%", height: "auto", maxWidth: "320px" }}
        />
        <HelloWorld />
      </div>
    </Web3ApiProvider>
  );
};
