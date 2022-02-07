import {
  Network,
  Tezos_Query,
  Tezos_Connection,
  GetResponse,
  Input_getDataOf,
  CustomConnection
} from "./w3";
import { getString } from "../utils/common"

import { JSON } from "assemblyscript-json"; 

class ConnectionDetails {
  connection: Tezos_Connection;
  contractAddress: string;
}

export function getBalanceOf(input: Input_getDataOf): GetResponse {
  if (input.network == Network.custom && input.custom === null) {
    throw new Error(`custom network should have a valid connection and contract address`);
  }
  const connectionDetails = getConnectionDetails(input.network, input.custom, false);
  const balance = Tezos_Query.getContractStorage({
    address: connectionDetails.contractAddress,
    connection: connectionDetails.connection,
    key: "",  // storage
    field: '', // field
  });
  return {
      // Parameters to return, eg params: params,
  };
} 


function getConnectionDetails(network: Network, custom: CustomConnection | null, isMarketPlace: boolean): ConnectionDetails {
  let address: string = "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton";
  if(isMarketPlace) {
    address = "KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn"
  }
  let connection: Tezos_Connection = {
    provider: "https://rpc.tzstats.com",
    networkNameOrChainId: "mainnet"
  };
  if (network == Network.custom) {
    connection = custom!.connection;
    address = custom!.contractAddress;
  }
  return {
    connection: connection,
    contractAddress: address,
  }
}