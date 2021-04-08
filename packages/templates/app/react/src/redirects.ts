import { UriRedirect } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";

const ethereum = (window as any).ethereum;
if (ethereum) {
  ethereum.request({ method: "eth_requestAccounts" });
} else {
  throw Error("Please install Metamask.");
}
export const redirects: UriRedirect[] = [
  {
    from: "w3://ens/ethereum.web3api.eth",
    to: ethereumPlugin({ provider: ethereum }),
  },
];
