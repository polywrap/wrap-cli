import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/tracing";
import * as api from "@opentelemetry/api";

class Web3APITracer {
  private _tracer: api.Tracer;

  constructor(
    public logEnabled: boolean = false,
    public tracerName: string = ""
  ) {
    if (logEnabled) {
      this.initProvider();

      this._tracer = api.trace.getTracer(tracerName);
    }
  }

  startSpan = (spanName: string) => {
    if (!this.logEnabled) return;

    this._tracer.startSpan(spanName);
  };

  setAttribute = (attrName: string, data: Object) => {
    if (!this.logEnabled) return;

    const span = api.getSpan(api.context.active());

    if (span) {
      span.setAttribute(attrName, JSON.stringify(data));
    }
  };

  addEvent = (event: string, data?: any) => {
    if (!this.logEnabled) return;

    const span = api.getSpan(api.context.active());

    if (span) {
      span.addEvent(event, { data: JSON.stringify(data) });
    }
  };

  recordException = (error: api.Exception) => {
    if (!this.logEnabled) return;

    const span = api.getSpan(api.context.active());

    if (span) {
      // recordException converts the error into a span event.
      span.recordException(error);

      // If the exception means the operation results in an
      // error state, you can also use it to update the span status.
      span.setStatus({ code: api.SpanStatusCode.ERROR });
    }
  };

  endSpan = () => {
    if (!this.logEnabled) return;

    const span = api.getSpan(api.context.active());
    if (span) span.end();
  };

  initProvider = () => {
    const provider = new BasicTracerProvider();

    // Configure span processor to send spans to the exporter
    provider.addSpanProcessor(
      new SimpleSpanProcessor(new ConsoleSpanExporter())
    );

    provider.register();
  };
}

export default Web3APITracer;
