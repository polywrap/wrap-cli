## Web3API Logger

This logger uses Jaeger Tracing which is using OpenTracing.

#### Setup Jaeger UI (using docker)

```
docker pull jaegertracing/all-in-one:1.22

docker run \
  --rm \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 16686:16686 \
  jaegertracing/all-in-one:1.22 \
  --log-level=debug
```

Alternatively, Jaeger can be downloaded as a binary called `all-in-one` for different platforms from https://jaegertracing.io/download/.

Once the backend starts, the Jaeger UI will be accessible at http://localhost:16686.

#### Setup logging in the code

```
import initTracer from '@web3api/logger'

const tracer = initTracer("hello-world");

const span = tracer.startSpan("say-hello");
span.setTag("hello-to", helloTo);

const helloStr = `Hello, ${helloTo}!`;
span.log({
  event: "string-format",
  value: helloStr,
});

span.log({ event: "print-string" });
span.finish();
```
