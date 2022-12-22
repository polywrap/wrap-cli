import {
  WS_Module,
  Memory_Module,
  Args_send,
  Args_subscribe,
  Args_callback,
  Args_subscribeAndSend,
  Args_get,
  IModule
} from "./wrap";
import { Box } from "@polywrap/wasm-as";




export class Module extends IModule {
  send(args: Args_send): boolean {
    const id = WS_Module.open({
      url: args.url
    }).unwrap();
  
    WS_Module.send({
      id,
      message: args.message
    }).unwrap();
  
    return true
  }
  
  subscribe(args: Args_subscribe): boolean {
    const id = WS_Module.open({
      url: args.url
    }).unwrap();
  
    WS_Module.addCallback({
      id,
      callback: args.callback
    })
  
    return true;
  }
  
  callback(args: Args_callback): boolean {
    const id = Memory_Module.get({ key: "id" }).unwrap();
    const message = Memory_Module.get({ key: "message" }).unwrap();
  
    if (id && message) {
      WS_Module.send({ id: I32.parseInt(id), message }).unwrap();
    }
  
    return true;
  }
  
  subscribeAndSend(args: Args_subscribeAndSend): boolean {
    const id = WS_Module.open({
      url: args.url
    }).unwrap();
  
    WS_Module.addCallback({
      id,
      callback: args.callback
    })
  
    Memory_Module.set({ key: "id", value: id.toString() }).unwrap();
    Memory_Module.set({ key: "message", value: args.message }).unwrap();
  
    return true;
  }
  
  get(args: Args_get): string[] {
    const id = WS_Module.open({
      url: args.url
    }).unwrap();
  
    WS_Module.addCache({
      id
    }).unwrap()
  
    const messages = WS_Module.receive({ id, timeout: Box.from(args.timeout) }).unwrap();
  
    const data: string[] = messages.map<string>((msg) => msg.data);
  
    return data;
  }
}