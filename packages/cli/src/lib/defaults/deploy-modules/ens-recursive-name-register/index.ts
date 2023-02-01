/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { DeployModule } from "../../../deploy";

import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Uri } from "@polywrap/core-js";
import {
  ethereumPlugin,
  Connections,
  Connection,
} from "@polywrap/ethereum-plugin-js";
import { embeddedWrappers } from "@polywrap/test-env-js";
import { PolywrapClient } from "@polywrap/client-js";

class ENSRecursiveNameRegisterPublisher implements DeployModule {
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

    let ensDomain = uri.path;

    const connectionProvider = new JsonRpcProvider(config.provider);
    const {
      chainId: chainIdNum,
      name: networkName,
    } = await connectionProvider.getNetwork();

    const network = chainIdNum === 1337 ? "testnet" : networkName;

    if (ensDomain.startsWith(network)) {
      ensDomain = ensDomain.split("/")[1];
    }

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

    const signerAddress = await client.invoke<string>({
      method: "getSignerAddress",
      uri: ethereumPluginUri,
      args: {
        connection: {
          networkNameOrChainId: network,
        },
      },
    });

    if (!signerAddress.ok) {
      throw new Error("Could not get signer");
    }

    const registerData = await client.invoke<{ hash: string }>({
      method: "registerDomainAndSubdomainsRecursively",
      uri: ensWrapperUri,
      args: {
        domain: ensDomain,
        owner: signerAddress.value,
        resolverAddress: config.ensResolverAddress,
        ttl: "0",
        registrarAddress: config.ensRegistrarAddress,
        registryAddress: config.ensRegistryAddress,
        connection: {
          networkNameOrChainId: network,
        },
      },
    });

    if (!registerData.ok) {
      throw new Error(
        `Could not register domain '${ensDomain}'` +
          (registerData.error ? `\nError: ${registerData.error.message}` : "")
      );
    }

    await client.invoke({
      method: "awaitTransaction",
      uri: ethereumPluginUri,
      args: {
        txHash: registerData.value.hash,
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
