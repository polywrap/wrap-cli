/* eslint-disable @typescript-eslint/naming-convention */

import { BuildManifest as OldManifest } from "../0.2.0";
import {
  BuildManifest as NewManifest,
  Image,
  Local,
  Vm
} from "../0.3.0";

export function migrate(old: OldManifest): NewManifest {
  let image: Image | undefined;
  const oldImage = old.strategies?.image; 

  if (oldImage) {
    // Patch
    const patchImage: Pick<
      Image,
      "buildx" | "remove_image"
    > = {
      buildx: oldImage.buildx ?
        (typeof oldImage.buildx === "object" ? {
          cache: oldImage.buildx.cache,
          remove_builder: oldImage.buildx.removeBuilder
        } : oldImage.buildx)
      : undefined,
      remove_image: oldImage.removeImage,
    };

    // Delete
    delete oldImage.buildx;
    delete oldImage.removeImage;

    // Combine
    image = {
      ...oldImage,
      ...patchImage
    };
  }

  let local: Local | undefined;
  const oldLocal = old.strategies?.local;

  if (oldLocal) {
    local = {
      build_script: oldLocal.scriptPath
    };
  }

  let vm: Vm | undefined;
  const oldVm = old.strategies?.vm;

  if (oldVm) {
    vm = {
      include: oldVm.defaultIncludes,
      image: oldVm.baseImage
    };
  }

  return {
    ...old,
    __type: "BuildManifest",
    format: "0.3.0",
    strategies: {
      image,
      local,
      vm
    },
  };
}
