/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { DeployModule } from "../../../deploy";

import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Uri } from "@polywrap/core-js";
import {
  Connections,
  Connection,
  ethereumPlugin,
} from "@polywrap/ethereum-plugin-js";
import { embeddedWrappers } from "@polywrap/test-env-js";
import { PolywrapClient } from "@polywrap/client-js";

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

    const ethereumPluginUri = "wrap://ens/ethereum.polywrap.eth";
    const ensWrapperUri = embeddedWrappers.ens;

    const client = new PolywrapClient({
      redirects: [
        {
          from: "wrap://ens/uts46.polywrap.eth",
          to: embeddedWrappers.uts46,
        },
        {
          from: "wrap://ens/sha3.polywrap.eth",
          to: embeddedWrappers.sha3,
        },
      ],
      packages: [
        {
          uri: ethereumPluginUri,
          package: ethereumPlugin({
            connections: new Connections({
              networks: {
                [network]: new Connection({
                  provider: config.provider,
                  signer,
                }),
              },
              defaultNetwork: network,
            }),
          }),
        },
      ],
    });

    const resolver = await client.invoke<string>({
      method: "getResolver",
      uri: ensWrapperUri,
      args: {
        registryAddress: config.ensRegistryAddress,
        domain: config.domainName,
        connection: {
          networkNameOrChainId: network,
        },
      },
    });

    if (!resolver.ok) {
      throw new Error(`Could not get resolver for '${config.domainName}'`);
    }

    if (resolver.value === "0x0000000000000000000000000000000000000000") {
      throw new Error(`Resolver not set for '${config.domainName}'`);
    }

    const hash = "0x" + contentHash.fromIpfs(cid);

    const setContenthashData = await client.invoke<{ hash: string }>({
      method: "setContentHash",
      uri: ensWrapperUri,
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
      throw new Error(`Could not set contentHash for '${config.domainName}'`);
    }

    await client.invoke({
      method: "awaitTransaction",
      uri: ethereumPluginUri,
      args: {
        txHash: setContenthashData.value.hash,
        confirmations: 1,
        timeout: 15000,
        connection: {
          networkNameOrChainId: network,
        },
      },
    });

    return new Uri(`ens/${network}/${config.domainName}`);
  }
}

export default new ENSPublisher();
