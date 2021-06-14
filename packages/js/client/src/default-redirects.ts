import { Uri, UriRedirect } from "@web3api/core-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { loggerPlugin } from "@web3api/logger-plugin-js";
import { sha3Plugin } from "@web3api/sha3-plugin-js"; // eslint-disable-line
import { uts46Plugin } from "@web3api/uts46-plugin-js"; // eslint-disable-line
import { Tracer } from "@web3api/tracing-js";

export const getDefaultRedirects = Tracer.traceFunc(
  "client-js: getDefaultRedirects",
  (): UriRedirect<Uri>[] => {
    return [
      {
        from: new Uri("w3://ens/uts46.web3api.eth"),
        to: uts46Plugin(),
      },
      // IPFS is required for downloading Web3API packages
      {
        from: new Uri("w3://ens/ipfs.web3api.eth"),
        to: ipfsPlugin({ provider: "https://ipfs.io" }),
      },
      // ENS is required for resolving domain to IPFS hashes
      {
        from: new Uri("w3://ens/ens.web3api.eth"),
        to: ensPlugin({}),
      },
      {
        from: new Uri("w3://ens/ethereum.web3api.eth"),
        to: ethereumPlugin({
          networks: {
            mainnet: {
              provider:
                "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
            },
          },
        }),
      },
      {
        from: new Uri("w3://w3/logger"),
        to: loggerPlugin(),
      },
      {
        from: new Uri("w3://ens/sha3.web3api.eth"),
        to: sha3Plugin(),
      },
    ];
  }
);
