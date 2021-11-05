import { BlockReference, BlockResult } from "../query/w3";
import { Near_Mutation, } from "../mutation/w3";
import { JSON } from "@web3api/wasm-as";
import { fromBlockReference, toBlockResult } from "./jsonMap";

/**
 * Client class to interact with the NEAR RPC API.
 * @see {@link https://github.com/near/nearcore/tree/master/chain/jsonrpc}
 */
export default class JsonRpcProvider {
  /** @hidden */
  readonly url: string | null;

  /**
   * @param url RPC API endpoint URL
   */
  constructor(url: string | null) {
    this.url = url;
  }

  /**
   * Query for block info from the RPC
   * pass block_id OR finality as blockQuery, not both
   * @see {@link https://docs.near.org/docs/interaction/rpc#block}
   *
   * @param blockQuery {@link BlockReference} (passing a {@link BlockId} is deprecated)
   */
  block(blockQuery: BlockReference): BlockResult {
    const params: JSON.Obj = fromBlockReference(blockQuery);
    const json = this.sendJsonRpc('block', params);
    return toBlockResult(json);
  }

  /**
   * Directly call the RPC specifying the method and params
   *
   * @param method RPC method
   * @param params Parameters to the method
   */
  sendJsonRpc(method: string, params: JSON.Obj): JSON.Obj {
    return Near_Mutation.sendJsonRpc({ method, params }) as JSON.Obj;
  }
}