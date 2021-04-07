import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createWeb3ApiProvider } from "@web3api/react";
import { redirects } from "./redirects";

const HelloWorldProvider = createWeb3ApiProvider("helloWorld");

ReactDOM.render(
  <HelloWorldProvider redirects={redirects}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </HelloWorldProvider>,
  document.getElementById("root")
);
