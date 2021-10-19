import {
  AddKey,
  CreateAccount,
  DeleteAccount,
  DeleteKey,
  DeployContract,
  FullAccessPermission,
  FunctionCall,
  FunctionCallPermission,
  KeyType,
  KeyTypeEnum,
  Stake,
  Transfer,
} from "./w3";

import * as nearApi from "near-api-js";

// Type hacks
// TODO: Remove these type hacks after completing https://github.com/polywrap/monorepo/issues/508

export type Action =
  | CreateAccount
  | DeployContract
  | FunctionCall
  | Transfer
  | Stake
  | AddKey
  | DeleteKey
  | DeleteAccount;

export type AccessKeyPermission = FunctionCallPermission | FullAccessPermission;

export interface QueryResponseKind {
  block_height: number;
  block_hash: string;
}

export interface AccountView extends QueryResponseKind {
  amount: string;
  locked: string;
  code_hash: string;
  storage_usage: number;
  storage_paid_at: number;
}

// Type utility functions

export function isCreateAccount(action: Action): action is CreateAccount {
  return "_" in action;
}

export function isDeployContract(action: Action): action is DeployContract {
  return "code" in action;
}

export function isFunctionCall(action: Action): action is FunctionCall {
  return (
    "methodName" in action &&
    "args" in action &&
    "gas" in action &&
    "deposit" in action
  );
}

export function isTransfer(action: Action): action is Transfer {
  return "deposit" in action && Object.keys(action).length === 1;
}

export function isStake(action: Action): action is Stake {
  return "stake" in action && "publicKey" in action;
}

export function isAddKey(action: Action): action is AddKey {
  return "publicKey" in action && "accessKey" in action;
}

export function isDeleteKey(action: Action): action is DeleteKey {
  return "publicKey" in action && Object.keys(action).length === 1;
}

export function isDeleteAccount(action: Action): action is DeleteAccount {
  return "beneficiaryId" in action;
}

export function isNearDeployContract(
  action: nearApi.transactions.IAction
): action is nearApi.transactions.DeployContract {
  return "code" in action;
}

export function isNearFunctionCall(
  action: nearApi.transactions.IAction
): action is nearApi.transactions.FunctionCall {
  return (
    "methodName" in action &&
    "args" in action &&
    "gas" in action &&
    "deposit" in action
  );
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
    case KeyTypeEnum.ED25519 || KeyTypeEnum[KeyTypeEnum.ED25519]:
      return "ed25519";
    default:
      throw new Error(`Unknown key type ${keyType}`);
  }
}
