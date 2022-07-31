# `@polywrap/tracing-js`

## Steps to use tracing

1. Run the zipkin client using docker

    ```
    docker run -d -p 9411:9411 openzipkin/zipkin
    ```

2. Enable tracing when creating the `PolywrapClient`

    ```typescript
    const client = new PolywrapClient({
      ...,
      tracingEnabled: true
    })
    ```

    Or you can turn on tracing while running the `PolywrapClient` by calling the `tracingEnabled` method of `PolywrapClient`.

    ```typescript
    // Turn tracing off
    client.tracingEnabled(false);
    ```

3. Once you run the app and started producing logs, go to zipkin client which is running on `http://localhost:9411`. There you can click `RUN QUERY` button without any filters to show all the logs.
