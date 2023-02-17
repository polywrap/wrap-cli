/* eslint-disable @typescript-eslint/naming-convention */

import { BuildManifest as OldManifest } from "../0.2.0";
import { BuildManifest as NewManifest, Image as NewImage } from "../0.3.0";

export function migrate(old: OldManifest): NewManifest {
  const oldBuildx = old.strategies?.image?.buildx;
  let newBuildx: NewImage["buildx"];
  if (typeof oldBuildx === "boolean") {
    newBuildx = oldBuildx;
  } else {
    newBuildx = {
      cache: oldBuildx?.cache,
      keepBuilder: !(oldBuildx ? oldBuildx.removeBuilder : true),
    };
  }
  return {
    ...old,
    __type: "BuildManifest",
    format: "0.3.0",
    strategies: {
      image: {
        buildx: newBuildx,
      },
    },
  };
}
