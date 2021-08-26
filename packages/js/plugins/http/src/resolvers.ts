import { HttpPlugin } from ".";
import { Query } from "./w3";

export const query = (http: HttpPlugin): Query.Module => ({
  get: async (input: Query.Input_get) => {
    return await http.get(input.url, input.request || undefined);
  },
  post: async (input: Query.Input_post) => {
    return await http.post(input.url, input.request || undefined);
  },
});
