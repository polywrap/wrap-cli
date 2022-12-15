/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Deployer } from "../../../deploy";
import { invokeWithTimeout } from "../../../helpers/invokeWithTImeout";

import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Uri } from "@polywrap/core-js";
import {
  Connections,
  Connection,
  ethereumProviderPlugin,
} from "ethereum-provider-js";
import { embeddedWrappers } from "@polywrap/test-env-js";
import { PolywrapClient } from "@polywrap/client-js";
import { defaultWrappers } from "@polywrap/client-config-builder-js";

const contentHash = require("content-hash");

class ENSPublisher implements Deployer {
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

    const ethereumWrapperUri = "wrap://ens/ethereum.polywrap.eth";
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
        {
          from: ethereumWrapperUri,
          to: defaultWrappers.ethereum,
        },
      ],
      packages: [
        {
          uri: "wrap://plugin/ethereum-provider",
          package: ethereumProviderPlugin({
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
      interfaces: [
        {
          interface: defaultWrappers.ethereumProviderInterface,
          implementations: ["wrap://plugin/ethereum-provider"],
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

    const txResult = await invokeWithTimeout(
      client,
      {
        method: "awaitTransaction",
        uri: ethereumWrapperUri,
        args: {
          txHash: setContenthashData.value.hash,
          connection: {
            networkNameOrChainId: network,
          },
        },
      },
      15000
    );

    if (!txResult.ok) throw txResult.error;

    return new Uri(`ens/${network}/${config.domainName}`);
  }
}

export default new ENSPublisher();
