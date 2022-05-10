/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import ens from "@ensdomains/ens";
import Web3 from "web3";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadContract(modName: string, contractName: string): any {
  if (modName === "ens") {
    return ens[contractName];
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(`@ensdomains/${modName}/build/contracts/${contractName}`);
}

export function deploy(
  web3: Web3,
  account: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contractJSON: Record<string, any>,
  ...args
) {
  const contract = new web3.eth.Contract(contractJSON.abi);
  return contract
    .deploy({
      data: contractJSON.bytecode,
      arguments: args,
    })
    .send({
      from: account,
      gas: 6700000,
    });
}
