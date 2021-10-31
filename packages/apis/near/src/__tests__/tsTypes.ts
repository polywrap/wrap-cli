export type UInt = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Int = number;
export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type Bytes = Uint8Array;
export type BigInt = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

export interface PublicKey {
  keyType: KeyType;
  data: Bytes;
}

export interface AccessKeyPermission {
  isFullAccess?: Boolean | null;
  receiverId?: String | null;
  methodNames?: Array<String> | null;
  allowance?: BigInt | null;
}

export interface AccessKey {
  nonce: BigInt;
  permission: AccessKeyPermission;
}

export interface AccessKeyInfo {
  publicKey: PublicKey;
  accessKey: AccessKey;
}

export interface Action {
  _?: String | null;
}

export type ActionUnion =
  | CreateAccount
  | DeployContract
  | FunctionCall
  | Transfer
  | Stake
  | AddKey
  | DeleteKey
  | DeleteAccount;

export interface CreateAccount {
  _?: String | null;
}

export interface DeployContract {
  code: Bytes;
  _?: String | null;
}

export interface FunctionCall {
  methodName: String;
  args: Bytes;
  gas: BigInt;
  deposit: BigInt;
  _?: String | null;
}

export interface Transfer {
  deposit: BigInt;
  _?: String | null;
}

export interface Stake {
  stake: BigInt;
  publicKey: PublicKey;
  _?: String | null;
}

export interface AddKey {
  publicKey: PublicKey;
  accessKey: AccessKey;
  _?: String | null;
}

export interface DeleteKey {
  publicKey: PublicKey;
  _?: String | null;
}

export interface DeleteAccount {
  beneficiaryId: String;
  _?: String | null;
}

export interface Transaction {
  signerId: String;
  publicKey: PublicKey;
  nonce: BigInt;
  receiverId: String;
  blockHash: Bytes;
  actions: Array<Action>;
}

export interface Signature {
  keyType: KeyType;
  data: Bytes;
}

export interface SignedTransaction {
  transaction: Transaction;
  signature: Signature;
}

export interface SignTransactionResult {
  hash: Bytes;
  signedTx: SignedTransaction;
}

export interface FinalExecutionStatus {
  successValue?: String | null;
  failure?: Json | null;
}

export interface ExecutionStatus {
  successValue?: String | null;
  successReceiptId?: String | null;
  failure?: Json | null;
}

export interface ExecutionOutcomeWithId {
  id: String;
  outcome: ExecutionOutcome;
}

export interface ExecutionOutcome {
  logs: Array<String>;
  receiptIds: Array<String>;
  gasBurnt: BigInt;
  status: ExecutionStatus;
}

export interface FinalExecutionOutcome {
  status: FinalExecutionStatus;
  transaction: Transaction;
  transaction_outcome: ExecutionOutcomeWithId;
  receipts_outcome: Array<ExecutionOutcomeWithId>;
}

export interface QueryResponseKind {
  blockHeight: BigInt;
  blockHash: String;
}

export interface AccountView {
  amount: String;
  locked: String;
  codeHash: String;
  storageUsage: BigInt;
  storagePaidAt: BigInt;
  blockHeight: BigInt;
  blockHash: String;
}

export enum KeyTypeEnum {
  ed25519,
}

export type KeyTypeString =
  | "ed25519"

export type KeyType = KeyTypeEnum | KeyTypeString;


export interface BlockReference {
  blockId?: string;
  finality?: string;
  syncCheckpoint?: string;
}

export interface BlockHeader {
  height: string;
  epoch_id: string;
  next_epoch_id: string;
  hash: string;
  prev_hash: string;
  prev_state_root: string;
  chunk_receipts_root: string;
  chunk_headers_root: string;
  chunk_tx_root: string;
  outcome_root: string;
  chunks_included: string;
  challenges_root: string;
  timestamp: string;
  timestamp_nanosec: string;
  random_value: string;
  validator_proposals: string[];
  chunk_mask: boolean[]
  gas_price: string;
  rent_paid: string;
  validator_reward: string;
  total_supply: string;
  challenges_result: string[];
  last_final_block: string;
  last_ds_final_block: string;
  next_bp_hash: string;
  block_merkle_root: string;
  approvals: string[];
  signature: string;
  latest_protocol_version: string;
}

export interface Chunk {
  chunk_hash: string;
  prev_block_hash: string;
  outcome_root: string;
  prev_state_root: string;
  encoded_merkle_root: string;
  encoded_length: string;
  height_created: string;
  height_included: string;
  shard_id: string;
  gas_used: string;
  gas_limit: string;
  rent_paid: string;
  validator_reward: string;
  balance_burnt: string;
  outgoing_receipts_root: string;
  tx_root: string;
  validator_proposals: string[];
  signature: string;
}

export interface BlockResult {
  author: string;
  header: BlockHeader;
  chunks: Chunk[];
}

/// Imported Objects START ///

/// Imported Objects END ///

/// Imported Queries START ///

/// Imported Queries END ///
