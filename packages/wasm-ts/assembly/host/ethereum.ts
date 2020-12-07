/*
  TODO
  - send RPC
  - ETH RPC: https://eth.wiki/json-rpc/API
  - ETH JS RPC Library: https://github.com/ethereumjs/ethrpc
*/

export declare function _w3_eth_callView(address: string, method: string, args: string): string;

export declare function _w3_eth_sendTransaction(address: string, method: string, args: string): string;

export declare function _w3_eth_deployContract(abi: string, bytecode: string): string;
