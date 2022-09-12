/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Deployer } from "../../../deploy/deployer";

import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Uri } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import path from "path";
import {
  ethereumPlugin,
  Connections,
  Connection,
} from "@polywrap/ethereum-plugin-js";

class ENSRecursiveNameRegisterPublisher implements Deployer {
  async execute(
    uri: Uri,
    config: {
      provider: string;
      privateKey?: string;
      ensRegistryAddress: string;
      ensRegistrarAddress: string;
      ensResolverAddress: string;
    }
  ): Promise<Uri> {
    if (uri.authority !== "ens") {
      throw new Error(
        `ENS Recursive Name Register Deployer: argument URI needs to be an ENS URI. Example: wrap://ens/foo.bar.eth`
      );
    }

    const ensDomain = uri.path;

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
    const ensWrapperUri = `fs/${path.join(
      path.dirname(require.resolve("@polywrap/test-env-js")),
      "wrappers",
      "ens"
    )}`;

    const client = new PolywrapClient({
      plugins: [
        {
          uri: ethereumPluginUri,
          plugin: ethereumPlugin({
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

    const { data: signerAddress } = await client.invoke<string>({
      method: "getSignerAddress",
      uri: ethereumPluginUri,
      args: {
        connection: {
          networkNameOrChainId: network,
        },
      },
    });

    if (!signerAddress) {
      throw new Error("Could not get signer");
    }

    const { data: registerData, error } = await client.invoke<{ hash: string }>(
      {
        method: "registerDomainAndSubdomainsRecursively",
        uri: ensWrapperUri,
        args: {
          domain: ensDomain,
          owner: signerAddress,
          resolverAddress: config.ensResolverAddress,
          ttl: "0",
          registrarAddress: config.ensRegistrarAddress,
          registryAddress: config.ensRegistryAddress,
          connection: {
            networkNameOrChainId: network,
          },
        },
      }
    );

    if (!registerData) {
      throw new Error(
        `Could not register domain '${ensDomain}'` +
          (error ? `\nError: ${error.message}` : "")
      );
    }

    await client.invoke({
      method: "awaitTransaction",
      uri: ethereumPluginUri,
      args: {
        txHash: registerData.hash,
        confirmations: 1,
        timeout: 15000,
        connection: {
          networkNameOrChainId: network,
        },
      },
    });

    return new Uri(`ens/${network}/${ensDomain}`);
  }
}

export default new ENSRecursiveNameRegisterPublisher();
