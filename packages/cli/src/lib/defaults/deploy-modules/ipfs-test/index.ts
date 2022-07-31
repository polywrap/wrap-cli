import { Deployer } from "../../../deploy/deployer";

import { Uri } from "@polywrap/core-js";

class IPFSDeployer implements Deployer {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  async execute(_: Uri, __: unknown): Promise<Uri> {
    return new Uri(`ipfs/Qm`);
  }
}

export default new IPFSDeployer();
