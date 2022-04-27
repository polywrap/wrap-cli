### Tracing

#### Steps to use tracing

1. Run the zipkin client using docker

    ```
    docker run -d -p 9411:9411 openzipkin/zipkin
    ```

2. Enable tracing when creating the `Web3ApiClient`

    ```typescript
    const client = new Web3ApiClient({
      ...,
      tracingEnabled: true
    })
    ```

    Or you can turn on tracing while running the `Web3ApiClient` by calling the `tracingEnabled` method of `Web3ApiClient`.

    ```typescript
    // Turn tracing off
    client.tracingEnabled(false);
    ```

3. Once you run the app and started producing logs, go to zipkin client which is running on `http://localhost:9411`. There you can click `RUN QUERY` button without any filters to show all the logs.
