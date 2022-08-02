import {
  Option,
} from "@polywrap/wasm-as";
import {
  WS_Module,
  WS_Message,
//  WS_Number,
  Logger_Module,
  Args_send,
  Args_callback,
  Args_subscribe,
  Args_get
} from "./wrap";
import {
  Args_receive
} from "./wrap/imported/WS_Module/serialization"

export function send(args: Args_send): boolean {
  const id = WS_Module.open({
    url: args.url
  }).unwrap();

  WS_Module.send({
    id,
    message: args.message
  }).unwrap();

  return true
}

export function callback(args: Args_callback): boolean {
  Logger_Module.log({message: args.data})
  return true;
}

export function subscribe(args: Args_subscribe): boolean {
  const id = WS_Module.open({
    url: args.url
  }).unwrap();

  WS_Module.addCallback({
    id,
    callback: args.callback
  })

  return true;
}

export function get(args: Args_get): string[] {
  const id = WS_Module.open({
    url: args.url
  }).unwrap();

  WS_Module.addCache({
    id
  }).unwrap().unwrap()

  WS_Module.send({
    id,
    message: args.message
  }).unwrap().unwrap();

  const messages = WS_Module.receive({ id, timeout: { value: 200 } }).unwrap();

  const data: string[] = messages.map<string>((msg) => msg.data);

  return data;
}
