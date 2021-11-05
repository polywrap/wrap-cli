/* eslint-disable @typescript-eslint/naming-convention */

import {
  AccessKey,
  Transaction,
  ExecutionOutcome,
  Action,
  ExecutionOutcomeWithId,
  FinalExecutionOutcome,
  ExecutionStatus,
} from "./w3";
import { toPublicKey } from "./typeMapping";
import {
  JsonAccessKey,
  JsonAction,
  JsonExecutionOutcome,
  JsonExecutionOutcomeWithId,
  JsonExecutionStatus,
  JsonFinalExecutionOutcome,
  JsonTransaction,
} from "./jsonTypes";

export const parseJsonResponseTx = (tx: JsonTransaction): Transaction => {
  const jsonActions: JsonAction[] = tx.actions
    .map((v: Record<string, JsonAction>): JsonAction[] => Object.values(v))
    .flat();
  return {
    signerId: tx.signer_id,
    publicKey: toPublicKey(tx.public_key),
    nonce: tx.nonce.toString(),
    receiverId: tx.receiver_id,
    actions: jsonActions.map(parseJsonResponseAction),
    hash: tx.hash,
  };
};

export const parseJsonResponseAction = (jsonAction: JsonAction): Action => {
  const allPropsAction: Record<string, unknown> = {
    code: jsonAction.code ? Buffer.from(jsonAction.code) : undefined, // TODO: how to deserialize this?
    methodName: jsonAction.method_name,
    args: jsonAction.args ? Buffer.from(jsonAction.args) : undefined, // TODO: how to deserialize this?
    gas: jsonAction.gas?.toString(),
    deposit: jsonAction.deposit?.toString(),
    publicKey: jsonAction.public_key
      ? toPublicKey(jsonAction.public_key)
      : undefined,
    stake: jsonAction.stake?.toString(),
    accessKey: jsonAction.access_key
      ? parseJsonResponseAccessKey(jsonAction.access_key)
      : undefined,
    beneficiaryId: jsonAction.beneficiary_id,
  };
  const action: Record<string, unknown> = {};
  Object.keys(allPropsAction).forEach((key: string) => {
    if (allPropsAction[key] !== undefined) {
      action[key] = allPropsAction[key];
    }
  });
  return action as Action;
};

export const parseJsonResponseAccessKey = (
  jsonAccessKey: JsonAccessKey
): AccessKey =>
  ({
    nonce: jsonAccessKey.nonce.toString(),
    permission:
      typeof jsonAccessKey.permission === "string"
        ? {}
        : {
            allowance: jsonAccessKey.permission.FunctionCall?.allowance.toString(),
            methodNames: jsonAccessKey.permission.FunctionCall?.method_names,
            receiverId: jsonAccessKey.permission.FunctionCall?.receiver_id,
          },
  } as AccessKey);

export const parseJsonExecutionStatus = (
  status: JsonExecutionStatus | string
): ExecutionStatus => {
  if (typeof status === "string") {
    return { successValue: status };
  }
  return {
    successValue: status.SuccessValue,
    successReceiptId: status.SuccessReceiptId,
    failure: JSON.stringify(status.Failure),
  };
};

export const parseJsonExecutionOutcome = (
  jsonOutcome: JsonExecutionOutcome
): ExecutionOutcome =>
  ({
    logs: jsonOutcome.logs.map((log) => JSON.stringify(log)),
    receipt_ids: jsonOutcome.receipt_ids,
    gas_burnt: jsonOutcome.gas_burnt.toString(),
    status: parseJsonExecutionStatus(jsonOutcome.status),
  } as ExecutionOutcome);

export const parseJsonExecutionOutcomeWithId = (
  jsonOutcomeWithId: JsonExecutionOutcomeWithId
): ExecutionOutcomeWithId => ({
  id: jsonOutcomeWithId.id,
  outcome: parseJsonExecutionOutcome(jsonOutcomeWithId.outcome),
  block_hash: jsonOutcomeWithId.block_hash,
  proof: jsonOutcomeWithId.proof ?? [],
});

export const parseJsonFinalExecutionOutcome = (
  outcome: JsonFinalExecutionOutcome
): FinalExecutionOutcome => {
  return {
    status: parseJsonExecutionStatus(outcome.status),
    transaction: parseJsonResponseTx(outcome.transaction),
    transaction_outcome: parseJsonExecutionOutcomeWithId(
      outcome.transaction_outcome
    ),
    receipts_outcome: outcome.receipts_outcome.map(
      parseJsonExecutionOutcomeWithId
    ),
  };
};
