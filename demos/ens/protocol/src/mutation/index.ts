import { Ethereum_Query } from '../query/w3';
import { namehash } from '../utils';
import { SHA3_Query } from './../query/w3/imported/SHA3_Query/index';
import { Ethereum_Mutation, Input_register } from "./w3";

export function register(input: Input_register): string {

  const label = "0x" + SHA3_Query.keccak_256({ message: input.domain.replace('.eth', '')})

  Ethereum_Mutation.sendTransaction({
    address: input.registrar,
    method: "function register(bytes32 label, address owner)",
    args: [
      label,
      input.address
    ],
  });

  const setResolverTx = Ethereum_Mutation.sendTransaction({
    address: input.ensAddress,
    method: "function setResolver(bytes32 node, address owner)",
    args: [
      namehash(input.domain),
      input.resolverAddress
    ],
  });

  // const res = Ethereum_Query.callView({
  //   address: input.address,
  //   method: "function resolver(bytes32 node) external view returns (address)",
  //   args: [
  //     namehash(input.domain)
  //   ],
  // });


  return setResolverTx
}
