import { ethers } from "ethers";

interface ContractJson {
  abi: any;
  bytecode: string;
}

export function loadContract(contractName: string): ContractJson {
  return require(`@ensdomains/ens-contracts/build/contracts/${contractName}`);
}

export async function deploy(
  provider: ethers.providers.JsonRpcProvider,
  { abi, bytecode }: ContractJson,
  ...args: any[]
) {
  const factory = new ethers.ContractFactory(
    abi,
    bytecode,
    provider.getSigner()
  );
  const contract = await factory.deploy(...args);
  contract.connect(provider.getSigner());

  return contract;
}

export async function utf8ToKeccak256(value: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(value));
}
