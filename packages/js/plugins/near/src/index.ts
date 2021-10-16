import { mutation, query } from "./resolvers";
import {
  manifest,
  Transaction,
  SignedTransaction,
  SignTransactionResult,
  FinalExecutionOutcome,
} from "./w3";
import {
  fromAction,
  fromTx,
  toFinalExecutionOutcome,
  toPublicKey,
} from "./mapping";
import {
  Input_connect,
  Input_createTransaction,
  Input_signIn,
  Input_signOut,
  Input_signTransaction,
} from "./w3/query";
import {
  Input_requestSignTransactions,
  Input_sendTransaction,
  Input_sendTransactionAsync,
  Input_signAndSendTransaction,
  Input_signAndSendTransactionAsync,
} from "./w3/mutation";

import {
  Plugin,
  PluginFactory,
  PluginPackageManifest,
  PluginModules,
} from "@web3api/core-js";
import * as nearApi from "near-api-js";
import sha256 from "js-sha256";

export { keyStores } from "near-api-js";

export interface ConnectionConfig {
  networkId: string;
  nodeUrl: string;
  walletUrl?: string;
  helperUrl?: string;
  explorerUrl?: string;
}

export interface NearPluginConfig {
  connectionConfig: ConnectionConfig;
  keyStore?: nearApi.keyStores.KeyStore;
}

export class NearPlugin extends Plugin {
  private near: nearApi.Near;
  private wallet: nearApi.WalletConnection;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async connect(input?: Input_connect): Promise<boolean> {
    const config = this._config.connectionConfig;
    this.near = new nearApi.Near(config);
    this.wallet = new nearApi.WalletConnection(this.near, null);
    return true;
  }

  // TODO: write signIn(...) function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async signIn(input: Input_signIn): Promise<boolean> {
    return true;
  }

  // TODO: write signOut(...) function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async signOut(input: Input_signOut): Promise<boolean> {
    return true;
  }

  public async createTransaction(
    input: Input_createTransaction
  ): Promise<Transaction> {
    const { senderId, receiverId, actions } = input;
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
    input: Input_signTransaction
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
    input: Input_requestSignTransactions
  ): Promise<boolean> {
    const { transactions, callbackUrl, meta } = input;
    await this.wallet.requestSignTransactions({
      transactions: transactions.map(fromTx),
      callbackUrl: callbackUrl ?? undefined,
      meta: meta ?? undefined,
    });
    return true;
  }

  public async sendTransaction(
    input: Input_sendTransaction
  ): Promise<FinalExecutionOutcome> {
    const { signedTx } = input;
    const nearSignedTx = new nearApi.transactions.SignedTransaction(signedTx);
    const provider = this.near.connection.provider;
    const outcome = await provider.sendTransaction(nearSignedTx);
    return toFinalExecutionOutcome(outcome);
  }

  public async sendTransactionAsync(
    input: Input_sendTransactionAsync
  ): Promise<FinalExecutionOutcome> {
    const { signedTx } = input;
    const nearSignedTx = new nearApi.transactions.SignedTransaction(signedTx);
    const provider = this.near.connection.provider;
    const outcome = await provider.sendTransactionAsync(nearSignedTx);
    return toFinalExecutionOutcome(outcome);
  }

  public async signAndSendTransaction(
    input: Input_signAndSendTransaction
  ): Promise<FinalExecutionOutcome> {
    const transaction = await this.createTransaction(input);
    const { signedTx } = await this.signTransaction({ transaction });
    return await this.sendTransaction({ signedTx });
  }

  public async signAndSendTransactionAsync(
    input: Input_signAndSendTransactionAsync
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
