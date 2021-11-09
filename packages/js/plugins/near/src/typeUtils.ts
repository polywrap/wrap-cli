import {
  FullAccessPermission,
  FunctionCallPermission,
  KeyType,
  KeyTypeEnum,
  PublicKey,
  Action,
} from "./w3";

import * as nearApi from "near-api-js";

export type AccessKeyPermission = FunctionCallPermission | FullAccessPermission;

// Type utility functions
function isNotNullOrUndefined(prop: unknown): boolean {
  return prop !== undefined && prop !== null;
}

export function isCreateAccount(action: Action): boolean {
  return (
    !isNotNullOrUndefined(action.code) &&
    !isNotNullOrUndefined(action.methodName) &&
    !isNotNullOrUndefined(action.args) &&
    !isNotNullOrUndefined(action.gas) &&
    !isNotNullOrUndefined(action.deposit) &&
    !isNotNullOrUndefined(action.stake) &&
    !isNotNullOrUndefined(action.publicKey) &&
    !isNotNullOrUndefined(action.accessKey) &&
    !isNotNullOrUndefined(action.beneficiaryId)
  );
}

export function isDeployContract(action: Action): boolean {
  return isNotNullOrUndefined(action.code);
}

export function isFunctionCall(action: Action): boolean {
  return (
    isNotNullOrUndefined(action.methodName) &&
    isNotNullOrUndefined(action.gas) &&
    isNotNullOrUndefined(action.deposit)
  );
}

export function isTransfer(action: Action): boolean {
  return (
    !isNotNullOrUndefined(action.methodName) &&
    !isNotNullOrUndefined(action.args) &&
    !isNotNullOrUndefined(action.gas) &&
    isNotNullOrUndefined(action.deposit)
  );
}

export function isStake(action: Action): boolean {
  return (
    isNotNullOrUndefined(action.stake) && isNotNullOrUndefined(action.publicKey)
  );
}

export function isAddKey(action: Action): boolean {
  return (
    isNotNullOrUndefined(action.publicKey) &&
    isNotNullOrUndefined(action.accessKey)
  );
}

export function isDeleteKey(action: Action): boolean {
  return (
    isNotNullOrUndefined(action.publicKey) &&
    !isNotNullOrUndefined(action.accessKey) &&
    !isNotNullOrUndefined(action.stake)
  );
}

export function isDeleteAccount(action: Action): boolean {
  return isNotNullOrUndefined(action.beneficiaryId);
}

export function isNearDeployContract(
  action: nearApi.transactions.IAction
): action is nearApi.transactions.DeployContract {
  return "code" in action;
}

export function isNearFunctionCall(
  action: nearApi.transactions.IAction
): action is nearApi.transactions.FunctionCall {
  return "methodName" in action && "gas" in action && "deposit" in action;
}

export function isNearTransfer(
  action: nearApi.transactions.IAction
): action is nearApi.transactions.Transfer {
  return "deposit" in action && !isNearFunctionCall(action);
}

export function isNearStake(
  action: nearApi.transactions.IAction
): action is nearApi.transactions.Stake {
  return "stake" in action && "publicKey" in action;
}

export function isNearAddKey(
  action: nearApi.transactions.IAction
): action is nearApi.transactions.AddKey {
  return "publicKey" in action && "accessKey" in action;
}

export function isNearDeleteKey(
  action: nearApi.transactions.IAction
): action is nearApi.transactions.DeleteKey {
  return "publicKey" in action && !isNearAddKey(action);
}

export function isNearDeleteAccount(
  action: nearApi.transactions.IAction
): action is nearApi.transactions.DeleteAccount {
  return "beneficiaryId" in action;
}

export function isNearFunctionCallPermission(
  permission: nearApi.utils.enums.Assignable
): permission is nearApi.transactions.FunctionCallPermission {
  return (
    "receiverId" in permission &&
    "methodNames" in permission &&
    "allowance" in permission
  );
}

export function keyTypeToStr(keyType: KeyType): string {
  switch (keyType) {
    case KeyTypeEnum.ed25519:
      return "ed25519";
    case KeyTypeEnum[KeyTypeEnum.ed25519]:
      return "ed25519";
    default:
      throw new Error(`Unknown key type ${keyType}`);
  }
}

export function keyTypeFromStr(keyType: string): KeyTypeEnum {
  switch (keyType) {
    case "ed25519":
      return KeyTypeEnum.ed25519;
    default:
      throw new Error(`Unknown key type ${keyType}`);
  }
}

export const publicKeyToStr = (key: PublicKey): string => {
  const keyTypeStr = keyTypeToStr(key.keyType);
  const encodedData = nearApi.utils.serialize.base_encode(key.data);
  return `${keyTypeStr}:${encodedData}`;
};
