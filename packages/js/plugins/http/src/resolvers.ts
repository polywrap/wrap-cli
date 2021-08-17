import { HttpPlugin } from ".";
import { Request } from "./types";

import { PluginModule } from "@web3api/core-js";

export const query = (http: HttpPlugin): PluginModule => ({
  get: async (input: { url: string; request: Request }) => {
    return await http.get(input.url, input.request);
  },
  post: async (input: { url: string; request: Request }) => {
    return await http.post(input.url, input.request);
  },
});
