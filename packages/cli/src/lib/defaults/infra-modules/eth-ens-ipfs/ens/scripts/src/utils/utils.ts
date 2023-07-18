import { ethers } from "ethers";

interface ContractJson {
  abi: any;
  bytecode: string;
}

export function loadContract(
  modName: string,
  contractName: string
): ContractJson {
  if (modName === "ens") {
    const ens = require(`@ensdomains/ens`);
    return ens[contractName];
  }
  return require(`@ensdomains/${modName}/deployments/mainnet/${contractName}`);
  //  return require(`node_modules/@ensdomains/ens-contracts/artifacts/contracts/${modName}/${contractName}.sol/${contractName}.json`)
}

export function utf8ToKeccak256(value: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(value));
}
