import { ethers } from "ethers";

interface ContractJson {
  abi: any;
  bytecode: string;
}

export function loadContract(modName: string, contractName: string): ContractJson {
  if (modName === "deployments") {
    return require(`@ensdomains/ens-contracts/deployments/mainnet/${contractName}`);
  }
  return require(`@ensdomains/ens-contracts/artifacts/contracts/${modName}/${contractName}.sol/${contractName}`);
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

export function utf8ToKeccak256(value: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(value));
}

export function computeInterfaceId(iface: ethers.utils.Interface) {
  const functions = Object.values(iface.functions);
  const sigHashes = functions.map((frag) => frag.format('sighash'));
  return makeInterfaceIdERC165(sigHashes);
}

// see https://github.com/OpenZeppelin/openzeppelin-test-helpers/blob/master/src/makeInterfaceId.js
function makeInterfaceIdERC165 (functionSignatures: string[] = []) {
  const INTERFACE_ID_LENGTH = 4;

  const interfaceIdBuffer = functionSignatures
    .map(signature => utf8ToKeccak256(signature)) // keccak256
    .map(h =>
      Buffer
        .from(h.substring(2), 'hex')
        .slice(0, 4) // bytes4()
    )
    .reduce((memo, bytes) => {
      for (let i = 0; i < INTERFACE_ID_LENGTH; i++) {
        memo[i] = memo[i] ^ bytes[i]; // xor
      }
      return memo;
    }, Buffer.alloc(INTERFACE_ID_LENGTH));

  return `0x${interfaceIdBuffer.toString('hex')}`;
}
