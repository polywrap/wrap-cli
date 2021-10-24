import { BlockReference, BlockResult } from "../query/w3";
import { Near_Mutation, } from "../mutation/w3";
import { JSON } from "@web3api/wasm-as";
import { fromBlockReference, toBlockResult } from "./jsonMap";

// Default number of retries before giving up on a request.
// const REQUEST_RETRY_NUMBER = 12;
// // Default wait until next retry in millis.
// const REQUEST_RETRY_WAIT = 500;
// // Exponential back off for waiting to retry.
// const REQUEST_RETRY_WAIT_BACKOFF = 1.5;
// /// Keep ids unique across all connections.
// let _nextId = 123;

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

  // /**
  //  * Gets the RPC's status
  //  * @see {@link https://docs.near.org/docs/develop/front-end/rpc#general-validator-status}
  //  */
  // async status(): Promise<NodeStatusResult> {
  //   return this.sendJsonRpc('status', []);
  // }
  //
  // /**
  //  * Sends a signed transaction to the RPC and waits until transaction is fully complete
  //  * @see {@link https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await}
  //  *
  //  * @param signedTransaction The signed transaction being sent
  //  */
  // async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome> {
  //   const bytes = signedTransaction.encode();
  //   return this.sendJsonRpc('broadcast_tx_commit', [Buffer.from(bytes).toString('base64')]);
  // }
  //
  // /**
  //  * Sends a signed transaction to the RPC and immediately returns transaction hash
  //  * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
  //  * @param signedTransaction The signed transaction being sent
  //  * @returns {Promise<FinalExecutionOutcome>}
  //  */
  // async sendTransactionAsync(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome> {
  //   const bytes = signedTransaction.encode();
  //   return this.sendJsonRpc('broadcast_tx_async', [Buffer.from(bytes).toString('base64')]);
  // }
  //
  // /**
  //  * Gets a transaction's status from the RPC
  //  * @see {@link https://docs.near.org/docs/develop/front-end/rpc#transaction-status}
  //  *
  //  * @param txHash A transaction hash as either a Uint8Array or a base58 encoded string
  //  * @param accountId The NEAR account that signed the transaction
  //  */
  // async txStatus(txHash: Uint8Array | string, accountId: string): Promise<FinalExecutionOutcome> {
  //   if(typeof txHash === 'string') {
  //     return this.txStatusString(txHash, accountId);
  //   } else {
  //     return this.txStatusUint8Array(txHash, accountId);
  //   }
  // }
  //
  // private async txStatusUint8Array(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome> {
  //   return this.sendJsonRpc('tx', [baseEncode(txHash), accountId]);
  // }
  //
  // private async txStatusString(txHash: string, accountId: string): Promise<FinalExecutionOutcome> {
  //   return this.sendJsonRpc('tx', [txHash, accountId]);
  // }
  //
  // /**
  //  * Gets a transaction's status from the RPC with receipts
  //  * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#transaction-status-with-receipts)
  //  * @param txHash The hash of the transaction
  //  * @param accountId The NEAR account that signed the transaction
  //  * @returns {Promise<FinalExecutionOutcome>}
  //  */
  // async txStatusReceipts(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome> {
  //   return this.sendJsonRpc('EXPERIMENTAL_tx_status', [baseEncode(txHash), accountId]);
  // }
  //
  // /**
  //  * Query the RPC as [shown in the docs](https://docs.near.org/docs/develop/front-end/rpc#accounts--contracts)
  //  * Query the RPC by passing an {@link RpcQueryRequest}
  //  * @see {@link https://docs.near.org/docs/develop/front-end/rpc#accounts--contracts}
  //  *
  //  * @typeParam T the shape of the returned query response
  //  */
  // async query<T extends QueryResponseKind>(...args: any[]): Promise<T> {
  //   let result;
  //   if (args.length === 1) {
  //     result = await this.sendJsonRpc<T>('query', args[0]);
  //   } else {
  //     const [path, data] = args;
  //     result = await this.sendJsonRpc<T>('query', [path, data]);
  //   }
  //   if (result && result.error) {
  //     throw new TypedError(
  //       `Querying ${args} failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`,
  //       getErrorTypeFromErrorMessage(result.error));
  //   }
  //   return result;
  // }

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

  // /**
  //  * Query changes in block from the RPC
  //  * pass block_id OR finality as blockQuery, not both
  //  * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#block-details)
  //  */
  // async blockChanges(blockQuery: BlockReference): Promise<BlockChangeResult> {
  //   const { finality } = blockQuery as any;
  //   const { blockId } = blockQuery as any;
  //   return this.sendJsonRpc('EXPERIMENTAL_changes_in_block', { block_id: blockId, finality });
  // }
  //
  // /**
  //  * Queries for details about a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
  //  * @see {@link https://docs.near.org/docs/interaction/rpc#chunk}
  //  *
  //  * @param chunkId Hash of a chunk ID or shard ID
  //  */
  // async chunk(chunkId: ChunkId): Promise<ChunkResult> {
  //   return this.sendJsonRpc('chunk', [chunkId]);
  // }
  //
  // /**
  //  * Query validators of the epoch defined by the given block id.
  //  * @see {@link https://docs.near.org/docs/develop/front-end/rpc#detailed-validator-status}
  //  *
  //  * @param blockId Block hash or height, or null for latest.
  //  */
  // async validators(blockId: BlockId | null): Promise<EpochValidatorInfo> {
  //   return this.sendJsonRpc('validators', [blockId]);
  // }
  //
  // /**
  //  * @deprecated
  //  * Gets the genesis config from RPC
  //  * @see {@link https://docs.near.org/docs/develop/front-end/rpc#genesis-config}
  //  */
  // async experimental_genesisConfig(): Promise<NearProtocolConfig> {
  //   const deprecate = depd('JsonRpcProvider.experimental_protocolConfig()');
  //   deprecate('use `experimental_protocolConfig({ sync_checkpoint: \'genesis\' })` to fetch the up-to-date or genesis protocol config explicitly');
  //   return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', { sync_checkpoint: 'genesis' });
  // }
  //
  // /**
  //  * Gets the protocol config at a block from RPC
  //  * @see {@link }
  //  *
  //  * @param blockReference specifies the block to get the protocol config for
  //  */
  // async experimental_protocolConfig(blockReference: BlockReference | { sync_checkpoint: 'genesis' }): Promise<NearProtocolConfig> {
  //   return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', blockReference);
  // }
  //
  // /**
  //  * @deprecated Use {@link lightClientProof} instead
  //  */
  // async experimental_lightClientProof(request: LightClientProofRequest): Promise<LightClientProof> {
  //   const deprecate = depd('JsonRpcProvider.experimental_lightClientProof(request)');
  //   deprecate('use `lightClientProof` instead');
  //   return await this.lightClientProof(request);
  // }
  //
  // /**
  //  * Gets a light client execution proof for verifying execution outcomes
  //  * @see {@link https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof}
  //  */
  // async lightClientProof(request: LightClientProofRequest): Promise<LightClientProof> {
  //   return await this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
  // }
  //
  // /**
  //  * Gets access key changes for a given array of accountIds
  //  * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
  //  * @returns {Promise<ChangeResult>}
  //  */
  // async accessKeyChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult> {
  //   const { finality } = blockQuery as any;
  //   const { blockId } = blockQuery as any;
  //   return this.sendJsonRpc('EXPERIMENTAL_changes', {
  //     changes_type: 'all_access_key_changes',
  //     account_ids: accountIdArray,
  //     block_id: blockId,
  //     finality
  //   });
  // }
  //
  // /**
  //  * Gets single access key changes for a given array of access keys
  //  * pass block_id OR finality as blockQuery, not both
  //  * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
  //  * @returns {Promise<ChangeResult>}
  //  */
  // async singleAccessKeyChanges(accessKeyArray: AccessKeyWithPublicKey[], blockQuery: BlockReference): Promise<ChangeResult> {
  //   const { finality } = blockQuery as any;
  //   const { blockId } = blockQuery as any;
  //   return this.sendJsonRpc('EXPERIMENTAL_changes', {
  //     changes_type: 'single_access_key_changes',
  //     keys: accessKeyArray,
  //     block_id: blockId,
  //     finality
  //   });
  // }
  //
  // /**
  //  * Gets account changes for a given array of accountIds
  //  * pass block_id OR finality as blockQuery, not both
  //  * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
  //  * @returns {Promise<ChangeResult>}
  //  */
  // async accountChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult> {
  //   const { finality } = blockQuery as any;
  //   const { blockId } = blockQuery as any;
  //   return this.sendJsonRpc('EXPERIMENTAL_changes', {
  //     changes_type: 'account_changes',
  //     account_ids: accountIdArray,
  //     block_id: blockId,
  //     finality
  //   });
  // }
  //
  // /**
  //  * Gets contract state changes for a given array of accountIds
  //  * pass block_id OR finality as blockQuery, not both
  //  * Note: If you pass a keyPrefix it must be base64 encoded
  //  * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
  //  * @returns {Promise<ChangeResult>}
  //  */
  // async contractStateChanges(accountIdArray: string[], blockQuery: BlockReference, keyPrefix = ''): Promise<ChangeResult> {
  //   const { finality } = blockQuery as any;
  //   const { blockId } = blockQuery as any;
  //   return this.sendJsonRpc('EXPERIMENTAL_changes', {
  //     changes_type: 'data_changes',
  //     account_ids: accountIdArray,
  //     key_prefix_base64: keyPrefix,
  //     block_id: blockId,
  //     finality
  //   });
  // }
  //
  // /**
  //  * Gets contract code changes for a given array of accountIds
  //  * pass block_id OR finality as blockQuery, not both
  //  * Note: Change is returned in a base64 encoded WASM file
  //  * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
  //  * @returns {Promise<ChangeResult>}
  //  */
  // async contractCodeChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult> {
  //   const {finality} = blockQuery as any;
  //   const {blockId} = blockQuery as any;
  //   return this.sendJsonRpc('EXPERIMENTAL_changes', {
  //     changes_type: 'contract_code_changes',
  //     account_ids: accountIdArray,
  //     block_id: blockId,
  //     finality
  //   });
  // }
  //
  // /**
  //  * Returns gas price for a specific block_height or block_hash.
  //  * @see {@link https://docs.near.org/docs/develop/front-end/rpc#gas-price}
  //  *
  //  * @param blockId Block hash or height, or null for latest.
  //  */
  // async gasPrice(blockId: BlockId | null): Promise<GasPrice> {
  //   return await this.sendJsonRpc('gas_price', [blockId]);
  // }

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