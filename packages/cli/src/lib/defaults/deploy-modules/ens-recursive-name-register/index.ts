/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Deployer } from "../../../deploy";
import { invokeWithTimeout } from "./invokeWithTimeout";

import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Uri } from "@polywrap/core-js";
import {
  ethereumProviderPlugin,
  Connections,
  Connection,
} from "ethereum-provider-js";
import { embeddedWrappers } from "@polywrap/test-env-js";
import { PolywrapClient } from "@polywrap/client-js";
import {
  defaultInterfaces,
  defaultPackages,
  defaultWrappers,
} from "@polywrap/client-config-builder-js";

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
          uri: defaultPackages.ethereumProvider,
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
          interface: defaultInterfaces.ethereumProvider,
          implementations: [defaultPackages.ethereumProvider],
        },
      ],
    });

    const signerAddress = await client.invoke<string>({
      method: "getSignerAddress",
      uri: ethereumWrapperUri,
      args: {
        connection: {
          networkNameOrChainId: network,
        },
      },
    });

    if (!signerAddress.ok) {
      throw new Error("Could not get signer");
    }

    const registerData = await client.invoke<{ tx: { hash: string } }[]>({
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

    const txResult = await invokeWithTimeout(
      client,
      {
        method: "awaitTransaction",
        uri: ethereumWrapperUri,
        args: {
          txHash: registerData.value[0].tx.hash,
          connection: {
            networkNameOrChainId: network,
          },
        },
      },
      15000
    );

    if (!txResult.ok) throw txResult.error;

    return new Uri(`ens/${network}/${ensDomain}`);
  }
}

export default new ENSRecursiveNameRegisterPublisher();
