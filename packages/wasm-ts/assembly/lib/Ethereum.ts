import { _w3_eth_callView, _w3_eth_sendTransaction, _w3_eth_deployContract } from "../host/ethereum";

export class Ethereum {
  static sendTransaction(address: string, method: string, args: string): string {
    return _w3_eth_sendTransaction(address, method, args);
  }

  static callView(address: string, method: string, args: string): string {
    return _w3_eth_callView(address, method, args);
  }

  static deployContract(abi: string, bytecode: string): string {
    return _w3_eth_deployContract(abi, bytecode);
  }
}
