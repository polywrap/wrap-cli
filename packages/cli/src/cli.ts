/* eslint-disable @typescript-eslint/no-explicit-any */

import { build, GluegunToolbox } from "gluegun";

interface Args {
  [key: string]: unknown;
}

export const run = async (argv: Args): Promise<GluegunToolbox> => {
  const cli = build("w3")
    .src(__dirname)
    .plugins(`${process.cwd()}/node_modules`, {
      matching: "w3-*",
      hidden: true,
    })
    .help()
    .create();

  return await cli.run(argv);
};
