/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

import { wrappersConfig, ensConfig } from "./config";
import { ConnectionService } from "./ConnectionService";
import { isValidWrapDir } from "./utils";

import axios from "axios";
import fs from "fs";
import path from "path";
import ethers from "ethers";
import { namehash } from "ethers/lib/utils";

const contentHash = require("content-hash");
const ENS = require("@ensdomains/ensjs");
// eslint-disable-next-line @typescript-eslint/naming-convention
const FormData = require("form-data");

export class WrapperService {
  constructor(private connectionService: ConnectionService) {}

  async addWrapper({
    onlyHash,
    buildPath,
  }: {
    onlyHash: boolean;
    buildPath: string;
  }): Promise<string | undefined> {
    console.log(`Publishing build contents to IPFS...`);

    let resolvedPath = path.resolve(buildPath);
    if (!isValidWrapDir(resolvedPath)) {
      console.error("Could not find the build directory");
      return;
    }

    if (isValidWrapDir(path.join(resolvedPath, "build"))) {
      resolvedPath = path.join(resolvedPath, "build");
    }

    const data = new FormData();

    const files = fs.readdirSync(resolvedPath);
    console.log(`Found build directory at ${resolvedPath}`);

    for (const file of files) {
      console.log(`Adding ${file}`);

      const filePath = path.join(resolvedPath, file);

      const buffer = fs.readFileSync(filePath);
      data.append("files", buffer, { filename: file });
    }

    data.append(
      "options",
      JSON.stringify({
        onlyHash: onlyHash,
      })
    );

    const resp = await axios.post(wrappersConfig.gatewayURI + "/add", data, {
      headers: {
        ...data.getHeaders(),
      },
    });

    if (resp.status === 200 && !resp.data.error) {
      const cid = resp.data.cid;

      console.log(`Publish to IPFS successful, CID: ${cid}`);
      return cid;
    } else if (resp.status === 200 && resp.data.error) {
      console.error(resp.data.error);
    } else {
      console.error("Unexpected error: " + resp.status);
    }

    return undefined;
  }

  async publishToEns(
    networkName: string,
    domain: string,
    cid: string
  ): Promise<void> {
    console.log(`Publishing ${cid} to ${domain}...`);

    const signer = await this.connectionService.getSigner(networkName);

    const provider = signer.provider as ethers.providers.JsonRpcProvider;
    const network = await provider.getNetwork();

    const ens = new ENS.default({
      provider: signer.provider,
      ensAddress: ENS.getEnsAddress(network.chainId),
    });

    const ensName = ens.name(domain);
    const resolver = await ensName.getResolver();

    const contract = new ethers.Contract(
      resolver,
      ensConfig.resolverAbi,
      signer
    );

    const hash: string = "0x" + contentHash.fromIpfs(cid);

    console.log(`Setting contenthash for ${domain}`);

    const tx = await contract.setContenthash(namehash(domain), hash);

    console.log("Waiting for transaction: " + tx.hash);

    await tx.wait();

    console.log(`Publish to "${networkName}" successful!`);
  }
}
