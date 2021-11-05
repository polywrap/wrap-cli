import { mutation, query } from "./resolvers";
import {
  manifest,
  Query,
  Mutation,
  Transaction,
  SignedTransaction,
  SignTransactionResult,
  FinalExecutionOutcome,
  PublicKey,
  Json,
} from "./w3";
import { fromAction, fromSignedTx, fromTx, toPublicKey } from "./typeMapping";
import { parseJsonFinalExecutionOutcome } from "./jsonMapping";
import { JsonFinalExecutionOutcome } from "./jsonTypes";

import {
  Plugin,
  PluginFactory,
  PluginPackageManifest,
  PluginModules,
} from "@web3api/core-js";
import * as nearApi from "near-api-js";
import sha256 from "js-sha256";

export { keyStores as KeyStores, KeyPair } from "near-api-js";

export interface NearPluginConfig {
  networkId: string;
  keyStore: nearApi.keyStores.KeyStore;
  nodeUrl: string;
  walletUrl?: string;
  helperUrl?: string;
  explorerUrl?: string;
  masterAccount?: string;
  initialBalance?: string;
}

export class NearPlugin extends Plugin {
  private near: nearApi.Near;
  private wallet?: nearApi.WalletConnection;
  private _nextId = 123;

  constructor(private _config: NearPluginConfig) {
    super();
    void this.connect();
  }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: query(this),
      mutation: mutation(this),
    };
  }

  public async requestSignIn(
    input: Query.Input_requestSignIn
  ): Promise<boolean> {
    if (!this.wallet) {
      throw Error(
        "Near wallet is unavailable, likely because the NEAR plugin is operating outside of a browser."
      );
    }
    const { contractId, methodNames, successUrl, failureUrl } = input;
    await this.wallet.requestSignIn({
      contractId: contractId ?? undefined,
      methodNames: methodNames ?? undefined,
      successUrl: successUrl ?? undefined,
      failureUrl: failureUrl ?? undefined,
    });
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async signOut(input?: Query.Input_signOut): Promise<boolean> {
    this.wallet?.signOut();
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async isSignedIn(input?: Query.Input_isSignedIn): Promise<boolean> {
    return this.wallet?.isSignedIn() ?? false;
  }

  public async getAccountId(
    input?: Query.Input_getAccountId // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<string | null> {
    return this.wallet?.getAccountId() ?? null;
  }

  public async getPublicKey(
    input: Query.Input_getPublicKey
  ): Promise<PublicKey | null> {
    const { accountId } = input;
    const keyPair = await this._config.keyStore.getKey(
      this._config.networkId,
      accountId
    );
    if (keyPair === null) {
      return null;
    }
    return toPublicKey(keyPair.getPublicKey());
  }

  public async createTransactionWithWallet(
    input: Query.Input_createTransactionWithWallet
  ): Promise<Transaction> {
    const { receiverId, actions } = input;
    if (!this.wallet || !this.wallet.isSignedIn()) {
      throw Error(
        "Near wallet is unavailable, likely because the NEAR plugin is operating outside of a browser."
      );
    }
    const signerId = this.wallet.getAccountId();
    if (!signerId) {
      throw Error("User is not signed in to wallet.");
    }
    const walletAccount = new nearApi.ConnectedWalletAccount(
      this.wallet,
      this.near.connection,
      signerId
    );
    const localKey = await this.near.connection.signer.getPublicKey(
      signerId,
      this.near.connection.networkId
    );
    const accessKey = await walletAccount.accessKeyForTransaction(
      receiverId,
      actions.map(fromAction),
      localKey
    );
    if (!accessKey) {
      throw new Error(
        `Cannot find matching key for transaction sent to ${receiverId}`
      );
    }
    const block = await this.near.connection.provider.block({
      finality: "final",
    });
    const blockHash = block.header.hash;
    const nonce = accessKey.access_key.nonce + 1;
    const publicKey = nearApi.utils.PublicKey.from(accessKey.public_key);

    return {
      signerId: signerId,
      publicKey: toPublicKey(publicKey),
      nonce: nonce.toString(),
      receiverId: receiverId,
      blockHash: nearApi.utils.serialize.base_decode(blockHash),
      actions: actions,
    };
  }

  public async signTransaction(
    input: Query.Input_signTransaction
  ): Promise<SignTransactionResult> {
    const { transaction } = input;
    const tx: nearApi.transactions.Transaction = fromTx(transaction);
    const message = nearApi.utils.serialize.serialize(
      nearApi.transactions.SCHEMA,
      tx
    );
    const hash = new Uint8Array(sha256.sha256.array(message));
    const { signature: data } = await this.near.connection.signer.signMessage(
      message,
      transaction.signerId,
      this.near.connection.networkId
    );
    const signedTx: SignedTransaction = {
      transaction,
      signature: {
        keyType: transaction.publicKey.keyType,
        data,
      },
    };
    return { hash, signedTx };
  }

  public async sendJsonRpc(input: Mutation.Input_sendJsonRpc): Promise<Json> {
    const method = input.method;
    const params = JSON.parse(input.params);
    const result = await this._sendJsonRpc({ method, params });
    return JSON.stringify(result);
  }

  public async requestSignTransactions(
    input: Mutation.Input_requestSignTransactions
  ): Promise<boolean> {
    if (!this.wallet) {
      return false;
    }
    const { transactions, callbackUrl, meta } = input;
    await this.wallet.requestSignTransactions({
      transactions: transactions.map(fromTx),
      callbackUrl: callbackUrl ?? undefined,
      meta: meta ?? undefined,
    });
    return true;
  }

  public async sendTransaction(
    input: Mutation.Input_sendTransaction
  ): Promise<FinalExecutionOutcome> {
    const { signedTx } = input;
    const nearSignedTx = fromSignedTx(signedTx);
    const bytes = nearSignedTx.encode();
    const outcome = await this._sendJsonRpc<JsonFinalExecutionOutcome>({
      method: "broadcast_tx_commit",
      params: [Buffer.from(bytes).toString("base64")],
    });
    return parseJsonFinalExecutionOutcome(outcome);
  }

  public async sendTransactionAsync(
    input: Mutation.Input_sendTransactionAsync
  ): Promise<string> {
    const { signedTx } = input;
    const nearSignedTx = fromSignedTx(signedTx);
    const bytes = nearSignedTx.encode();
    return this._sendJsonRpc<string>({
      method: "broadcast_tx_async",
      params: [Buffer.from(bytes).toString("base64")],
    });
  }

  private async connect(): Promise<boolean> {
    this.near = new nearApi.Near(this._config);
    if (typeof window !== "undefined") {
      this.wallet = new nearApi.WalletConnection(this.near, null);
    }
    return true;
  }

  private async _sendJsonRpc<T>(input: {
    method: string;
    params: unknown;
  }): Promise<T> {
    const { method, params } = input;
    const request = {
      method,
      params: params,
      id: this._nextId++,
      jsonrpc: "2.0",
    };
    const { result, error } = await nearApi.utils.web.fetchJson(
      this._config.nodeUrl,
      JSON.stringify(request)
    );
    if (error) {
      throw Error(`[${error.code}] ${error.message}: ${error.data}`);
    }
    if (!result) {
      throw Error(`Exceeded attempts for request to ${method}.`);
    }
    return result;
  }
}

export const nearPlugin: PluginFactory<NearPluginConfig> = (
  opts: NearPluginConfig
) => {
  return {
    factory: () => new NearPlugin(opts),
    manifest: NearPlugin.manifest(),
  };
};

export const plugin = nearPlugin;
