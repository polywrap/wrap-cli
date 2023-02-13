# @polywrap/uri-resolvers

## Description 

URI resolvers to customize URI resolution inside of the Polywrap Client.


## Resolvers

### RequestSynchronizerResolver

URI resolver that synchronizes requests to the same URI.
Multiple requests to the same URI will be resolved only once and the result will be cached for subsequent requests (only for the duration of that first request).
Can use the `shouldIgnoreCache` option to determine whether to ignore the cached request in case of an error (default is to use the cache)

Basic example:
```typescript
const client = new PolywrapCoreClient({
  resolver: RequestSynchronizerResolver.from(
    //your resolver here
  )
});
```

Example with `shouldIgnoreCache` error handler.
The following resolver will retry requests that return an error with the message: `URI temporarily unavailable`.
```typescript
const client = new PolywrapCoreClient({
  resolver: RequestSynchronizerResolver.from(
    //your resolver here,
    (error: Error) => {
      return error.message === "URI temporarily unavailable";
    }
  )
});
```