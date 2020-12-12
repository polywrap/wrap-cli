import { insertProtocol } from "../lib/textile/bucket-connection";

import { GluegunToolbox } from "gluegun";

export default {
  alias: ["p"],
  description: "Publish your protocol to IPFS",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters, print } = toolbox;
    const spinner = print.spin("Uploading to IPFS");
    try {
      const protocol = parameters.first as string;
      const hash = await insertProtocol(protocol);
      spinner.succeed("Protocol uploaded to IPFS!");
      print.success(`https://gateway.ipfs.io${hash.root}`);
    } catch (e) {
      spinner.fail(`Protocol upload failed: ${e}`);
    }
  },
};
