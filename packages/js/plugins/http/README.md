# HTTP Plugin

Http plugin curently supports two different methods `GET` and `POST`. Similar to calling axios, when defining request you need to specify a response type. Headers and query parameters may also be defined.

## Response Types

`TEXT` - The server will respond with text, the HTTP plugin will return the text as-is.

`BINARY` - The server will respond with binary data (_ArrayBuffer_), the HTTP plugin will encode as a **base64** string and return it.

## GET request

Below is sample invocation of the `GET` request with custom request headers and query parameters (`urlParams`).

```ts
const response = await polywrapClient.query<{ get: Response }>({
uri: new Uri("wrap://ens/http.polywrap.eth"),
  query: `
    query {
      get(
        url: "http://www.example.com/api"
        request: {
          responseType: TEXT
          urlParams: [{key: "query", value: "foo"}]
          headers: [{key: "X-Request-Header", value: "req-foo"}]
        }
      )
    }
  `
})
```

## POST request

Below is sample invocation of the `POST` request with custom request headers and query parameters (`urlParams`). It is also possible to set request body as shown below.

```ts
const response = await polywrapClient.query<{ get: Response }>({
  uri: new Uri("wrap://ens/http.polywrap.eth"),
  query: `
    query {
      post(
        url: "http://www.example.com/api"
        request: {
          responseType: TEXT
          urlParams: [{key: "query", value: "foo"}]
          headers: [{key: "X-Request-Header", value: "req-foo"}]
          body: "{data: 'test-request'}"
        }
      )
    }
  `
})
```
