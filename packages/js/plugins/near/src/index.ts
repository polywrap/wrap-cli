import { mutation, query } from "./resolvers";
import {
  manifest,
  Query,
  Mutation,
  Transaction,
  SignedTransaction,
  SignTransactionResult,
  FinalExecutionOutcome,
  AccountView,
} from "./w3";
import {
  fromAction,
  fromTx,
  toAccountView,
  toFinalExecutionOutcome,
  toPublicKey,
} from "./mapping";
import { AccountView as NearAccountView } from "./typeUtils";

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
}

export class NearPlugin extends Plugin {
  private near: nearApi.Near;
  private wallet?: nearApi.WalletConnection;

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

  private async connect(): Promise<boolean> {
    this.near = new nearApi.Near(this._config);
    if (typeof window !== "undefined") {
      this.wallet = new nearApi.WalletConnection(this.near, null);
    }
    return true;
  }

  public async requestSignIn(
    input: Query.Input_requestSignIn
  ): Promise<boolean> {
    if (!this.wallet) {
      throw Error(
        "Near wallet is unavailable, likely because browser tools are unavailable."
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getAccountId(input?: Query.Input_getAccountId): Promise<string | null> {
    return this.wallet?.getAccountId() ?? null;
  }

  public async accountState(
    input?: Query.Input_accountState // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<AccountView | null> {
    if (!this.wallet || !this.isSignedIn()) {
      return null;
    }
    const nearAccountView: NearAccountView = await this.near.connection.provider.query<NearAccountView>(
      {
        request_type: "view_account",
        account_id: this.wallet.getAccountId(),
        finality: "optimistic",
      }
    );
    return toAccountView(nearAccountView);
  }

  public async createTransaction(
    input: Query.Input_createTransaction
  ): Promise<Transaction> {
    const { senderId, receiverId, actions } = input;
    console.log(`calling createTransaction for sender ${senderId}`);

    const account = await this.near.account(senderId);
    const accessKeyInfo = await account.findAccessKey(
      receiverId,
      actions.map(fromAction)
    );
    if (!accessKeyInfo) {
      throw new Error(
        `Can not sign transactions for account ${senderId} on network ${this.near.connection.networkId}, no matching key pair found in ${this.near.connection.signer}.`
      );
    }
    const { accessKey } = accessKeyInfo;
    const publicKey = await this.near.connection.signer.getPublicKey(
      senderId,
      this.near.connection.networkId
    );
    const block = await this.near.connection.provider.block({
      finality: "final",
    });
    const blockHash = block.header.hash;
    const nonce = ++accessKey.nonce;

    return {
      signerId: senderId,
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
    const nearSignedTx = new nearApi.transactions.SignedTransaction(signedTx);
    const provider = this.near.connection.provider;
    const outcome = await provider.sendTransaction(nearSignedTx);
    return toFinalExecutionOutcome(outcome);
  }

  public async sendTransactionAsync(
    input: Mutation.Input_sendTransactionAsync
  ): Promise<FinalExecutionOutcome> {
    const { signedTx } = input;
    const nearSignedTx = new nearApi.transactions.SignedTransaction(signedTx);
    const provider = this.near.connection.provider;
    const outcome = await provider.sendTransactionAsync(nearSignedTx);
    return toFinalExecutionOutcome(outcome);
  }

  public async signAndSendTransaction(
    input: Mutation.Input_signAndSendTransaction
  ): Promise<FinalExecutionOutcome> {
    const transaction = await this.createTransaction(input);
    const { signedTx } = await this.signTransaction({ transaction });
    return await this.sendTransaction({ signedTx });
  }

  public async signAndSendTransactionAsync(
    input: Mutation.Input_signAndSendTransactionAsync
  ): Promise<FinalExecutionOutcome> {
    const transaction = await this.createTransaction(input);
    const { signedTx } = await this.signTransaction({ transaction });
    return await this.sendTransactionAsync({ signedTx });
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
