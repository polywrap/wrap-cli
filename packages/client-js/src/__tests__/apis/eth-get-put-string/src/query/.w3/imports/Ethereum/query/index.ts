import { queryWeb3Api } from "@web3api/wasm-as";
import { serializecallViewInput, deserializecallViewOutput } from "./callView";

export class EthereumQuery {
  public static callView(input: {
    address: string,
    method: string,
    args: string[]
  }): string {
    const args = serializecallViewInput(input);
    const result = queryWeb3Api(
      "ethereum.web3api.eth",
      `query {
        callView(
          address: $address,
          method: $method,
          args: $args
        )
      }`,
      args
    );
    return deserializecallViewOutput(result);
  }
}
