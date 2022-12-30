import {
  CoreClient,
  Module,
  Message,
  Callback,
  Args_send,
  Args_open,
  Args_close,
  Args_addCallback,
  Args_removeCallback,
  Args_addCache,
  Args_removeCache,
  Args_receive,
  manifest,
} from "./wrap";

import { Uri } from "@polywrap/core-js";
import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";

type NoConfig = Record<string, never>;

export class WsPlugin extends Module<NoConfig> {
  private _sockets: WebSocket[] = [];
  private _callbacks: Record<string, (msg: Message) => void> = {};
  private _caches: Record<number, Message[]> = {};
  private _mutex = true;

  public async open(args: Args_open, _client: CoreClient): Promise<number> {
    const id = this._sockets.length;
    const socket = new WebSocket(args.url);
    this._sockets.push(socket);
    return await new Promise((resolve, reject) => {
      if (args.timeout) {
        setTimeout(() => {
          reject(new Error("timeout reached"));
        }, args.timeout);
      }
      this._sockets[id].onopen = () => {
        resolve(id);
      };
    });
  }

  public async close(args: Args_close, _client: CoreClient): Promise<boolean> {
    this._sockets[args.id].close();
    return await new Promise((resolve) => {
      this._sockets[args.id].onclose = () => {
        resolve(true);
      };
    });
  }

  public send(args: Args_send, _client: CoreClient): boolean {
    this._sockets[args.id].send(args.message);
    return true;
  }

  public addCallback(args: Args_addCallback, _client: CoreClient): boolean {
    const callbackId = this._callbackId(args.callback);
    this._callbacks[callbackId] = async (msg) => {
      await _client.invoke<{ callback: boolean }>({
        uri: Uri.from(args.callback.uri),
        method: args.callback.method,
        args: { data: msg.data },
      });
    };
    this._sockets[args.id].addEventListener(
      "message",
      this._callbacks[callbackId]
    );
    return true;
  }

  public removeCallback(
    args: Args_removeCallback,
    _client: CoreClient
  ): boolean {
    const callbackId = this._callbackId(args.callback);
    this._sockets[args.id].removeEventListener(
      "message",
      this._callbacks[callbackId]
    );
    return true;
  }

  public addCache(args: Args_addCache, _client: CoreClient): boolean {
    const callback = { uri: args.id.toString(), method: "cache" };
    const callbackId = this._callbackId(callback);
    this._caches[args.id] = [];
    this._callbacks[callbackId] = (msg) => {
      const message: Message = {
        origin: msg.origin,
        data: msg.data,
        lastEventId: msg.lastEventId,
      };
      const interval = setInterval(() => {
        if (this._mutex) {
          clearInterval(interval);
          this._caches[args.id].push(message);
        }
      }, 1);
    };
    this._sockets[args.id].addEventListener(
      "message",
      this._callbacks[callbackId]
    );
    return true;
  }

  public removeCache(args: Args_removeCache, _client: CoreClient): boolean {
    const callback = { uri: args.id.toString(), method: "cache" };
    const callbackId = this._callbackId(callback);
    this._sockets[args.id].removeEventListener(
      "message",
      this._callbacks[callbackId]
    );
    return true;
  }

  public async receive(
    args: Args_receive,
    _client: CoreClient
  ): Promise<Message[]> {
    return await new Promise((resolve) => {
      let interval: ReturnType<typeof setInterval>;
      const clear = () => {
        this._mutex = false;
        const cache = this._caches[args.id];
        this._caches[args.id] = [];
        this._mutex = true;
        resolve(cache);
      };
      if (args.min) {
        interval = setInterval(() => {
          if (args.min) {
            if (this._caches[args.id].length >= args.min) {
              clearInterval(interval);
              clear();
            }
          }
        }, 100);
      }
      if (args.timeout) {
        setTimeout(() => {
          clearInterval(interval);
          clear();
        }, args.timeout);
      }
      if (!args.timeout && !args.min) {
        clear();
      }
    });
  }

  private _callbackId(callback: Callback): string {
    return callback.uri + callback.method;
  }
}

export const wsPlugin: PluginFactory<NoConfig> = () =>
  new PluginPackage(new WsPlugin({}), manifest);

export const plugin = wsPlugin;
