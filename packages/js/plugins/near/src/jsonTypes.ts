/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */

export interface JsonAccessKey {
  block_hash?: string;
  block_height?: number | string;
  nonce: number | string;
  permission: {
    FunctionCall?: {
      allowance: number | string;
      method_names: string[];
      receiver_id: string;
    };
    FullAccess?: object;
  };
}

export interface JsonAction {
  code?: string;
  method_name?: string;
  args?: string;
  gas?: number | string;
  deposit?: number | string;
  public_key?: string;
  stake?: number | string;
  access_key?: JsonAccessKey;
  beneficiary_id?: string;
}

export interface JsonTransaction {
  signer_id: string;
  public_key: string;
  nonce: string;
  receiver_id: string;
  hash: string;
  actions: [Record<string, JsonAction>];
}

export interface JsonExecutionOutcome {
  executor_id: string;
  gas_burnt: number | string;
  logs: object[];
  metadata: {
    gas_profile: null;
    version: number;
  };
  receipt_ids: string[];
  status: JsonExecutionStatus;
  tokens_burnt: number | string;
}

// Also used for non-json Near ExecutionStatus type
export interface JsonExecutionStatus {
  SuccessValue?: string;
  SuccessReceiptId?: string;
  Failure?: object;
}

export interface JsonAccountState {
  amount: string;
  locked: string;
  code_hash: string;
  storage_usage: number;
  storage_paid_at: number;
  block_height: number | string;
  block_hash: string;
}
