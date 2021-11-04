/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  AccessKey,
  AccessKeyPermission as IAccessKeyPermission,
  AccountView,
  Action,
  KeyTypeEnum,
  PublicKey,
  Signature,
  SignedTransaction,
  Transaction,
} from "./w3";
import {
  AccessKeyPermission,
  AccountView as NearAccountView,
  isAddKey,
  isCreateAccount,
  isDeleteAccount,
  isDeleteKey,
  isDeployContract,
  isFunctionCall,
  isNearAddKey,
  isNearDeleteAccount,
  isNearDeleteKey,
  isNearDeployContract,
  isNearFunctionCall,
  isNearFunctionCallPermission,
  isNearStake,
  isNearTransfer,
  isStake,
  isTransfer,
  keyTypeFromStr,
  publicKeyToStr,
} from "./typeUtils";

import * as nearApi from "near-api-js";
import BN from "bn.js";

export const toAction = (action: nearApi.transactions.Action): Action => {
  let result: Action;
  if (isNearDeployContract(action)) {
    result = { code: action.code };
  } else if (isNearFunctionCall(action)) {
    result = {
      methodName: action["methodName"],
      args: action["args"],
      gas: action["gas"].toString(),
      deposit: action["deposit"].toString(),
    };
  } else if (isNearTransfer(action)) {
    result = { deposit: action["deposit"].toString() };
  } else if (isNearStake(action)) {
    result = {
      stake: action.stake.toString(),
      publicKey: toPublicKey(action.publicKey),
    };
  } else if (isNearAddKey(action)) {
    result = {
      publicKey: toPublicKey(action.publicKey),
      accessKey: toAccessKey(action.accessKey),
    };
  } else if (isNearDeleteKey(action)) {
    result = { publicKey: toPublicKey(action.publicKey) };
  } else if (isNearDeleteAccount(action)) {
    result = {
      beneficiaryId: action.beneficiaryId,
    };
  } else {
    result = {};
  }
  return result as Action;
};

export const fromAction = (action: Action): nearApi.transactions.Action => {
  if (isCreateAccount(action)) {
    return nearApi.transactions.createAccount();
  } else if (isDeployContract(action)) {
    return nearApi.transactions.deployContract(action.code!);
  } else if (isFunctionCall(action)) {
    return nearApi.transactions.functionCall(
      action.methodName!,
      action.args ?? {},
      new BN(action.gas!),
      new BN(action.deposit!)
    );
  } else if (isTransfer(action)) {
    return nearApi.transactions.transfer(new BN(action.deposit!));
  } else if (isStake(action)) {
    const publicKey = fromPublicKey(action.publicKey!);
    return nearApi.transactions.stake(new BN(action.stake!), publicKey);
  } else if (isAddKey(action)) {
    const publicKey = fromPublicKey(action.publicKey!);
    const accessKey = new nearApi.transactions.AccessKey(action.accessKey!);
    return nearApi.transactions.addKey(publicKey, accessKey);
  } else if (isDeleteKey(action)) {
    const publicKey = fromPublicKey(action.publicKey!);
    return nearApi.transactions.deleteKey(publicKey);
  } else if (isDeleteAccount(action)) {
    return nearApi.transactions.deleteAccount(action.beneficiaryId!);
  } else {
    throw Error("Failed to map type Action to nearApi.transactions.Action");
  }
};

export const toTx = (tx: nearApi.transactions.Transaction): Transaction => ({
  signerId: tx.signerId,
  publicKey: toPublicKey(tx.publicKey),
  nonce: tx.nonce.toString(),
  receiverId: tx.receiverId,
  blockHash: tx.blockHash,
  actions: tx.actions.map(toAction),
});

export const fromTx = (tx: Transaction): nearApi.transactions.Transaction => {
  return new nearApi.transactions.Transaction({
    signerId: tx.signerId,
    publicKey: fromPublicKey(tx.publicKey),
    nonce: Number.parseInt(tx.nonce),
    receiverId: tx.receiverId,
    blockHash: tx.blockHash,
    actions: tx.actions.map(fromAction),
  });
};

export const fromSignedTx = (
  signedTx: SignedTransaction
): nearApi.transactions.SignedTransaction => {
  return new nearApi.transactions.SignedTransaction({
    transaction: fromTx(signedTx.transaction),
    signature: fromSignature(signedTx.signature),
  });
};

export const fromSignature = (
  signature: Signature
): nearApi.transactions.Signature => {
  const keyType =
    typeof signature.keyType === "number"
      ? (signature.keyType as number)
      : KeyTypeEnum[signature.keyType];
  return new nearApi.transactions.Signature({
    keyType: keyType,
    data: signature.data,
  });
};

export const toPublicKey = (
  key: nearApi.utils.PublicKey | string
): PublicKey => {
  if (typeof key === "string") {
    const [keyTypeStr, keyStr] = key.split(":");
    const decodedData: Uint8Array = nearApi.utils.serialize.base_decode(keyStr);
    return { keyType: keyTypeFromStr(keyTypeStr), data: decodedData };
  } else {
    return { keyType: key.keyType as number, data: key.data };
  }
};

export const fromPublicKey = (key: PublicKey): nearApi.utils.PublicKey => {
  return nearApi.utils.PublicKey.from(publicKeyToStr(key));
};

export const toAccessKey = (key: nearApi.transactions.AccessKey): AccessKey => {
  let permission: AccessKeyPermission = {};
  if (isNearFunctionCallPermission(key.permission)) {
    permission = {
      receiverId: key.permission.receiverId,
      methodNames: key.permission.methodNames,
      allowance: key.permission.allowance?.toString(),
    };
  }
  return {
    nonce: key.nonce.toString(),
    permission: permission as IAccessKeyPermission,
  };
};

export const fromAccessKey = (
  key: AccessKey
): nearApi.transactions.AccessKey => {
  return new nearApi.transactions.AccessKey(key);
};

export const toAccountView = (accountView: NearAccountView): AccountView => ({
  amount: accountView.amount,
  locked: accountView.locked,
  codeHash: accountView.code_hash,
  storageUsage: accountView.storage_usage.toString(),
  storagePaidAt: accountView.storage_usage.toString(),
  blockHeight: accountView.block_height.toString(),
  blockHash: accountView.block_hash,
});


// export const toFinalExecutionOutcome = (
//   outcome: nearApi.providers.FinalExecutionOutcome
// ): FinalExecutionOutcome => {
//   return {
//     status: toExecutionStatus(outcome.status),
//     transaction: parseJsonResponseTx(outcome.transaction),
//     transaction_outcome: toExecutionOutcomeWithId(outcome.transaction_outcome),
//     receipts_outcome: outcome.receipts_outcome.map(toExecutionOutcomeWithId),
//   };
// };
//
// export const toExecutionOutcomeWithId = (
//   outcomeWithId: nearApi.providers.ExecutionOutcomeWithId
// ): ExecutionOutcomeWithId => {
//   const outcome: ExecutionOutcome = {
//     logs: outcomeWithId.outcome.logs ? outcomeWithId.outcome.logs : null,
//     receipt_ids: outcomeWithId.outcome.receipt_ids,
//     gas_burnt: outcomeWithId.outcome.gas_burnt.toString(),
//     status: toExecutionStatus(outcomeWithId.outcome.status),
//   };
//   return {
//     id: outcomeWithId.id,
//     outcome: outcome,
//   };
// };
//
// export const parseJsonExecutionStatus = (
//   status: JsonExecutionStatus | string
// ): ExecutionStatus => {
//   if (typeof status === "string") {
//     return { successValue: status };
//   }
//   return {
//     successValue: status.SuccessValue,
//     successReceiptId: status.SuccessReceiptId,
//     failure: JSON.stringify(status.Failure),
//   };
// };
