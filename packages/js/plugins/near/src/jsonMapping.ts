import { AccessKey, Transaction, ExecutionOutcome } from "./w3";
import { Action } from "./typeUtils";
import { toExecutionStatus, toPublicKey } from "./typeMapping";
import { JsonAccessKey, JsonAction, JsonExecutionOutcome, JsonTransaction } from "./jsonTypes";

export const parseJsonResponseTx = (tx: JsonTransaction): Transaction => {
  const jsonActions: JsonAction[] = tx.actions
    .map((v: Record<string, JsonAction>): JsonAction[] => Object.values(v))
    .flat();
  return {
    signerId: tx.signer_id,
    publicKey: toPublicKey(tx.public_key),
    nonce: tx.nonce,
    receiverId: tx.receiver_id,
    blockHash: Buffer.from(tx.hash),
    actions: jsonActions.map(parseJsonResponseAction),
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
    permission: jsonAccessKey.permission.FullAccess
      ? jsonAccessKey.permission.FullAccess
      : {
          allowance: jsonAccessKey.permission.FunctionCall?.allowance.toString(),
          methodNames: jsonAccessKey.permission.FunctionCall?.method_names,
          receiverId: jsonAccessKey.permission.FunctionCall?.receiver_id,
        },
  } as AccessKey);

export const parseJsonExecutionOutcome = (
  jsonOutcome: JsonExecutionOutcome
): ExecutionOutcome =>
  ({
    logs: jsonOutcome.logs.map((log) => JSON.stringify(log)),
    receiptIds: jsonOutcome.receipt_ids,
    gasBurnt: jsonOutcome.gas_burnt.toString(),
    status: toExecutionStatus(jsonOutcome.status),
  } as ExecutionOutcome);
