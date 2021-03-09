import { initTracer as initJaegerTracer, JaegerTracer } from "jaeger-client";

const initTracer = (serviceName: string): JaegerTracer => {
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
        console.log("Logger: INFO ", msg);
      },
      error: (msg: string) => {
        console.log("Logger: ERROR ", msg);
      },
    },
  };
  return initJaegerTracer(config, options);
};

export default initTracer;
