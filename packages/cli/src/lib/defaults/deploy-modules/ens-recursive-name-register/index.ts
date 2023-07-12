/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { DeployModule } from "../../../deploy";
import { invokeWithTimeout } from "./invokeWithTimeout";

import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { IWrapPackage, Uri } from "@polywrap/core-js";
import { PolywrapClientConfigBuilder, PolywrapClient } from "@polywrap/client-js";
import * as Web3 from "@polywrap/web3-config-bundle-js";
import {
  Connection,
  Connections,
  ethereumProviderPlugin,
} from "@polywrap/ethereum-provider-js-v1";

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

    // Default connections
    const connections = new Connections({
      networks: {
        [network]: new Connection({
          provider: config.provider,
          signer,
        }),
      },
      defaultNetwork: network,
    });

    const clientConfig = new PolywrapClientConfigBuilder()
      .addDefaults()
      .setPackage(
        Web3.bundle.ethereumProviderV1.uri,
        ethereumProviderPlugin({
          connections: connections,
        }) as IWrapPackage
      )
      .build();

    const client = new PolywrapClient(clientConfig);

    const signerAddress = await client.invoke<string>({
      method: "getSignerAddress",
      uri: "ens/wraps.eth:ethereum@1.0.0",
      args: {
        connection: {
          networkNameOrChainId: network,
        },
      },
    });

    if (!signerAddress.ok) {
      throw new Error("Could not get signer. " + signerAddress.error);
    }

    const registerData = await client.invoke<
      { tx: { hash: string }; didRegister: boolean }[]
    >({
      method: "registerDomainAndSubdomainsRecursively",
      uri: "ens/wraps.eth:ens@1.0.0",
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

    // didRegister can be false if the ens domain is already registered, in which case there is no transaction
    if (registerData.value[0].didRegister) {
      await invokeWithTimeout(
        client,
        {
          method: "awaitTransaction",
          uri: Uri.from("ens/wraps.eth:ethereum@1.0.0"),
          args: {
            txHash: registerData.value[0].tx.hash,
            connection: {
              networkNameOrChainId: network,
            },
          },
        },
        15000
      );
    }

    return new Uri(`ens/${network}/${ensDomain}`);
  }
}

export default new ENSRecursiveNameRegisterPublisher();
