### Tracing

#### Steps to use tracing

- Run the zipkin client using docker

  ```
  docker run -d -p 9411:9411 openzipkin/zipkin
  ```

- Enable tracing when creating the `Web3ApiClient`
  The second parameter of the `Web3ApiClient`'s constructor is `_traceEnabled`.

  ```
  new Web3ApiClient({ ... }, true)
  ```

  Or you can turn on tracing while running the `Web3ApiClient` by calling the `enableTracing` method of `Web3ApiClient`. (There's also the `disableTracing` method to disable tracing at any moment)

- Once you run the dapp and started producing logs, go to zipkin client which is running on `https://localhost:9411`.
  There you can just click `RUN QUERY` button without any filters to show all the logs.
