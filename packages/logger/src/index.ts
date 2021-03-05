import { initTracer as initJaegerTracer } from "jaeger-client";

const initTracer = (serviceName: string) => {
  const config = {
    serviceName: serviceName,
    sampler: {
      type: "const",
      param: 1,
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
        console.log("ERROR", msg);
      },
    },
  };
  return initJaegerTracer(config, options);
};

export default initTracer;
