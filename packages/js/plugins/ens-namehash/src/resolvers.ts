import { EnsNamehashPlugin } from ".";

import { PluginModule } from "@web3api/core-js";

export const query = (ensNamehash: EnsNamehashPlugin): PluginModule => ({
  hash: (input: { value: string }) => {
    return ensNamehash.namehash(input.value);
  },
  normalize: (input: { value: string }) => {
    return ensNamehash.normalize(input.value);
  },
});
