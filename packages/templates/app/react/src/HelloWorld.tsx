import React from "react";
import { useWeb3ApiQuery } from "@web3api/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const notify = () => toast("Take a look at your console!");

  const logMsgHandler = async (event: any): Promise<any> => {
    event.preventDefault();
    notify();
    console.info(`Sending Query: ${JSON.stringify(query, null, 2)}`);
    const result = await execute();
    console.info(`Query Result: ${JSON.stringify(result, null, 2)}`);
  };

  const onChangeHandler = (event: any): void => {
    setMessage(event?.target.value);
  };

  return (
    <>
      <div className="hello">
        <div className="hello__heading">"Hello World" from Web3API!</div>
        <div className="hello__text">
          <strong>Test the "Hello World" Web3API by:</strong>
          <br />
          1. typing into the input below
          <br />
          2. clicking the submit button
          <br />
          3. viewing the output in{" "}
          <a
            className="hello__link"
            href="https://webmasters.stackexchange.com/a/77337"
            target="_blank"
          >
            the console
          </a>
          <br />
        </div>
        <br />
        <form
          onSubmit={(event) => logMsgHandler(event)}
          className="hello__form"
        >
          <input
            className="hello__input"
            onChange={(event) => onChangeHandler(event)}
          />
          <button type="submit" className="hello__btn">
            Submit
          </button>
          <ToastContainer />
        </form>
        <div className="hello__text">
          Want to build your own Web3API?
          <br />
          <a
            className="hello__link"
            href="https://docs.web3api.dev/"
            target="_blank"
          >
            Checkout our documentation
          </a>
        </div>
      </div>
    </>
  );
};
