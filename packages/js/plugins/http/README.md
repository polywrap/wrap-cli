### HTTP Plugin

Http plugin curently supports two different methods `GET` and `POST`. Similar to calling axios, when defining request you need to specify response type.

If `"TEXT"` is selected this indicates that server will respond with textual response that will be just fowarded by HTTP plugin.

If `"BINARY"` is selected this indicates that server will respond with binary data (in axios this is _arraybuffer_) and than HTTP plugin will encode this bytes as **base64** string and return it.

When creating request it is also possible to define request headers and query parameters.

#### GET request

Below is sample invocation of `GET` request with custom request headers and query parameters (`urlParams`).

```ts
const response = await web3ApiClient.query<{ get: Response }>({
    uri: new Uri("w3://ens/http.web3api.eth"),
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

#### POST request

Below is sample invocation of `POST` request with custom request headers and query parameters (`urlParams`). It is also possible to set request body as shown below.

```ts
const response = await web3ApiClient.query<{ get: Response }>({
    uri: new Uri("w3://ens/http.web3api.eth"),
    query: `
        mutation {
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