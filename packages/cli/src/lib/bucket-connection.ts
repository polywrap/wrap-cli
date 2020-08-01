import { Buckets, PushPathResult, KeyInfo } from "@textile/hub";
import { identifyAccessToken } from "./user-auth-textile";

export const insertProtocol = async (protocolName: string): Promise<PushPathResult> => {
  const keyInfo: KeyInfo = {
    key: "bxusvy3lxtv7brpfyepjrnlmcde"
  };

  const token = await identifyAccessToken(protocolName);
  const buckets = await Buckets.withKeyInfo(keyInfo);

  await buckets.getToken(token!);

  const root = await buckets.open("web3api-cli");

  if (!root) {
    throw new Error("Failed to open bucket");
  }

  return await buckets.pushPath(
    root.key,
    "index.html",
    Buffer.from(`<body><h1>${protocolName} has been deployed :-) !</h1></body>`)
  );
};
