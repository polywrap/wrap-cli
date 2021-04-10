import React from "react";
import { useWeb3ApiQuery } from "@web3api/react";

export const HelloWorld: React.FC = () => {
  const [message, setMessage] = React.useState("");

  const { execute } = useWeb3ApiQuery({
    provider: "helloWorld",
    uri: "ens/helloworld.eth",
    query: `query { 
        logMessage(
            message: "${message}"
        )
     }`,
  });

  // data: deployData,
  // loading: loadingDeploy,
  // errors: deployContractErrors,
  const logMsgHandler = async (): Promise<any> => {
    const result = await execute();
    console.log(result);
  };

  const onChangeHandler = (event: any): void => {
    setMessage(event?.target.value);
  };

  return (
    <>
      <text className="main__heading">Hello world from Web3API!</text>
      <text className="main__text">
        Try out our Hello World demo by typing anything into
        the input below, click the submit and check out your
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
    </>
  );
}
