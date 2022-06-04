/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Deployer } from "../../../deploy/deployer";

import { ethers } from "ethers";
import { namehash } from "ethers/lib/utils";
import { Uri } from "@web3api/core-js";
import axios from "axios";

const contentHash = require("content-hash");
const ENS = require("@ensdomains/ensjs");

interface Providers {
  ensAddress: string;
  resolverAddress: string;
  registrarAddress: string;
  reverseAddress: string;
}

class LocalDevENSPublisher implements Deployer {
  async execute(
    uri: Uri,
    config: {
      domainName: string;
      domainOwnerAddressOrIndex?: string | number;
      ports: {
        devServer: number;
        ethereum: number;
      };
    }
  ): Promise<Uri> {
    if (uri.authority !== "ipfs") {
      throw new Error(
        `ENS Deployer: resolved URI from ${uri} does not represent an IPFS contentHash`
      );
    }

    const cid = uri.path;

    const connectionProvider = new ethers.providers.JsonRpcProvider(
      `http://localhost:${config.ports.ethereum}`
    );

    const signer = connectionProvider.getSigner(
      config.domainOwnerAddressOrIndex
    );

    const { data: ensAddresses } = await axios.get<Providers>(
      `http://localhost:${config.ports.devServer}/ens`
    );

    const ens = new ENS.default({
      provider: connectionProvider,
      ensAddress: ensAddresses.ensAddress,
    });

    const ensName = ens.name(config.domainName);
    const resolver = await ensName.getResolver();

    if (resolver === "0x0000000000000000000000000000000000000000") {
      throw new Error(`Resolver not set for '${config.domainName}'`);
    }

    const contract = new ethers.Contract(
      resolver,
      [
        "function contenthash(bytes32 node) external view returns (bytes memory)",
        "function setContenthash(bytes32 node, bytes calldata hash) external",
        "event ContenthashChanged(bytes32 indexed node, bytes hash)",
      ],
      signer
    );

    const hash: string = "0x" + contentHash.fromIpfs(cid);

    const tx = await contract.setContenthash(
      namehash(config.domainName as string),
      hash
    );

    await tx.wait();

    return new Uri(`ens/${config.domainName}`);
  }
}

export default new LocalDevENSPublisher();
