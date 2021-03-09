import { initTracer as initJaegerTracer } from "jaeger-client";
import * as opentracing from "opentracing";

const initTracer = (serviceName: string): opentracing.Tracer => {
  const config = {
    serviceName: serviceName,
    sampler: {
      type: "probabilistic",
      param: 0.001,
    },
    reporter: {
      logSpans: true,
    },
  };
  const options = {
    logger: {
      info: (msg: string) => {
        console.log("INFO ", msg);
      },
      error: (msg: string) => {
        console.log("ERROR ", msg);
      },
    },
  };
  return initJaegerTracer(config, options);
};

export default initTracer;
export * from "opentracing";
