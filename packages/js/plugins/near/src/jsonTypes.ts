/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */

export interface JsonAccessKey {
  block_hash?: string;
  block_height?: number | string;
  nonce: number | string;
  permission:
    | string
    | {
        FunctionCall: {
          allowance: number | string;
          method_names: string[];
          receiver_id: string;
        };
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
  nonce: number | string;
  receiver_id: string;
  hash: string;
  actions: [Record<string, JsonAction>];
}

// Also used for non-json Near ExecutionStatus type
export interface JsonExecutionStatus {
  SuccessValue?: string;
  SuccessReceiptId?: string;
  Failure?: object;
}

export interface ExecutionProof {
  direction: string;
  hash: string;
}

export interface JsonExecutionOutcome {
  executor_id?: string;
  gas_burnt: number | string;
  logs: object[];
  metadata?: {
    gas_profile: null;
    version: number;
  };
  receipt_ids: string[];
  status: JsonExecutionStatus;
  tokens_burnt?: number | string;
}

export interface JsonExecutionOutcomeWithId {
  id: string;
  outcome: JsonExecutionOutcome;
  block_hash?: string;
  proof?: ExecutionProof[];
}

export interface JsonFinalExecutionOutcome {
  status: JsonExecutionStatus;
  transaction: JsonTransaction;
  transaction_outcome: JsonExecutionOutcomeWithId;
  receipts_outcome: JsonExecutionOutcomeWithId[];
}
