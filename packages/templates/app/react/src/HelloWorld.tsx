import React from "react";
import { useWeb3ApiQuery } from "@web3api/react";

export const HelloWorld: React.FC = () => {
  const [message, setMessage] = React.useState("");

  const query = {
    uri: "ens/helloworld.web3api.eth",
    query: `query { 
        logMessage(
            message: "${message}"
        )
     }`,
  };

  const { execute } = useWeb3ApiQuery(query);

  const logMsgHandler = async (): Promise<any> => {
    console.info(`Sending Query: ${JSON.stringify(query, null, 2)}`);
    const result = await execute();
    console.info(`Query Result: ${JSON.stringify(result, null, 2)}`);
  };

  const onChangeHandler = (event: any): void => {
    setMessage(event?.target.value);
  };

  return (
    <>
      <div className="main__heading">"Hello World"<br/>from Web3API!</div>
      <div className="main__text">
        Test the "Hello World" Web3API by:<br/>
          1. type into the input below<br/>
          2. click the submit button<br/>
          3. view the output in <a
            className="main__link"
            href="https://webmasters.stackexchange.com/a/77337"
            target="_blank"
          >
            the console
          </a><br/>
      </div>
      <input
        className="main__input"
        onChange={(event) => onChangeHandler(event)}
      />
      <button className="main__btn" onClick={logMsgHandler}>
        Submit
      </button>
      <br/>
      <div className="main__text">
        Want to build your own Web3API?<br/>
        <a
          className="main__link"
          href="https://docs.web3api.dev/"
          target="_blank"
        >
          Checkout Our Documentation
        </a>
      </div>
      <div style={{ width: "100%", height: "100px" }}/>
      <div className="footer__container">
        <a
          className="footer__link"
          href="https://github.com/Web3-API/demos/tree/main/hello-world/web3api"
          target="_blank"
        >
          Source Code
        </a>
        <a
          className="footer__link"
          href="https://app.ens.domains/name/helloworld.web3api.eth"
          target="_blank"
        >
          ENS Domain
        </a>
        <a
          className="footer__link"
          href="https://bafybeig7r7vm6vg7fkv4u57p6pj3t3a7li56zeiiu6nn7sx5lrlacy7lpi.ipfs.dweb.link/"
          target="_blank"
        >
          IPFS Package
        </a>
      </div>
    </>
  );
}
