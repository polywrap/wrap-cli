/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { DeployModule } from "../../../deploy";
import { getClient } from "./getClient";

import { invokeWithTimeout } from "wraplib";
import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Uri } from "@polywrap/core-js";
import { embeddedWrappers } from "@polywrap/test-env-js";
import { Connections, Connection } from "ethereum-provider-js";

const contentHash = require("content-hash");

class ENSPublisher implements DeployModule {
  async execute(
    uri: Uri,
    config: {
      domainName: string;
      provider: string;
      privateKey?: string;
      ensRegistryAddress: string;
    }
  ): Promise<Uri> {
    if (uri.authority !== "ipfs") {
      throw new Error(
        `ENS Deployer: resolved URI from ${uri} does not represent an IPFS contentHash`
      );
    }

    const cid = uri.path;

    const connectionProvider = new JsonRpcProvider(config.provider);
    const {
      chainId: chainIdNum,
      name: networkName,
    } = await connectionProvider.getNetwork();

    const network = chainIdNum === 1337 ? "testnet" : networkName;

    const signer = config.privateKey
      ? new Wallet(config.privateKey).connect(connectionProvider)
      : undefined;

    const connections = new Connections({
      networks: {
        [network]: new Connection({
          provider: config.provider,
          signer,
        }),
      },
      defaultNetwork: network,
    });
    const client = getClient(connections);

    const resolver = await client.invoke<string>({
      method: "getResolver",
      uri: embeddedWrappers.ens,
      args: {
        registryAddress: config.ensRegistryAddress,
        domain: config.domainName,
        connection: {
          networkNameOrChainId: network,
        },
      },
    });

    if (!resolver.ok) {
      throw new Error(
        `Could not get resolver for '${
          config.domainName
        }'. Exception encountered:\n${resolver.error?.toString()}`
      );
    }

    if (resolver.value === "0x0000000000000000000000000000000000000000") {
      throw new Error(`Resolver not set for '${config.domainName}'`);
    }

    const hash = "0x" + contentHash.fromIpfs(cid);

    const setContenthashData = await client.invoke<{ hash: string }>({
      method: "setContentHash",
      uri: embeddedWrappers.ens,
      args: {
        domain: config.domainName,
        cid: hash,
        resolverAddress: resolver.value,
        connection: {
          networkNameOrChainId: network,
        },
      },
    });

    if (!setContenthashData.ok) {
      throw new Error(
        `Could not set contentHash for '${
          config.domainName
        }'. Exception encountered:\n${setContenthashData.error?.toString()}`
      );
    }

    await invokeWithTimeout(
      client,
      {
        method: "awaitTransaction",
        uri: "wrap://ens/ethereum.polywrap.eth",
        args: {
          txHash: setContenthashData.value.hash,
          connection: {
            networkNameOrChainId: network,
          },
        },
      },
      15000
    );

    return new Uri(`ens/${network}/${config.domainName}`);
  }
}

export default new ENSPublisher();
