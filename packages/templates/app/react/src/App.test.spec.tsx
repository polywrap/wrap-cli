import React, { useEffect } from "react";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { HelloWorld } from "./HelloWorld";
import { Web3ApiProvider, useWeb3ApiQuery } from "@web3api/react";

Enzyme.configure({ adapter: new Adapter() });

describe("HelloWorld component", () => {
  it("Renders correctly", () => {
    const wrapper = shallow(
      <Web3ApiProvider>
        <HelloWorld />
      </Web3ApiProvider>
    );
    expect(wrapper.find(".hello"));
  });

  it("Logs Web3API query variable and execute function call", async () => {
    const TestQuery = () => {
      const query = {
        uri: "ens/helloworld.web3api.eth",
        query: `query { 
        logMessage(
            message: "Hello World!"
        )
     }`,
      };

      const { execute } = useWeb3ApiQuery(query);

      const logMsgHandler = async (): Promise<any> => {
        console.info(`Sending Query: ${JSON.stringify(query, null, 2)}`);
        console.info('Promise:', execute());
      };

      useEffect(() => {
        logMsgHandler();
      }, [])

      return null;
    };
    mount(
      <Web3ApiProvider>
        <TestQuery />
      </Web3ApiProvider>
    );
  });
});
