import {
  WS_Module,
  Args_send,
  Args_subscribe,
  Args_get
} from "./wrap";

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

  const messages = WS_Module.receive({ id, timeout: { value: args.timeout } }).unwrap();

  const data: string[] = messages.map<string>((msg) => msg.data);

  return data;
}
