# @polywrap/ws-plugin-js

WebSocket plugin allows Polywrap Client to interact with WebSocket servers.

## interface
See [schema.graphql](./src/schema.graphql).

## callback
Every incoming WebSocket message can be passed to a callback function in another wrapper. Use `addCallback` to start passing messages and `removeCallback` to stop. The callback function is expected to have a parameter `data`, i.e. `foo(data: string)`.

``` typescript
//assemblyscript

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
    callback: {
      uri: "wrap://ens/this.polywrap.eth",
      method: "callback"
    }
  })

  return true;
}

export function unsubscribe(args: Args_subscribe): boolean {
  const id = WS_Module.open({
    url: args.url
  }).unwrap();

  WS_Module.removeCallback({
    id,
    callback: {
      uri: "wrap://ens/this.polywrap.eth",
      method: "callback"
    }
  })

  return true;
}
```

## cache

Incoming WebSocket messages can be stored in the plugin and retrieved as an array later. Use `addCache` to start caching messages and `removeCache` to stop. Use `receive` to get an array of cached messages and empty the cache. Optionally, wait for a timeout, or a minimum number of cached messages before retrieving the array. 

``` typescript
//assemblyscript
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
 
  const messages = WS_Module.receive{ 
    id, 
    timeout: { value: 200 },
    quote: { value: 3 }
  }).unwrap();
 
  const data: string[] = messages.map<string>((msg) => msg.data);
 
  return data;
}
```
