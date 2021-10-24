import { BlockReference, BlockResult, Chunk } from "../query/w3";
import { BigInt, JSON, JSONEncoder } from "@web3api/wasm-as";

export function fromBlockReference(blockQuery: BlockReference): JSON.Obj {
  const encoder = new JSONEncoder();
  encoder.pushObject("params");
  if (blockQuery.blockId != null) {
    encoder.setString("block_id", blockQuery.blockId!);
  }
  if (blockQuery.finality != null) {
    encoder.setString("finality", blockQuery.finality!);
  }
  if (blockQuery.syncCheckpoint != null) {
    encoder.setString("sync_ checkpoint", blockQuery.syncCheckpoint!);
  }
  encoder.popObject();
  return <JSON.Obj>JSON.parse(encoder.toString());
}

export function toBlockResult(json: JSON.Obj): BlockResult {
  const header: JSON.Obj = json.getObj("header")!;
  const chunks: JSON.Arr = json.getArr("chunks")!;
  return {
    author: json.getString("author")!.toString(),
    header: {
      height: BigInt.fromString(header.getString("height")!.toString()),
      epoch_id: header.getString("epoch_id")!.toString(),
      next_epoch_id: header.getString("next_epoch_id")!.toString(),
      hash: header.getString("hash")!.toString(),
      prev_hash: header.getString("prev_hash")!.toString(),
      prev_state_root: header.getString("prev_state_root")!.toString(),
      chunk_receipts_root: header.getString("chunk_receipts_root")!.toString(),
      chunk_headers_root: header.getString("chunk_headers_root")!.toString(),
      chunk_tx_root: header.getString("chunk_tx_root")!.toString(),
      outcome_root: header.getString("outcome_root")!.toString(),
      chunks_included: BigInt.fromString(header.getString("chunks_included")!.toString()),
      challenges_root: header.getString("challenges_root")!.toString(),
      timestamp: BigInt.fromString(header.getString("timestamp")!.toString()),
      timestamp_nanosec: header.getString("timestamp_nanosec")!.toString(),
      random_value: header.getString("random_value")!.toString(),
      validator_proposals: header.getArr("validator_proposals")!.valueOf(),
      chunk_mask: header.getArr("chunk_mask")!.valueOf().map<boolean>((v: JSON.Value, i: i32, s: JSON.Value[]) => (<JSON.Bool>v).valueOf()),
      gas_price: header.getString("gas_price")!.toString(),
      rent_paid: header.getString("rent_paid")!.toString(),
      validator_reward: header.getString("validator_reward")!.toString(),
      total_supply: header.getString("total_supply")!.toString(),
      challenges_result: header.getArr("challenges_result")!.valueOf(),
      last_final_block: header.getString("last_final_block")!.toString(),
      last_ds_final_block: header.getString("last_ds_final_block")!.toString(),
      next_bp_hash: header.getString("next_bp_hash")!.toString(),
      block_merkle_root: header.getString("block_merkle_root")!.toString(),
      approvals: header.getArr("approvals")!.valueOf().map<string>((v: JSON.Value, i: i32, s: JSON.Value[]) => v.toString()),
      signature: header.getString("signature")!.toString(),
      latest_protocol_version: BigInt.fromString(header.getString("latest_protocol_version")!.toString()),
    },
    chunks: chunks.valueOf().map<Chunk>((v: JSON.Value, i: i32, s: JSON.Value[]) => {
      const chunk: JSON.Obj = <JSON.Obj>v;
      return {
        chunk_hash: chunk.getString("chunk_hash")!.toString(),
        prev_block_hash: chunk.getString("prev_block_hash")!.toString(),
        outcome_root: chunk.getString("outcome_root")!.toString(),
        prev_state_root: chunk.getString("prev_state_root")!.toString(),
        encoded_merkle_root: chunk.getString("encoded_merkle_root")!.toString(),
        encoded_length: BigInt.fromString(chunk.getString("encoded_length")!.toString()),
        height_created: BigInt.fromString(chunk.getString("height_created")!.toString()),
        height_included: BigInt.fromString(chunk.getString("height_included")!.toString()),
        shard_id: BigInt.fromString(chunk.getString("shard_id")!.toString()),
        gas_used: BigInt.fromString(chunk.getString("gas_used")!.toString()),
        gas_limit: BigInt.fromString(chunk.getString("gas_limit")!.toString()),
        rent_paid: chunk.getString("rent_paid")!.toString(),
        validator_reward: chunk.getString("validator_reward")!.toString(),
        balance_burnt: chunk.getString("balance_burnt")!.toString(),
        outgoing_receipts_root: chunk.getString("outgoing_receipts_root")!.toString(),
        tx_root: chunk.getString("tx_root")!.toString(),
        validator_proposals: chunk.getArr("validator_proposals")!.valueOf(),
        signature: chunk.getString("signature")!.toString(),
      };
    }),
  }
}