import {
  AccessKey,
  AccessKeyPermission,
  BlockReference,
  BlockResult,
  Chunk,
} from "../query/w3";
import { BigInt, JSON, JSONEncoder } from "@web3api/wasm-as";

export function fromBlockReference(blockQuery: BlockReference): JSON.Obj {
  const encoder = new JSONEncoder();
  encoder.pushObject(null);
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
  return <JSON.Obj>JSON.parse(encoder.serialize());
}

export function toBlockResult(json: JSON.Obj): BlockResult {
  const header: JSON.Obj = json.getObj("header")!;
  const chunks: JSON.Arr = json.getArr("chunks")!;
  return {
    author: json.getString("author")!.valueOf(),
    header: {
      height: BigInt.fromString(header.getValue("height")!.stringify()),
      epoch_id: header.getString("epoch_id")!.valueOf(),
      next_epoch_id: header.getString("next_epoch_id")!.valueOf(),
      hash: header.getString("hash")!.valueOf(),
      prev_hash: header.getString("prev_hash")!.valueOf(),
      prev_state_root: header.getString("prev_state_root")!.valueOf(),
      chunk_receipts_root: header.getString("chunk_receipts_root")!.valueOf(),
      chunk_headers_root: header.getString("chunk_headers_root")!.valueOf(),
      chunk_tx_root: header.getString("chunk_tx_root")!.valueOf(),
      outcome_root: header.getString("outcome_root")!.valueOf(),
      chunks_included: BigInt.fromString(header.getValue("chunks_included")!.stringify()),
      challenges_root: header.getString("challenges_root")!.valueOf(),
      timestamp: BigInt.fromString(header.getValue("timestamp")!.stringify()),
      timestamp_nanosec: header.getString("timestamp_nanosec")!.valueOf(),
      random_value: header.getString("random_value")!.valueOf(),
      validator_proposals: header.getArr("validator_proposals")!.valueOf(),
      chunk_mask: header.getArr("chunk_mask")!.valueOf().map<boolean>((v: JSON.Value) => (<JSON.Bool>v).valueOf()),
      gas_price: header.getString("gas_price")!.valueOf(),
      rent_paid: header.getString("rent_paid")!.valueOf(),
      validator_reward: header.getString("validator_reward")!.valueOf(),
      total_supply: header.getString("total_supply")!.valueOf(),
      challenges_result: header.getArr("challenges_result")!.valueOf(),
      last_final_block: header.getString("last_final_block")!.valueOf(),
      last_ds_final_block: header.getString("last_ds_final_block")!.valueOf(),
      next_bp_hash: header.getString("next_bp_hash")!.valueOf(),
      block_merkle_root: header.getString("block_merkle_root")!.valueOf(),
      approvals: header.getArr("approvals")!.valueOf().map<string | null>((v: JSON.Value) => v.isNull ? null : (<JSON.Str>v).valueOf()),
      signature: header.getString("signature")!.valueOf(),
      latest_protocol_version: BigInt.fromString(header.getValue("latest_protocol_version")!.stringify()),
    },
    chunks: chunks.valueOf().map<Chunk>((v: JSON.Value, i: i32, s: JSON.Value[]) => {
      const chunk: JSON.Obj = <JSON.Obj>v;
      return {
        chunk_hash: chunk.getString("chunk_hash")!.valueOf(),
        prev_block_hash: chunk.getString("prev_block_hash")!.valueOf(),
        outcome_root: chunk.getString("outcome_root")!.valueOf(),
        prev_state_root: chunk.getString("prev_state_root")!.valueOf(),
        encoded_merkle_root: chunk.getString("encoded_merkle_root")!.valueOf(),
        encoded_length: BigInt.fromString(chunk.getValue("encoded_length")!.stringify()),
        height_created: BigInt.fromString(chunk.getValue("height_created")!.stringify()),
        height_included: BigInt.fromString(chunk.getValue("height_included")!.stringify()),
        shard_id: BigInt.fromString(chunk.getValue("shard_id")!.stringify()),
        gas_used: BigInt.fromString(chunk.getValue("gas_used")!.stringify()),
        gas_limit: BigInt.fromString(chunk.getValue("gas_limit")!.stringify()),
        rent_paid: chunk.getString("rent_paid")!.valueOf(),
        validator_reward: chunk.getString("validator_reward")!.valueOf(),
        balance_burnt: chunk.getString("balance_burnt")!.valueOf(),
        outgoing_receipts_root: chunk.getString("outgoing_receipts_root")!.valueOf(),
        tx_root: chunk.getString("tx_root")!.valueOf(),
        validator_proposals: chunk.getArr("validator_proposals")!.valueOf(),
        signature: chunk.getString("signature")!.valueOf(),
      };
    }),
  }
}

export function toAccessKey(json: JSON.Obj): AccessKey {
  let permission: AccessKeyPermission;
  const jsonPermVal: JSON.Value = json.getValue("permission")!;
  if (jsonPermVal.isString) {
    permission = {
      isFullAccess: true,
      receiverId: null,
      methodNames: null,
      allowance: null
    };
  } else {
    const jsonFunCall = (<JSON.Obj>jsonPermVal).getObj("FunctionCall")!;
    const receiverId = jsonFunCall.getString("receiver_id")!.valueOf();
    const methodNames = jsonFunCall.getArr("method_names")!.valueOf().map<string>((v: JSON.Value) => (<JSON.Str>v).valueOf());
    const allowance = BigInt.fromString(jsonFunCall.getString("allowance")!.valueOf());
    permission = {
      isFullAccess: false,
      receiverId,
      methodNames,
      allowance,
    };
  }

  return {
    nonce: BigInt.fromString(json.getValue("nonce")!.stringify()),
    permission: permission,
  };
}