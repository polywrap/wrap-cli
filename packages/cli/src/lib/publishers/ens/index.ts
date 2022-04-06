/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Publisher } from "../../deploy/DeploymentManager";

import ethers from "ethers";
import { namehash } from "ethers/lib/utils";

const contentHash = require("content-hash");
const ENS = require("@ensdomains/ensjs");

const ensConfig = {
  resolverAddr:
    process.env.ENS_RESOLVER_ADDR ??
    "0xf6305c19e814d2a75429Fd637d01F7ee0E77d615",
  resolverAbi: [
    "function contenthash(bytes32 node) external view returns (bytes memory)",
    "function setContenthash(bytes32 node, bytes calldata hash) external",
    "event ContenthashChanged(bytes32 indexed node, bytes hash)",
  ],
};

class ENSPublisher implements Publisher {
  blockchain = "Ethereum";
  name = "ens";

  constructor(public network: string) {}

  async publish(
    cid: string,
    config: { domainName: string; provider: string; privateKey: string }
  ): Promise<string> {
    console.log(`Publishing ${cid} to ${config.domainName}...`);

    const connectionProvider = new ethers.providers.JsonRpcProvider(
      config.provider as string
    );
    const signer = new ethers.Wallet(config.privateKey as string).connect(
      connectionProvider
    );

    const network = await connectionProvider.getNetwork();

    const ens = new ENS.default({
      provider: signer.provider,
      ensAddress: ENS.getEnsAddress(network.chainId),
    });

    const ensName = ens.name(config.domainName);
    const resolver = await ensName.getResolver();

    const contract = new ethers.Contract(
      resolver,
      ensConfig.resolverAbi,
      signer
    );

    const hash: string = "0x" + contentHash.fromIpfs(cid);

    console.log(`Setting contenthash for ${config.domainName}`);

    const tx = await contract.setContenthash(
      namehash(config.domainName as string),
      hash
    );

    console.log("Waiting for transaction: " + tx.hash);

    await tx.wait();

    console.log(`Publish to "${this.network}" successful!`);

    return `Published ${cid} to ${config.domainName}`;
  }
}

export default ENSPublisher;
