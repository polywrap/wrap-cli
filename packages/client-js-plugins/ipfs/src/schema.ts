import { IpfsPlugin } from "./";

export const Mutation = (ipfs: IpfsPlugin) => ({
  addFile: async (input: { data: Uint8Array }) => {
    return await ipfs.add(input.data);
  }
})

export const Query = (ipfs: IpfsPlugin) => ({
  catFile: async (input: { cid: string }) => {
    return await ipfs.cat(input.cid);
  }
})
